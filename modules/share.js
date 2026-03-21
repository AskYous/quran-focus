/**
 * Share video module — modal UI, audio fetching, generation orchestration.
 */
import { fetchQuranVerse } from './api.js';
import { getAyahAudioUrl } from './audioAyah.js';
import { quranData } from './quranData.js';
import {
  currentAyahNumber, currentReciterId
} from './state.js';
import { fetchVerseTimings } from './timingApi.js';
import { calculateGlobalAyahNumber, calculateSurahAndAyah } from './utils.js';
import { createEncoder, isVideoEncodingSupported } from './videoEncoder.js';
import { computeLayout, ensureFontsLoaded, renderAyahFrames } from './videoRenderer.js';

const MAX_RANGE = 30;
const FPS = 30;

let recitersData = [];
let currentGeneration = null; // for cancellation

/**
 * Initialize share module with reciters data.
 */
export function initShare(data) {
  recitersData = data;
  setupShareListeners();
}

function getCurrentSurahInfo() {
  const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(currentAyahNumber);
  const surah = quranData.find(s => s.number === surahNumber);
  return { surahNumber, ayahWithinSurah, surahName: surah?.name || '', ayahCount: surah?.ayahCount || 1 };
}

function getReciter() {
  return recitersData.find(r => r.id === currentReciterId) || null;
}

// ──────────────────────────────
// Modal UI
// ──────────────────────────────

async function openShareModal() {
  const supported = await isVideoEncodingSupported();
  if (!supported) {
    alert('Video generation is not supported in this browser. Please use Chrome 94+ or Safari 16.4+.');
    return;
  }

  const modal = document.getElementById('share-modal');
  const setupSection = document.getElementById('share-modal-setup');
  const progressSection = document.getElementById('share-modal-progress');
  if (!modal) return;

  // Show setup, hide progress
  setupSection?.classList.remove('hidden');
  progressSection?.classList.add('hidden');

  const { surahNumber, ayahWithinSurah, surahName, ayahCount } = getCurrentSurahInfo();

  // Set title
  const title = document.getElementById('share-modal-title');
  if (title) title.textContent = `Share — ${surahName.split(' (')[0]}`;

  // Populate dropdowns
  const fromSelect = document.getElementById('share-from-ayah');
  const toSelect = document.getElementById('share-to-ayah');
  if (fromSelect instanceof HTMLSelectElement && toSelect instanceof HTMLSelectElement) {
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    for (let i = 1; i <= ayahCount; i++) {
      fromSelect.add(new Option(`Ayah ${i}`, String(i)));
      toSelect.add(new Option(`Ayah ${i}`, String(i)));
    }
    fromSelect.value = String(ayahWithinSurah);
    toSelect.value = String(ayahWithinSurah);
  }

  validateRange();
  modal.classList.remove('hidden');
}

function closeShareModal() {
  const modal = document.getElementById('share-modal');
  if (modal) modal.classList.add('hidden');
  cancelGeneration();
}

function validateRange() {
  const fromSelect = document.getElementById('share-from-ayah');
  const toSelect = document.getElementById('share-to-ayah');
  const msg = document.getElementById('share-validation-msg');
  const btn = document.getElementById('share-generate-btn');

  if (!(fromSelect instanceof HTMLSelectElement) || !(toSelect instanceof HTMLSelectElement)) return;

  const from = parseInt(fromSelect.value);
  const to = parseInt(toSelect.value);

  // Auto-correct: to must be >= from
  if (to < from) {
    toSelect.value = String(from);
  }

  const range = parseInt(toSelect.value) - from + 1;

  if (range > MAX_RANGE) {
    if (msg) { msg.textContent = `Maximum ${MAX_RANGE} ayahs allowed.`; msg.classList.remove('hidden'); }
    if (btn instanceof HTMLButtonElement) btn.disabled = true;
  } else {
    if (msg) msg.classList.add('hidden');
    if (btn instanceof HTMLButtonElement) btn.disabled = false;
  }
}

function setupShareListeners() {
  const shareBtn = document.getElementById('share-video-btn');
  if (shareBtn) shareBtn.addEventListener('click', (e) => { e.stopPropagation(); openShareModal(); });

  const closeBtn = document.getElementById('share-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeShareModal);

  const cancelBtn = document.getElementById('share-cancel-generate-btn');
  if (cancelBtn) cancelBtn.addEventListener('click', cancelGeneration);

  const generateBtn = document.getElementById('share-generate-btn');
  if (generateBtn) generateBtn.addEventListener('click', startGeneration);

  const fromSelect = document.getElementById('share-from-ayah');
  const toSelect = document.getElementById('share-to-ayah');
  if (fromSelect) fromSelect.addEventListener('change', validateRange);
  if (toSelect) toSelect.addEventListener('change', validateRange);

  // Close on backdrop click
  const modal = document.getElementById('share-modal');
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) closeShareModal();
  });
}

// ──────────────────────────────
// Progress UI
// ──────────────────────────────

function showProgress(text, percent) {
  const progressText = document.getElementById('share-progress-text');
  const progressBar = document.getElementById('share-progress-bar');
  if (progressText) progressText.textContent = text;
  if (progressBar) progressBar.style.width = `${percent}%`;
}

function switchToProgress() {
  document.getElementById('share-modal-setup')?.classList.add('hidden');
  document.getElementById('share-modal-progress')?.classList.remove('hidden');
  showProgress('Preparing...', 0);
}

function switchToSetup() {
  document.getElementById('share-modal-setup')?.classList.remove('hidden');
  document.getElementById('share-modal-progress')?.classList.add('hidden');
}

// ──────────────────────────────
// Audio pipeline
// ──────────────────────────────

/**
 * Fetches and decodes audio for the selected range.
 * Returns { combinedPcm: Float32Array, sampleRate: number, perAyahDurations: number[] }
 */
async function fetchAudioForRange(surahNumber, fromAyah, toAyah) {
  const reciter = getReciter();
  const hasFlowing = !!reciter?.quranicAudioRecitationId;

  if (hasFlowing) {
    return fetchFlowingAudio(surahNumber, fromAyah, toAyah, reciter.quranicAudioRecitationId);
  } else {
    return fetchAyahByAyahAudio(surahNumber, fromAyah, toAyah);
  }
}

async function fetchFlowingAudio(surahNumber, fromAyah, toAyah, recitationId) {
  const timingData = await fetchVerseTimings(recitationId, surahNumber);
  if (!timingData) throw new Error('Could not fetch verse timings');

  // Fetch and decode full surah audio
  const response = await fetch(timingData.audioUrl);
  if (!response.ok) throw new Error('Failed to fetch surah audio');
  const arrayBuffer = await response.arrayBuffer();

  const audioCtx = new AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  const sampleRate = audioBuffer.sampleRate;

  // Find timing boundaries for our range
  const fromTiming = timingData.timings.find(t => t.verseKey === `${surahNumber}:${fromAyah}`);
  const toTiming = timingData.timings.find(t => t.verseKey === `${surahNumber}:${toAyah}`);
  if (!fromTiming || !toTiming) throw new Error('Timing data not found for selected range');

  const startSample = Math.floor((fromTiming.timestampFrom / 1000) * sampleRate);
  const endSample = Math.floor((toTiming.timestampTo / 1000) * sampleRate);

  // Extract mono PCM for the range
  const channelData = audioBuffer.getChannelData(0); // take first channel
  const combinedPcm = channelData.slice(startSample, endSample);

  // Per-ayah durations from timing data
  const perAyahDurations = [];
  for (let ayah = fromAyah; ayah <= toAyah; ayah++) {
    const t = timingData.timings.find(t => t.verseKey === `${surahNumber}:${ayah}`);
    if (t) {
      perAyahDurations.push((t.timestampTo - t.timestampFrom) / 1000);
    } else {
      perAyahDurations.push(3); // fallback
    }
  }

  await audioCtx.close();
  return { combinedPcm, sampleRate, perAyahDurations };
}

async function fetchAyahByAyahAudio(surahNumber, fromAyah, toAyah) {
  const audioCtx = new AudioContext();
  const buffers = [];

  for (let ayah = fromAyah; ayah <= toAyah; ayah++) {
    const globalAyah = calculateGlobalAyahNumber(surahNumber, ayah);
    const url = getAyahAudioUrl(globalAyah);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch audio for ayah ${ayah}`);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    buffers.push(audioBuffer);
  }

  const sampleRate = buffers[0].sampleRate;
  const perAyahDurations = buffers.map(b => b.duration);

  // Concatenate into single mono buffer
  const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
  const combinedPcm = new Float32Array(totalLength);
  let offset = 0;
  for (const buf of buffers) {
    combinedPcm.set(buf.getChannelData(0), offset);
    offset += buf.length;
  }

  await audioCtx.close();
  return { combinedPcm, sampleRate, perAyahDurations };
}

// ──────────────────────────────
// Generation orchestration
// ──────────────────────────────

function cancelGeneration() {
  if (currentGeneration) {
    currentGeneration.cancelled = true;
    currentGeneration.encoder?.cancel();
    currentGeneration = null;
  }
  switchToSetup();
}

async function startGeneration() {
  const fromSelect = document.getElementById('share-from-ayah');
  const toSelect = document.getElementById('share-to-ayah');
  if (!(fromSelect instanceof HTMLSelectElement) || !(toSelect instanceof HTMLSelectElement)) return;

  const { surahNumber, surahName } = getCurrentSurahInfo();
  const fromAyah = parseInt(fromSelect.value);
  const toAyah = parseInt(toSelect.value);
  const totalAyahs = toAyah - fromAyah + 1;

  switchToProgress();

  const generation = { cancelled: false, encoder: null };
  currentGeneration = generation;

  try {
    // Step 1: Ensure fonts
    showProgress('Loading fonts...', 5);
    await ensureFontsLoaded();
    if (generation.cancelled) return;

    // Step 2: Fetch verse data (in parallel)
    showProgress('Fetching verses...', 10);
    const ayahNumbers = [];
    for (let a = fromAyah; a <= toAyah; a++) ayahNumbers.push(a);
    const verseResults = await Promise.all(
      ayahNumbers.map(a => fetchQuranVerse(surahNumber, a))
    );
    const verses = verseResults.map((data, i) => {
      if (data.error) throw new Error(`Failed to load ayah ${ayahNumbers[i]}: ${data.error}`);
      return {
        arabic: data.arabic,
        translation: data.translation,
        translationDirection: data.translationDirection,
        reference: `${surahName.split(' (')[0]} (${surahNumber}:${ayahNumbers[i]})`
      };
    });
    if (generation.cancelled) return;

    // Step 3: Fetch audio
    showProgress('Loading audio...', 25);
    const { combinedPcm, sampleRate, perAyahDurations } = await fetchAudioForRange(surahNumber, fromAyah, toAyah);
    if (generation.cancelled) return;

    // Step 4: Set up encoder
    showProgress('Initializing encoder...', 35);
    const encoder = await createEncoder({ width: 1080, height: 1920, fps: FPS, sampleRate });
    generation.encoder = encoder;
    if (generation.cancelled) return;

    // Step 5: Add audio
    encoder.addAudio(combinedPcm, sampleRate);

    // Step 6: Render frames for each ayah
    const canvas = document.getElementById('share-video-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) throw new Error('Canvas not found');
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < verses.length; i++) {
      if (generation.cancelled) return;
      const pct = 40 + Math.round((i / totalAyahs) * 55);
      showProgress(`Rendering ayah ${i + 1} of ${totalAyahs}...`, pct);

      const layout = computeLayout(ctx, verses[i]);
      await renderAyahFrames(ctx, layout, perAyahDurations[i], FPS, encoder, canvas);
    }

    if (generation.cancelled) return;

    // Step 7: Finalize
    showProgress('Finalizing video...', 95);
    const blob = await encoder.finalize();

    showProgress('Done!', 100);
    currentGeneration = null;

    // Step 8: Share or download
    const filename = `quran_${surahNumber}_${fromAyah}-${toAyah}.mp4`;
    await shareOrDownload(blob, filename);
    closeShareModal();

  } catch (error) {
    if (!generation.cancelled) {
      console.error('Video generation failed:', error);
      alert(`Video generation failed: ${error.message}`);
      switchToSetup();
    }
    currentGeneration = null;
  }
}

// ──────────────────────────────
// Share / Download
// ──────────────────────────────

async function shareOrDownload(blob, filename) {
  const file = new File([blob], filename, { type: 'video/mp4' });

  // Try Web Share API (mobile)
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Quran Focus' });
      return;
    } catch (e) {
      if (e.name === 'AbortError') return; // user cancelled share
      console.warn('Web Share failed, falling back to download:', e);
    }
  }

  // Fallback: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

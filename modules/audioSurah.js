import { currentReciterId } from './state.js';
import { fetchVerseTimings } from './timingApi.js';

let recitersData = null;
let currentTimings = null;
let currentSurahNumber = null;
let onAyahChangeCallback = null;

export function setRecitersData(data) {
  recitersData = data;
}

export function setOnAyahChangeCallback(callback) {
  onAyahChangeCallback = callback;
}

/**
 * Gets the recitation ID for the QDC timing/audio API.
 */
function getRecitationId() {
  if (!recitersData) return null;
  const reciter = recitersData.find(r => r.id === currentReciterId);
  return reciter?.quranicAudioRecitationId || null;
}

/**
 * Loads a full-surah audio file and fetches its timing data.
 * Uses the QDC API which provides both the correct audio URL and verse timings.
 * @param {number} surahNumber
 * @param {HTMLAudioElement} audioPlayer
 * @param {number} [seekToAyah] - Optional ayah number to seek to after loading
 * @returns {Promise<boolean>} - true if loaded successfully
 */
export async function loadSurahAudio(surahNumber, audioPlayer, seekToAyah = 1) {
  const recitationId = getRecitationId();

  if (!recitationId) {
    console.warn('Flowing mode not available for current reciter');
    return false;
  }

  // Fetch audio URL + timings from QDC API
  const result = await fetchVerseTimings(recitationId, surahNumber);

  if (!result || !result.timings || !result.audioUrl) {
    console.warn('Verse timings or audio URL not available, cannot use flowing mode');
    return false;
  }

  // Load the audio using the URL from the API
  const audioLoaded = await new Promise((resolve) => {
    audioPlayer.src = result.audioUrl;
    audioPlayer.load();

    let resolved = false;
    const timeoutId = setTimeout(() => {
      if (!resolved) { resolved = true; resolve(false); }
    }, 10000);

    audioPlayer.oncanplay = () => {
      if (!resolved) {
        clearTimeout(timeoutId);
        audioPlayer.oncanplay = null;
        resolved = true;
        resolve(true);
      }
    };
    audioPlayer.onerror = () => {
      if (!resolved) {
        clearTimeout(timeoutId);
        audioPlayer.onerror = null;
        resolved = true;
        console.warn('Failed to load surah audio:', result.audioUrl);
        resolve(false);
      }
    };
  });

  if (!audioLoaded) {
    return false;
  }

  currentTimings = result.timings;
  currentSurahNumber = surahNumber;

  if (seekToAyah > 1) {
    seekToAyahInSurah(seekToAyah, audioPlayer);
  }

  return true;
}

/**
 * Seeks to the start of a specific ayah within the currently loaded surah.
 */
export function seekToAyahInSurah(ayahNumber, audioPlayer) {
  if (!currentTimings) return false;
  const timing = currentTimings.find(t => t.verseKey === `${currentSurahNumber}:${ayahNumber}`);
  if (timing) {
    audioPlayer.currentTime = timing.timestampFrom / 1000;
    return true;
  }
  return false;
}

/**
 * Called on audio timeupdate. Checks if playback crossed an ayah boundary.
 */
let lastReportedVerse = null;

export function handleTimeUpdate(audioPlayer) {
  if (!currentTimings) return;
  if (!onAyahChangeCallback) return;

  const currentTimeMs = audioPlayer.currentTime * 1000;

  for (const timing of currentTimings) {
    if (currentTimeMs >= timing.timestampFrom && currentTimeMs < timing.timestampTo) {
      const [surah, ayah] = timing.verseKey.split(':').map(Number);
      const verseKey = timing.verseKey;
      if (verseKey !== lastReportedVerse) {
        console.log(`[Flowing] Ayah boundary: ${verseKey} (${Math.round(currentTimeMs)}ms)`);
        lastReportedVerse = verseKey;
      }
      onAyahChangeCallback(surah, ayah);
      return;
    }
  }
}

/**
 * Gets the currently loaded surah number.
 */
export function getCurrentSurahNumber() {
  return currentSurahNumber;
}

/**
 * Called when surah audio ends. Resets state.
 */
export function onSurahAudioEnded() {
  currentTimings = null;
  currentSurahNumber = null;
}

/**
 * Checks if the current reciter supports flowing mode.
 */
export function supportsFlowingMode() {
  return getRecitationId() !== null;
}

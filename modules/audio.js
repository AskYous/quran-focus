import { loadAndDisplayAyah } from '../script.js';
import { trackAudioPause, trackAudioPlay } from './analytics.js';
import { loadAyahAudio, setRecitersData as setAyahRecitersData } from './audioAyah.js';
import {
  getCurrentSurahNumber, handleTimeUpdate, loadSurahAudio,
  onSurahAudioEnded, seekToAyahInSurah, setOnAyahChangeCallback,
  setRecitersData as setSurahRecitersData, supportsFlowingMode
} from './audioSurah.js';
import { currentAyahNumber, playbackMode, setWasPlayingBeforeNavigation } from './state.js';
import { calculateSurahAndAyah } from './utils.js';

/**
 * Initialize audio module with reciters data.
 */
export function initAudio(recitersData) {
  setAyahRecitersData(recitersData);
  setSurahRecitersData(recitersData);
}

// Re-export for external use
export { setOnAyahChangeCallback, getCurrentSurahNumber, seekToAyahInSurah, supportsFlowingMode };

function triggerPlayFeedbackAnimation() {
  const arabicText = document.getElementById('arabic-text');
  const translationText = document.getElementById('translation-text');

  if (arabicText) {
    arabicText.classList.add('play-feedback-trigger');
    setTimeout(() => arabicText.classList.remove('play-feedback-trigger'), 600);
  }
  if (translationText) {
    translationText.classList.add('play-feedback-trigger');
    setTimeout(() => translationText.classList.remove('play-feedback-trigger'), 600);
  }
}

/**
 * Updates the play/pause button UI.
 */
export function updatePlayPauseButton(showPlay) {
  const playIcon = document.querySelector('.play-icon');
  const pauseIcon = document.querySelector('.pause-icon');

  if (playIcon instanceof HTMLElement && pauseIcon instanceof HTMLElement) {
    playIcon.style.display = showPlay ? 'block' : 'none';
    pauseIcon.style.display = showPlay ? 'none' : 'block';
  }

  // When audio starts playing, always update (clears loading state).
  // When paused, don't override loading state from intermediate calls.
  if (!showPlay || !isAudioLoading) {
    setAudioStatus(showPlay ? 'paused' : 'playing');
  }
}

let isAudioLoading = false;

// Web Audio API analyser for visualizer
let audioContext = null;
let analyser = null;
let sourceNode = null;
let animationFrameId = null;

let analyserFailed = false;

function ensureAnalyser() {
  if (analyserFailed) return;
  const audioPlayer = document.getElementById('ayah-audio-player');
  if (!(audioPlayer instanceof HTMLAudioElement)) return;
  if (sourceNode) return; // already connected

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    sourceNode = audioContext.createMediaElementSource(audioPlayer);
    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);
  } catch (e) {
    console.warn('Web Audio analyser not available, using fallback animation');
    analyserFailed = true;
    analyser = null;
  }
}

function startVisualizer() {
  const bars = document.querySelectorAll('.eq-bar');
  if (!bars.length) return;

  // Fallback: CSS-driven animation if analyser unavailable or CORS blocks frequency data
  if (!analyser) {
    useFallbackAnimation(bars);
    return;
  }

  if (audioContext?.state === 'suspended') audioContext.resume();

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const bandIndices = [1, 3, 5, 8, 12];
  let silentFrames = 0;

  function draw() {
    analyser.getByteFrequencyData(dataArray);

    // Check if analyser is producing data (CORS may block it)
    const sum = dataArray.reduce((a, b) => a + b, 0);
    if (sum === 0) {
      silentFrames++;
      if (silentFrames > 30) {
        // ~0.5s of silence while playing → CORS likely blocking, switch to fallback
        useFallbackAnimation(bars);
        return;
      }
    } else {
      silentFrames = 0;
    }

    bars.forEach((bar, i) => {
      const idx = bandIndices[Math.min(i, bandIndices.length - 1)];
      const value = idx < bufferLength ? dataArray[idx] : 0;
      const height = 2 + (value / 255) * 14;
      bar.style.height = `${height}px`;
    });

    animationFrameId = requestAnimationFrame(draw);
  }

  cancelAnimationFrame(animationFrameId);
  draw();
}

function useFallbackAnimation(bars) {
  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  // Apply CSS animation as fallback
  const delays = [0, 0.15, 0.3, 0.15, 0];
  bars.forEach((bar, i) => {
    bar.style.height = '';
    bar.style.animation = `eqFallback 0.8s ${delays[i]}s ease-in-out infinite alternate`;
  });
}

function stopVisualizer() {
  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;

  const bars = document.querySelectorAll('.eq-bar');
  bars.forEach(bar => {
    bar.style.height = '2px';
    bar.style.animation = '';
  });
}

/**
 * Sets the audio status indicator state.
 * @param {'loading' | 'playing' | 'paused' | 'hidden'} state
 */
export function setAudioStatus(state) {
  const el = document.getElementById('audio-status');
  if (!el) return;

  if (state === 'loading') {
    isAudioLoading = true;
  } else {
    isAudioLoading = false;
  }

  el.classList.remove('hidden', 'loading', 'playing', 'paused');

  if (state === 'hidden') {
    el.classList.add('hidden');
    stopVisualizer();
  } else {
    el.classList.add(state);
    if (state === 'playing') {
      ensureAnalyser();
      startVisualizer();
    } else {
      stopVisualizer();
    }
  }
}

/**
 * Loads audio for a given global ayah number using the active strategy.
 */
export function playAyahAudio(ayahNumber) {
  const audioPlayer = document.getElementById('ayah-audio-player');
  if (!(audioPlayer instanceof HTMLAudioElement)) return Promise.resolve();

  updatePlayPauseButton(true);

  if (playbackMode === 'flowing' && supportsFlowingMode()) {
    const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(ayahNumber);
    const loadedSurah = getCurrentSurahNumber();

    if (loadedSurah === surahNumber) {
      // Same surah — just seek
      seekToAyahInSurah(ayahWithinSurah, audioPlayer);
      return Promise.resolve();
    } else {
      // Different surah — load new surah audio
      return loadSurahAudio(surahNumber, audioPlayer, ayahWithinSurah).then(success => {
        if (!success) {
          // Fallback to ayah-by-ayah
          return loadAyahAudio(ayahNumber, audioPlayer);
        }
      });
    }
  } else {
    return loadAyahAudio(ayahNumber, audioPlayer);
  }
}

/**
 * Toggles between playing and pausing audio.
 */
export function togglePlayPause() {
  const audioPlayer = document.getElementById('ayah-audio-player');
  if (!(audioPlayer instanceof HTMLAudioElement)) return;

  if (isAudioLoading) return; // Prevent clicks while loading

  if (audioPlayer.paused) {
    if (!audioPlayer.src || audioPlayer.src === window.location.href || audioPlayer.src === '') {
      console.log("No valid audio source, loading current ayah audio on demand.");

      const arabicTextElement = document.getElementById('arabic-text');
      if (!arabicTextElement || !arabicTextElement.textContent) {
        setAudioStatus('loading');
        loadAndDisplayAyah(currentAyahNumber).then(() => {
          triggerPlayFeedbackAnimation();
        }).catch(err => {
          console.error("Error loading ayah on toggle play:", err);
          setAudioStatus('hidden');
        });
      } else {
        triggerPlayFeedbackAnimation();
        setAudioStatus('loading');
        playAyahAudio(currentAyahNumber).then(() => {
          playAudio();
        }).catch(err => {
          console.error("Error loading audio on demand:", err);
          setAudioStatus('paused');
        });
      }
    } else {
      playAudio();
    }
  } else {
    audioPlayer.pause();
    updatePlayPauseButton(true);
    setWasPlayingBeforeNavigation(false);
    triggerPlayFeedbackAnimation();

    const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(currentAyahNumber);
    trackAudioPause(surahNumber, ayahWithinSurah);
  }
}

/**
 * Plays the audio currently loaded in the player.
 */
export function playAudio() {
  const audioPlayer = document.getElementById('ayah-audio-player');
  if (!(audioPlayer instanceof HTMLAudioElement)) return;

  if (!audioPlayer.src || audioPlayer.src === window.location.href) return;

  const doPlay = () => {
    audioPlayer.play()
      .then(() => {
        updatePlayPauseButton(false);
        setWasPlayingBeforeNavigation(true);
        triggerPlayFeedbackAnimation();

        const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(currentAyahNumber);
        trackAudioPlay(surahNumber, ayahWithinSurah);
      })
      .catch(error => {
        console.error('Error playing audio:', error);
        updatePlayPauseButton(true);
        setWasPlayingBeforeNavigation(false);
      });
  };

  if (audioPlayer.readyState >= 3) {
    doPlay();
  } else {
    setAudioStatus('loading');
    audioPlayer.addEventListener('canplay', doPlay, { once: true });
    setTimeout(() => {
      if (audioPlayer.paused) {
        updatePlayPauseButton(true);
      }
    }, 7000);
  }
}

/**
 * Sets up the timeupdate listener for flowing mode.
 */
export function setupFlowingModeListener() {
  const audioPlayer = document.getElementById('ayah-audio-player');
  if (!(audioPlayer instanceof HTMLAudioElement)) return;

  audioPlayer.addEventListener('timeupdate', () => {
    if (playbackMode === 'flowing') {
      handleTimeUpdate(audioPlayer);
    }
  });
}

/**
 * Stops current audio and clears the source.
 */
export function stopAudio() {
  const audioPlayer = document.getElementById('ayah-audio-player');
  if (audioPlayer instanceof HTMLAudioElement) {
    audioPlayer.pause();
    audioPlayer.src = '';
    updatePlayPauseButton(true);
    setWasPlayingBeforeNavigation(false);
  }
  onSurahAudioEnded();
  setAudioStatus('hidden');
}

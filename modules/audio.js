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

  if (audioPlayer.paused) {
    if (!audioPlayer.src || audioPlayer.src === window.location.href || audioPlayer.src === '') {
      console.log("No valid audio source, loading current ayah audio on demand.");

      const arabicTextElement = document.getElementById('arabic-text');
      if (!arabicTextElement || !arabicTextElement.textContent) {
        loadAndDisplayAyah(currentAyahNumber).then(() => {
          triggerPlayFeedbackAnimation();
        }).catch(err => console.error("Error loading ayah on toggle play:", err));
      } else {
        triggerPlayFeedbackAnimation();
        updatePlayPauseButton(false);
        playAyahAudio(currentAyahNumber).then(() => {
          playAudio();
        }).catch(err => {
          console.error("Error loading audio on demand:", err);
          updatePlayPauseButton(true);
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
}

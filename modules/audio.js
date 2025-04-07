import { loadAndDisplayAyah } from '../script.js'; // Main script handles loading logic
import { trackAudioPause, trackAudioPlay } from './analytics.js'; // Import analytics tracking
import { currentAyahNumber, setWasPlayingBeforeNavigation } from './state.js';
import { calculateSurahAndAyah, padNumber } from './utils.js';

/**
 * Helper function to apply the visual feedback animation.
 */
function triggerPlayFeedbackAnimation() {
  const arabicText = document.getElementById('arabic-text');
  const translationText = document.getElementById('translation-text');

  if (arabicText) {
    arabicText.classList.add('play-feedback-trigger');
    setTimeout(() => arabicText.classList.remove('play-feedback-trigger'), 600); // Match animation duration
  }
  if (translationText) {
    translationText.classList.add('play-feedback-trigger');
    setTimeout(() => translationText.classList.remove('play-feedback-trigger'), 600);
  }
}

/**
 * Updates the play/pause button UI.
 * @param {boolean} showPlay True to show play icon, false for pause.
 */
export function updatePlayPauseButton(showPlay) {
  const playIcon = document.querySelector('.play-icon');
  const pauseIcon = document.querySelector('.pause-icon');

  if (playIcon instanceof HTMLElement && pauseIcon instanceof HTMLElement) {
    playIcon.style.display = showPlay ? 'block' : 'none';
    pauseIcon.style.display = showPlay ? 'none' : 'block';
  } else {
    console.warn('Play/pause icons not found or not HTMLElements.');
  }
}

/**
 * Loads the audio source for a given global Ayah number.
 * Does not play automatically.
 * @param {number} ayahNumber Global Ayah number.
 * @returns {Promise<void>} Promise that resolves when audio can play or on error/timeout.
 */
export function playAyahAudio(ayahNumber) {
  const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(ayahNumber);
  const paddedSurah = padNumber(surahNumber, 3);
  const paddedAyah = padNumber(ayahWithinSurah, 3);
  const audioURL = `https://everyayah.com/data/khalefa_al_tunaiji_64kbps/${paddedSurah}${paddedAyah}.mp3`;

  const audioPlayerElement = document.getElementById('ayah-audio-player');
  if (!(audioPlayerElement instanceof HTMLAudioElement)) {
    console.error('Audio player element not found or invalid.');
    return Promise.resolve();
  }
  const audioPlayer = audioPlayerElement;
  audioPlayer.src = audioURL;
  updatePlayPauseButton(true); // Default to showing play
  audioPlayer.load();

  return new Promise((resolve) => {
    let resolved = false;
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        console.warn(`Audio ${ayahNumber} timed out loading.`);
        resolved = true;
        resolve(); // Resolve even on timeout
      }
    }, 5000); // Increased timeout

    audioPlayer.oncanplaythrough = () => {
      if (!resolved) {
        clearTimeout(timeoutId);
        audioPlayer.oncanplaythrough = null;
        resolved = true;
        resolve();
      }
    };
    audioPlayer.onerror = () => {
      if (!resolved) {
        clearTimeout(timeoutId);
        console.error(`Error loading audio ${ayahNumber}`);
        audioPlayer.onerror = null;
        resolved = true;
        resolve(); // Resolve anyway
      }
    };
  });
}

/**
 * Toggles between playing and pausing audio, handling local and cast scenarios.
 */
export function togglePlayPause() {
  // @ts-ignore - Cast types are external
  // if (castSession && castSession.getSessionState() === cast.framework.SessionState.SESSION_STARTED) {
  //   // Casting session active - control remote player
  //   // @ts-ignore
  //   const remotePlayer = new cast.framework.RemotePlayer();
  //   // @ts-ignore
  //   const remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);
  //   remotePlayerController.playOrPause();
  //   // Button state updated by IS_PAUSED_CHANGED listener in cast.js
  // } else {
  // No casting session - control local player
  const audioPlayerElement = document.getElementById('ayah-audio-player');
  if (!(audioPlayerElement instanceof HTMLAudioElement)) return;
  const audioPlayer = audioPlayerElement;

  if (audioPlayer.paused) {
    // Check if src is missing, points to the page itself (initial state), or is empty
    if (!audioPlayer.src || audioPlayer.src === window.location.href || audioPlayer.src === '') {
      console.log("No valid audio source, attempting to load current ayah first.");
      loadAndDisplayAyah(currentAyahNumber).then(() => {
        // Playback might be handled by loadVerse, but trigger feedback on intent
        triggerPlayFeedbackAnimation();
      }).catch(err => console.error("Error loading ayah on toggle play:", err));
    } else {
      playAudio(); // Play existing source (playAudio will trigger feedback)
    }
  } else {
    audioPlayer.pause();
    updatePlayPauseButton(true);
    setWasPlayingBeforeNavigation(false);
    triggerPlayFeedbackAnimation(); // Feedback on pause

    // Track audio pause
    const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(currentAyahNumber);
    trackAudioPause(surahNumber, ayahWithinSurah);
  }
  // }
}

/**
 * Plays the audio currently loaded in the local player.
 */
export function playAudio() {
  const audioPlayerElement = document.getElementById('ayah-audio-player');
  if (!(audioPlayerElement instanceof HTMLAudioElement)) {
    console.log('Audio element not found or not an audio element.');
    return;
  }
  const audioPlayer = audioPlayerElement;

  if (!audioPlayer.src || audioPlayer.src === window.location.href) {
    console.log('No valid audio source to play');
    return;
  }

  console.log('Attempting to play audio:', audioPlayer.src);

  if (audioPlayer.readyState >= 3) {
    audioPlayer.play()
      .then(() => {
        console.log('Audio playback started successfully');
        updatePlayPauseButton(false);
        setWasPlayingBeforeNavigation(true);
        triggerPlayFeedbackAnimation(); // Feedback on play

        // Track audio play
        const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(currentAyahNumber);
        trackAudioPlay(surahNumber, ayahWithinSurah);
      })
      .catch(error => {
        console.error('Error playing audio:', error);
        if (error.name === 'NotAllowedError') {
          console.log('Playback prevented, possibly requires user interaction.');
        }
        updatePlayPauseButton(true);
        setWasPlayingBeforeNavigation(false);
      });
  } else {
    console.log('Audio not ready, waiting for canplay event...');
    audioPlayer.addEventListener('canplay', () => {
      console.log('Audio is now ready, playing...');
      audioPlayer.play()
        .then(() => {
          console.log('Audio playback started successfully after wait');
          updatePlayPauseButton(false);
          setWasPlayingBeforeNavigation(true);
          triggerPlayFeedbackAnimation(); // Feedback on play

          // Track audio play
          const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(currentAyahNumber);
          trackAudioPlay(surahNumber, ayahWithinSurah);
        })
        .catch(error => {
          console.error('Error playing audio after wait:', error);
          updatePlayPauseButton(true);
          setWasPlayingBeforeNavigation(false);
        });
    }, { once: true });

    setTimeout(() => {
      if (audioPlayer.paused) {
        console.warn('Audio never reached canplay state, play attempt timed out.');
        updatePlayPauseButton(true);
      }
    }, 7000); // Increased timeout for play attempt
  }
}

/**
 * Updates the play/pause button icon.
 * @param {boolean} showPlay True to show play icon, false to show pause icon.
 */

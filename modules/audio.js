import { loadAndDisplayAyah } from '../script.js'; // Main script handles loading logic
import { audioControlsTimeout, castSession, currentAyahNumber, isUserInteractingWithAudio, setAudioControlsTimeout, setWasPlayingBeforeNavigation } from './state.js';
import { calculateSurahAndAyah, padNumber } from './utils.js';

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
  if (castSession && castSession.getSessionState() === cast.framework.SessionState.SESSION_STARTED) {
    // Casting session active - control remote player
    // @ts-ignore
    const remotePlayer = new cast.framework.RemotePlayer();
    // @ts-ignore
    const remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);
    remotePlayerController.playOrPause();
    // Button state updated by IS_PAUSED_CHANGED listener in cast.js
  } else {
    // No casting session - control local player
    const audioPlayerElement = document.getElementById('ayah-audio-player');
    if (!(audioPlayerElement instanceof HTMLAudioElement)) return;
    const audioPlayer = audioPlayerElement;

    if (audioPlayer.paused) {
      // Check if src is missing, points to the page itself (initial state), or is empty
      if (!audioPlayer.src || audioPlayer.src === window.location.href || audioPlayer.src === '') {
        console.log("No valid audio source, attempting to load current ayah first.");
        // Ensure loadAndDisplayAyah is called correctly
        // It now returns a promise, we should ideally wait for it,
        // but for simplicity, we trigger playAudio after a short delay or rely on loadAndDisplayAyah's internal logic.
        loadAndDisplayAyah(currentAyahNumber).then(() => {
          // playAudio might be called internally by loadAndDisplayAyah if wasPlayingBeforeNavigation is true
          // If not, we might need to call it here explicitly if we always want play on first click.
          // For now, let's assume loadAndDisplayAyah handles the play state correctly.
        }).catch(err => console.error("Error loading ayah on toggle play:", err));
      } else {
        playAudio(); // Play existing source
      }
    } else {
      audioPlayer.pause();
      updatePlayPauseButton(true);
      setWasPlayingBeforeNavigation(false);
    }
  }
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
    // Maybe load the current ayah here? Or rely on togglePlayPause logic.
    // loadAndDisplayAyah(currentAyahNumber); // Example: Trigger load if no source
    return;
  }

  console.log('Attempting to play audio:', audioPlayer.src);

  // Ensure the player is ready before playing
  if (audioPlayer.readyState >= 3) { // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
    audioPlayer.play()
      .then(() => {
        console.log('Audio playback started successfully');
        updatePlayPauseButton(false);
        setWasPlayingBeforeNavigation(true);
      })
      .catch(error => {
        console.error('Error playing audio:', error);
        if (error.name === 'NotAllowedError') {
          console.log('Playback prevented, possibly requires user interaction.');
        }
        updatePlayPauseButton(true); // Reset button state on error
        setWasPlayingBeforeNavigation(false);
      });
  } else {
    console.log('Audio not ready, waiting for canplay event...');
    // Wait for the audio to be ready
    audioPlayer.addEventListener('canplay', () => {
      console.log('Audio is now ready, playing...');
      audioPlayer.play()
        .then(() => {
          console.log('Audio playback started successfully after wait');
          updatePlayPauseButton(false);
          setWasPlayingBeforeNavigation(true);
        })
        .catch(error => {
          console.error('Error playing audio after wait:', error);
          updatePlayPauseButton(true);
          setWasPlayingBeforeNavigation(false);
        });
    }, { once: true }); // Ensure listener is removed after firing

    // Add a fallback timeout in case 'canplay' never fires
    setTimeout(() => {
      if (audioPlayer.paused) {
        console.warn('Audio never reached canplay state, play attempt timed out.');
        updatePlayPauseButton(true); // Ensure button is in play state
      }
    }, 7000); // 7 seconds timeout
  }

  showAudioControls();
}


/**
 * Preloads audio for a given global Ayah number.
 * @param {number} ayahNumber Global Ayah number.
 */
export function preloadAudio(ayahNumber) {
  const tempAudio = new Audio();
  const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(ayahNumber);
  const paddedSurah = padNumber(surahNumber, 3);
  const paddedAyah = padNumber(ayahWithinSurah, 3);
  const audioURL = `https://everyayah.com/data/khalefa_al_tunaiji_64kbps/${paddedSurah}${paddedAyah}.mp3`;

  tempAudio.src = audioURL;
  tempAudio.preload = 'auto'; // Hint to the browser to preload
  tempAudio.load();

  // Optional: Log when preloading is complete or handle errors
  tempAudio.oncanplaythrough = () => {
    // console.log(`Audio preloaded for ayah: ${ayahNumber}`);
    tempAudio.oncanplaythrough = null; // Clean up listener
  };
  tempAudio.onerror = () => {
    console.error(`Error preloading audio for ayah: ${ayahNumber}`);
    tempAudio.onerror = null; // Clean up listener
  };
}

/**
 * Shows the audio controls and sets a timeout to hide them.
 * @param {boolean} [resetTimeout=true] Whether to reset the hide timeout.
 */
export function showAudioControls(resetTimeout = true) {
  const audioContainer = document.querySelector('.audio-container');
  if (!audioContainer) return;

  audioContainer.classList.add('visible');

  if (resetTimeout) {
    clearTimeout(audioControlsTimeout);
    const timeout = setTimeout(() => {
      // Check isUserInteractingWithAudio flag from state
      if (!isUserInteractingWithAudio && audioContainer) {
        audioContainer.classList.remove('visible');
      }
    }, 2500);
    setAudioControlsTimeout(timeout); // Store timeout ID in state
  }
}

/**
 * Resets the timeout for hiding the audio controls.
 * @param {number} [delay=2500] The delay before hiding.
 */
export function resetAudioHideTimeout(delay = 2500) {
  clearTimeout(audioControlsTimeout);
  const audioContainer = document.querySelector('.audio-container');
  if (audioContainer) {
    const timeout = setTimeout(function () {
      // Check isUserInteractingWithAudio flag from state
      if (!isUserInteractingWithAudio) {
        audioContainer.classList.remove('visible');
      }
    }, delay);
    setAudioControlsTimeout(timeout); // Store timeout ID in state
  }
}

import { quranData } from './quranData.js';

// CONFIGURATION MODULE
const RECITER = {
  shuraym: {
    id: "ar.ahmedajamy",
    name: "Ahmed ibn Ali al-Ajamy",
    bitrate: 128
  }
};

// GLOBAL STATE VARIABLES
let currentAyahNumber = 1;
let audioControlsTimeout;
let isUserInteractingWithAudio = false;

// Variables for settings bar visibility
let settingsBarTimeout;
let isUserInteractingWithSettings = false;

// Add a state variable to track playback status before navigation
let wasPlayingBeforeNavigation = false;

// Add a cache to store preloaded verses
const verseCache = new Map();
let nextVersePreloader = null;

// Chromecast variables
let castContext = null;
let castSession = null;

/**
 * Initialize the Cast SDK
 */
// eslint-disable-next-line no-undef
window.__onGCastApiAvailable = function (isAvailable) {
  console.log('__onGCastApiAvailable called. isAvailable:', isAvailable);
  console.log('Checking window.cast availability:', typeof window.cast);
  if (isAvailable) {
    // Check if cast object is actually available globally when callback fires
    if (typeof window.cast === 'undefined' || !window.cast.framework) {
      console.error('!!! window.cast or window.cast.framework is not defined *inside* __onGCastApiAvailable');
      // Optionally, try again after a longer delay, or show an error to the user
      return;
    }
    initializeCastApi();
  }
};

/**
 * Initializes the Cast API
 */
function initializeCastApi() {
  // Add check for cast API availability
  if (!cast || !cast.framework) {
    console.error('Cast SDK not available or framework not loaded.');
    return;
  }

  // Define APP_ID here, once the API is available
  // eslint-disable-next-line no-undef
  const APP_ID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;

  // eslint-disable-next-line no-undef
  castContext = cast.framework.CastContext.getInstance();
  castContext.setOptions({
    receiverApplicationId: APP_ID,
    // eslint-disable-next-line no-undef
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    // Add other options if needed
  });

  // Remote Player Controller
  // eslint-disable-next-line no-undef
  const remotePlayer = new cast.framework.RemotePlayer();
  // eslint-disable-next-line no-undef
  const remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);

  // Add event listeners for remote player changes
  remotePlayerController.addEventListener(
    // eslint-disable-next-line no-undef
    cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
    () => {
      updatePlayPauseButton(remotePlayer.isPaused);
    }
  );
  remotePlayerController.addEventListener(
    // eslint-disable-next-line no-undef
    cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,
    () => {
      const mediaInfo = remotePlayer.mediaInfo;
      if (mediaInfo) {
        console.log("Remote media info changed:", mediaInfo);
        // Optionally update local UI based on remote media info
        // e.g., update displayed Surah/Ayah if possible from metadata
        updatePlayPauseButton(remotePlayer.isPaused); // Ensure button state is correct
      } else {
        // No media loaded on receiver
        updatePlayPauseButton(true);
      }
    }
  );
  // Add more listeners as needed (e.g., IS_MUTED_CHANGED, VOLUME_LEVEL_CHANGED)

  // Add event listeners for cast state changes
  castContext.addEventListener(
    // eslint-disable-next-line no-undef
    cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
    handleSessionStateChange
  );
  castContext.addEventListener(
    // eslint-disable-next-line no-undef
    cast.framework.CastContextEventType.CAST_STATE_CHANGED,
    handleCastStateChange
  );

  console.log('Cast SDK initialized.');
}

/**
 * Handles cast session state changes.
 * @param {cast.framework.SessionStateEventData} event
 */
function handleSessionStateChange(event) {
  console.log('Session state changed:', event.sessionState);
  // eslint-disable-next-line no-undef
  castSession = castContext.getCurrentSession();
  const audioContainer = document.querySelector('.audio-container');

  switch (event.sessionState) {
    // eslint-disable-next-line no-undef
    case cast.framework.SessionState.SESSION_STARTED:
    // eslint-disable-next-line no-undef
    case cast.framework.SessionState.SESSION_RESUMED:
      console.log('Cast session active.');
      if (audioContainer) audioContainer.classList.add('casting-active');
      // Pause local player if it was playing
      const localPlayer = document.getElementById('ayah-audio-player');
      if (localPlayer instanceof HTMLAudioElement) {
        localPlayer.pause();
      }
      // If resuming, load current media onto cast device? (Or rely on receiver state)
      // castMedia(currentAyahNumber); // Might cause double load if receiver remembers
      break;
    // eslint-disable-next-line no-undef
    case cast.framework.SessionState.SESSION_ENDED:
      console.log('Cast session ended.');
      if (audioContainer) audioContainer.classList.remove('casting-active');
      castSession = null;
      // Ensure local player button is reset (e.g., to play state)
      updatePlayPauseButton(true);
      break;
    // eslint-disable-next-line no-undef
    case cast.framework.SessionState.SESSION_START_FAILED:
    // eslint-disable-next-line no-undef
    case cast.framework.SessionState.SESSION_ENDING:
    // eslint-disable-next-line no-undef
    // case cast.framework.SessionState.SESSION_ENDED: // Duplicate, handled above
    //   console.log('Cast session ended or failed to start.');
    //   if (audioContainer) audioContainer.classList.remove('casting-active');
    //   castSession = null;
    //   updatePlayPauseButton(true);
    //   break;
  }
}

/**
 * Handles cast state changes (e.g., available devices).
 * @param {cast.framework.CastStateEventData} event
 */
function handleCastStateChange(event) {
  console.log('Cast state changed:', event.castState);
  // You can update the UI based on whether Cast devices are available
  const castButton = document.getElementById('cast-button');
  if (castButton) {
    // Use NO_DEVICES_AVAILABLE check
    castButton.style.display = (event.castState === cast.framework.CastState.NO_DEVICES_AVAILABLE) ? 'none' : 'inline-block';
  }
}

/**
 * Loads and plays the specified Ayah on the cast device.
 * @param {number} globalAyahNumber The global Ayah number.
 */
async function castMedia(globalAyahNumber) {
  if (!castSession) {
    console.error("No active cast session found.");
    return;
  }

  const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(globalAyahNumber);
  const surahData = quranData.find(s => s.number === surahNumber);
  const surahName = surahData ? surahData.name.split(' (')[0] : `Surah ${surahNumber}`; // Get cleaner Surah name

  try {
    // Fetch verse data for metadata (or get from cache if available)
    const cacheKey = `${surahNumber}:${ayahWithinSurah}`;
    let verseData = verseCache.has(cacheKey) ? verseCache.get(cacheKey) : await fetchQuranVerse(surahNumber, ayahWithinSurah);

    if (verseData.error) {
      console.error("Error fetching verse data for casting:", verseData.error);
      // Handle error - maybe display a message
      return;
    }

    // Calculate padded surah and ayah numbers
    const paddedSurah = padNumber(surahNumber, 3);
    const paddedAyah = padNumber(ayahWithinSurah, 3);

    // Construct the new audio URL
    const audioURL = `https://everyayah.com/data/khalefa_al_tunaiji_64kbps/${paddedSurah}${paddedAyah}.mp3`;

    const mediaInfo = new chrome.cast.media.MediaInfo(audioURL, 'audio/mp3');

    // --- Metadata ---
    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
    mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
    mediaInfo.metadata.title = `${surahName}, Ayah ${ayahWithinSurah}`;
    mediaInfo.metadata.subtitle = verseData.english.substring(0, 100) + (verseData.english.length > 100 ? '...' : ''); // Snippet of translation

    // Optional: Add artwork (e.g., app icon or generic Quran image)
    // mediaInfo.metadata.images = [
    //     new chrome.cast.Image('url_to_your_image.png')
    // ];
    // --- End Metadata ---

    const request = new chrome.cast.media.LoadRequest(mediaInfo);

    // Optional: Set autoplay, start time etc.
    request.autoplay = true;
    // request.currentTime = 0; // Start from beginning

    console.log(`Casting Ayah ${globalAyahNumber}: ${surahName} ${ayahWithinSurah}`);

    await castSession.loadMedia(request);
    console.log('Media loaded successfully on cast device.');
    updatePlayPauseButton(false); // Update button to PAUSE after successful load/play

  } catch (error) {
    console.error('Error casting media:', error);
    // Handle casting error (e.g., show message to user)
    updatePlayPauseButton(true); // Set button back to PLAY on error
  }
}

// Function to preload the next verse
async function preloadNextVerse(currentSurah, currentAyah) {
  try {
    // Calculate the next verse number
    let nextSurah = parseInt(currentSurah);
    let nextAyah = parseInt(currentAyah) + 1;

    // If we've reached the end of the surah, move to the next surah
    const currentSurahData = quranData.find(s => s.number == currentSurah);
    if (currentSurahData && nextAyah > currentSurahData.ayahCount) {
      nextSurah++;
      nextAyah = 1;

      // If we've reached the end of the Quran, wrap around to the first surah
      if (nextSurah > 114) {
        nextSurah = 1;
      }
    }

    // Generate a cache key
    const cacheKey = `${nextSurah}:${nextAyah}`;

    // Check if this verse is already in the cache
    if (!verseCache.has(cacheKey)) {
      // Fetch the next verse data
      const verseData = await fetchQuranVerse(nextSurah, nextAyah);

      // Store in cache
      verseCache.set(cacheKey, verseData);

      // Preload the audio as well
      const nextAyahGlobal = calculateGlobalAyahNumber(nextSurah, nextAyah);
      preloadAudio(nextAyahGlobal);
    }
  } catch (error) {
    console.error("Error preloading next verse:", error);
  }
}

// Function to preload audio without playing it
function preloadAudio(ayahNumber) {
  // Create a temporary audio element for preloading
  const tempAudio = new Audio();

  // Calculate surah and ayah numbers from the global ayah number
  const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(ayahNumber);

  // Calculate padded surah and ayah numbers
  const paddedSurah = padNumber(surahNumber, 3);
  const paddedAyah = padNumber(ayahWithinSurah, 3);

  // Construct the new audio URL
  const audioURL = `https://everyayah.com/data/khalefa_al_tunaiji_64kbps/${paddedSurah}${paddedAyah}.mp3`;

  // Just load the audio, don't play it
  tempAudio.src = audioURL;
  tempAudio.preload = 'auto';
  tempAudio.load();

  // We don't need to keep a reference to this element once it loads
  tempAudio.oncanplaythrough = () => {
    tempAudio.oncanplaythrough = null;
  };
}

// API & DATA ACCESS MODULE
async function fetchQuranVerse(surahNumber, ayahNumber) {
  console.log(`Fetching verse data for Surah ${surahNumber}, Ayah ${ayahNumber}`);

  try {
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/editions/quran-simple,en.sahih`);

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();

    // Extract the verse data
    const verseData = {
      arabic: data.data[0]?.text || 'Arabic text not available',
      english: data.data[1]?.text || 'Translation not available',
      meta: {
        juz: data.data[0]?.juz || 0,
        page: data.data[0]?.page || 0,
        hizbQuarter: data.data[0]?.hizbQuarter || 0
      }
    };

    return verseData;
  } catch (error) {
    console.error("Error in fetchQuranVerse:", error);
    return { error: error.message };
  }
}

// UTILITY MODULE

// Helper function to pad numbers with leading zeros
function padNumber(num, length) {
  return String(num).padStart(length, '0');
}

function calculateGlobalAyahNumber(surahNumber, ayahNumber) {
  surahNumber = parseInt(surahNumber);
  ayahNumber = parseInt(ayahNumber);

  // Initialize the counter with the ayah number
  let globalAyahNumber = ayahNumber;

  // Add all ayahs from previous surahs
  for (let i = 1; i < surahNumber; i++) {
    const surah = quranData.find(s => s.number === i);
    if (surah) {
      globalAyahNumber += surah.ayahCount;
    }
  }

  return globalAyahNumber;
}

function calculateSurahAndAyah(globalAyahNumber) {
  let surahNumber = 1;
  let ayahWithinSurah = globalAyahNumber;

  // Find which surah this global ayah belongs to
  for (let i = 0; i < quranData.length; i++) {
    if (ayahWithinSurah <= quranData[i].ayahCount) {
      // Found the surah
      surahNumber = quranData[i].number;
      break;
    }
    // Otherwise subtract this surah's ayahs and continue to next surah
    ayahWithinSurah -= quranData[i].ayahCount;
  }

  return { surahNumber, ayahWithinSurah };
}

function getSurahAyahCount(surahNum) {
  const surah = quranData.find(s => s.number === surahNum);
  return surah ? surah.ayahCount : 0;
}

// AUDIO CONTROL MODULE
function playAyahAudio(ayahNumber) {
  // Calculate surah and ayah numbers from the global ayah number
  const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(ayahNumber);

  // Calculate padded surah and ayah numbers
  const paddedSurah = padNumber(surahNumber, 3);
  const paddedAyah = padNumber(ayahWithinSurah, 3);

  // Construct the new audio URL
  const audioURL = `https://everyayah.com/data/khalefa_al_tunaiji_64kbps/${paddedSurah}${paddedAyah}.mp3`;

  // Set the audio source
  const audioPlayerElement = document.getElementById('ayah-audio-player');
  if (audioPlayerElement instanceof HTMLAudioElement) {
    const audioPlayer = audioPlayerElement; // Type is now known
    audioPlayer.src = audioURL;

    // Reset play button state to PLAY initially
    updatePlayPauseButton(true);

    // Preload the audio
    audioPlayer.load();

    // Return a promise that resolves when the audio is loaded
    return new Promise((resolve) => {
      // Directly set oncanplaythrough if needed, or just resolve
      const timeoutId = setTimeout(() => {
        console.warn(`Audio ${ayahNumber} timed out loading.`);
        resolve(); // Resolve even on timeout
      }, 3000);

      audioPlayer.oncanplaythrough = () => {
        clearTimeout(timeoutId); // Clear timeout if loaded successfully
        audioPlayer.oncanplaythrough = null; // Remove listener
        resolve();
      };
      audioPlayer.onerror = () => { // Also handle potential load errors
        clearTimeout(timeoutId);
        console.error(`Error loading audio ${ayahNumber}`);
        audioPlayer.onerror = null;
        resolve(); // Resolve anyway to not block execution
      };
    });
  }
  return Promise.resolve();
}

// Modified togglePlayPause to handle casting
function togglePlayPause() {
  if (castSession) {
    // Casting session active - control remote player
    const remotePlayer = new cast.framework.RemotePlayer();
    const remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);
    remotePlayerController.playOrPause();
    // The button state will be updated by the IS_PAUSED_CHANGED listener
  } else {
    // No casting session - control local player
    const audioPlayerElement = document.getElementById('ayah-audio-player');
    if (!(audioPlayerElement instanceof HTMLAudioElement)) return;
    const audioPlayer = audioPlayerElement;

    if (audioPlayer.paused) {
      if (!audioPlayer.src || audioPlayer.src === window.location.href) {
        // No valid source - load current ayah
        loadAndDisplayAyah(currentAyahNumber); // Use loadAndDisplayAyah which handles play
      } else {
        playAudio(); // Play existing source
      }
    } else {
      audioPlayer.pause();
      updatePlayPauseButton(true);
      wasPlayingBeforeNavigation = false; // Set state on pause
    }
  }
}

function playAudio() {
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

  console.log('Playing audio:', audioPlayer.src);

  audioPlayer.play()
    .then(() => {
      console.log('Audio playback started successfully');
      updatePlayPauseButton(false);
      wasPlayingBeforeNavigation = true; // Set state on successful play
    })
    .catch(error => {
      console.error('Error playing audio:', error);
      // Attempt to load again if play fails due to needing user interaction
      if (error.name === 'NotAllowedError') {
        console.log('Playback prevented, possibly requires user interaction.');
        // Optionally prompt user or just update button
      }
      updatePlayPauseButton(true);
    });

  showAudioControls();
}

function updatePlayPauseButton(showPlay) {
  const playIcon = document.querySelector('.play-icon');
  const pauseIcon = document.querySelector('.pause-icon');

  if (playIcon && pauseIcon) {
    playIcon.style.display = showPlay ? 'block' : 'none';
    pauseIcon.style.display = showPlay ? 'none' : 'block';
  }
}

function showAudioControls(resetTimeout = true) {
  const audioContainer = document.querySelector('.audio-container');
  if (!audioContainer) return;

  audioContainer.classList.add('visible');

  if (resetTimeout) {
    clearTimeout(audioControlsTimeout);
    audioControlsTimeout = setTimeout(() => {
      if (!isUserInteractingWithAudio) {
        audioContainer.classList.remove('visible');
      }
    }, 2500);
  }
}

// Function to show/hide the top settings bar
function showSettingsBar(resetTimeout = true) {
  const settingsBar = document.getElementById('top-settings-bar');
  if (!settingsBar) return;

  settingsBar.classList.add('visible');

  if (resetTimeout) {
    clearTimeout(settingsBarTimeout);
    settingsBarTimeout = setTimeout(() => {
      if (!isUserInteractingWithSettings) {
        settingsBar.classList.remove('visible');
      }
    }, 3000); // Slightly longer timeout for settings
  }
}

// NAVIGATION MODULE
function navigate(direction) {
  const surahSelectElement = document.getElementById('surah-select');
  const ayahSelectElement = document.getElementById('ayah-select');

  if (!(surahSelectElement instanceof HTMLSelectElement) || !(ayahSelectElement instanceof HTMLSelectElement)) return;
  const surahSelect = surahSelectElement;
  const ayahSelect = ayahSelectElement;

  let currentSurah = parseInt(surahSelect.value);
  let currentAyah = parseInt(ayahSelect.value);

  if (direction === 'next') {
    if (currentAyah >= ayahSelect.options.length - 1) {
      currentSurah = currentSurah >= 114 ? 1 : currentSurah + 1;
      currentAyah = 1;
    } else {
      currentAyah++;
    }
  } else {
    if (currentAyah <= 1) {
      currentSurah = currentSurah <= 1 ? 114 : currentSurah - 1;
      currentAyah = -1; // Flag for last ayah
    } else {
      currentAyah--;
    }
  }

  // Update surah if changed
  if (currentSurah !== parseInt(surahSelect.value)) {
    surahSelect.value = String(currentSurah);
    surahSelect.dispatchEvent(new Event('change'));

    if (currentAyah === -1) {
      setTimeout(() => {
        // Re-check ayahSelect type after potential population
        const updatedAyahSelect = document.getElementById('ayah-select');
        if (updatedAyahSelect instanceof HTMLSelectElement) {
          updatedAyahSelect.selectedIndex = updatedAyahSelect.options.length - 1;
          updatedAyahSelect.dispatchEvent(new Event('change'));
          // setTimeout(() => playAudio(), 500); // REMOVED - handleAyahChange will manage playback
        }
      }, 300);
      return;
    }
  }

  // Update ayah if it wasn't handled by surah change
  if (currentAyah !== -1) {
    ayahSelect.value = String(currentAyah);
    ayahSelect.dispatchEvent(new Event('change'));
    // setTimeout(() => playAudio(), 500); // REMOVED - handleAyahChange will manage playback
  }
}

// LOCAL STORAGE MODULE
function saveSelectionsToLocalStorage(surahNumber, ayahNumber) {
  try {
    localStorage.setItem('quranMeditationSpace_surah', surahNumber);
    localStorage.setItem('quranMeditationSpace_ayah', ayahNumber);
    console.log('Selections saved to local storage:', { surah: surahNumber, ayah: ayahNumber });
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
}

function loadSelectionsFromLocalStorage() {
  try {
    const savedSurah = localStorage.getItem('quranMeditationSpace_surah');
    const savedAyah = localStorage.getItem('quranMeditationSpace_ayah');
    return {
      surah: savedSurah ? savedSurah : "1",
      ayah: savedAyah ? savedAyah : "1"
    };
  } catch (error) {
    console.error('Error loading from local storage:', error);
    return { surah: "1", ayah: "1" }; // Default values
  }
}

// UI UPDATE MODULE
function populateSurahDropdown() {
  const surahSelect = document.getElementById('surah-select');
  if (!surahSelect) return;

  let delay = 0;

  quranData.forEach((surah, index) => {
    setTimeout(() => {
      const option = document.createElement('option');
      option.value = String(surah.number);
      option.textContent = `${surah.number}. ${surah.name}`;
      surahSelect.appendChild(option);

      // When all items are loaded, add a subtle fade-in effect
      if (index === quranData.length - 1) {
        surahSelect.classList.add('loaded');
      }
    }, delay);

    // Add a small delay for each item for a smooth cascading effect
    delay += 5;
  });
}

function populateAyahSelect(surahNumber) {
  const ayahSelect = document.getElementById('ayah-select');
  const selectedSurah = quranData.find(surah => surah.number === parseInt(surahNumber));

  if (ayahSelect && selectedSurah) {
    ayahSelect.innerHTML = '<option value="">--Please select an Ayah--</option>';
    for (let i = 1; i <= selectedSurah.ayahCount; i++) {
      const option = document.createElement('option');
      option.value = String(i);
      option.textContent = `Ayah ${i}`;
      ayahSelect.appendChild(option);
    }
    ayahSelect.disabled = false;
  }
}

function updateAyahMetadata(ayahData) {
  if (!ayahData) return;

  const juzInfo = document.getElementById('juz-info');
  const pageInfo = document.getElementById('page-info');
  const hizbInfo = document.getElementById('hizb-info');

  if (juzInfo) juzInfo.textContent = ayahData.juz || '-';
  if (pageInfo) pageInfo.textContent = ayahData.page || '-';
  if (hizbInfo) hizbInfo.textContent = ayahData.hizbQuarter ?
    `${Math.floor(ayahData.hizbQuarter / 4) + 1}:${ayahData.hizbQuarter % 4 || 4}` : '-';
}

function updateGlowElements() {
  const glowElements = document.querySelectorAll('.ambient-glow');
  glowElements.forEach((el) => {
    if (el instanceof HTMLElement) { // Type check
      const newTop = Math.random() * 100 - 50;
      const newLeft = Math.random() * 100 - 50;
      el.style.top = `${newTop}%`;
      el.style.left = `${newLeft}%`;
    }
  });
}

function loadAndDisplayAyah(globalAyahNumber) {
  // Validate the ayah number
  if (!globalAyahNumber || isNaN(parseInt(globalAyahNumber))) {
    console.error('Invalid ayah number:', globalAyahNumber);
    return false;
  }

  // Convert to integer and store as current ayah
  currentAyahNumber = parseInt(globalAyahNumber);

  console.log(`Loading ayah number ${currentAyahNumber}`);

  // Calculate surah and ayah within surah
  const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(currentAyahNumber);

  // Update dropdowns
  const surahSelect = document.getElementById('surah-select');
  const ayahSelect = document.getElementById('ayah-select');

  if (surahSelect && ayahSelect) {
    // Set the surah selector
    surahSelect.value = surahNumber;

    // Rebuild ayah options for this surah
    populateAyahSelect(surahNumber);

    // Set the ayah selector
    setTimeout(() => {
      ayahSelect.value = ayahWithinSurah;
    }, 100);
  }

  // Show loading state
  const arabicTextElement = document.getElementById('arabic-text');
  const translationElement = document.getElementById('translation-text');

  if (arabicTextElement) arabicTextElement.innerHTML = 'Loading Arabic text...';
  if (translationElement) translationElement.textContent = 'Loading translation...';

  // Make the API call to fetch verse data
  fetchQuranVerse(surahNumber, ayahWithinSurah)
    .then(verseData => {
      if (!verseData.error) {
        // Use our display verse function with transitions instead of direct updates
        displayVerse(surahNumber, ayahWithinSurah, verseData);

        // Update metadata
        updateAyahMetadata(verseData.meta);
      }
    })
    .catch(error => console.error("Error fetching verse:", error));

  // Load the audio, then decide whether to play based on the state
  playAyahAudio(currentAyahNumber).then(() => {
    if (wasPlayingBeforeNavigation) {
      playAudio(); // Play only if it was playing before
    } else {
      updatePlayPauseButton(true); // Ensure button is in play state
    }
  });
}

// Add a function to create the smooth transition effect
function createAyahTransition() {
  // Get the verse elements
  const arabicText = document.getElementById('arabic-text');
  const translationText = document.getElementById('translation-text');

  // Add transition-out class to start the fade-out animation
  // arabicText.classList.add('transition-out');
  // translationText.classList.add('transition-out');

  // Create subtle pulse effect
  const pulseElement = document.querySelector('.verse-transition-pulse');
  // if (pulseElement) {
  //   pulseElement.classList.add('pulse-animation');

  //   // Remove the class after animation completes
  //   setTimeout(() => {
  //     pulseElement.classList.remove('pulse-animation');
  //   }, 1000);
  // }

  // Wait for the fade-out to complete before updating content
  // return new Promise(resolve => {
  //   setTimeout(() => {
  //     // Remove transition classes
  //     // arabicText.classList.remove('transition-out');
  //     // translationText.classList.remove('transition-out');

  //     // Add transition-in class to trigger fade-in animation
  //     // arabicText.classList.add('transition-in');
  //     // translationText.classList.add('transition-in');

  //     // Remove transition-in class after animation completes
  //     // setTimeout(() => {
  //     //   arabicText.classList.remove('transition-in');
  //     //   translationText.classList.remove('transition-in');
  //     // }, 600);

  //     resolve();
  //   }, 300); // Duration of fade-out
  // });
  // Return a promise that resolves immediately
  return Promise.resolve();
}

// Simplified function to create text glow effects for both Arabic and English
function addTextGlowEffects() {
  const elements = [
    { id: 'arabic-text', containerClass: 'ayah-glow-container' },
    { id: 'translation-text', containerClass: 'translation-glow-container' }
  ];

  // Process each text element
  elements.forEach(element => {
    const textElement = document.getElementById(element.id);
    // Ensure textElement exists and is an HTMLElement before accessing parentNode
    if (!(textElement instanceof HTMLElement)) return;

    // Create glow container if it doesn't exist
    const containerSelector = '.' + element.containerClass;
    if (!document.querySelector(containerSelector)) {
      const glowContainer = document.createElement('div');
      glowContainer.className = element.containerClass;
      // Check parentNode before inserting
      if (textElement.parentNode) {
        textElement.parentNode.insertBefore(glowContainer, textElement);
        glowContainer.appendChild(textElement);
      } else {
        console.warn(`Could not add glow container for ${element.id} as parentNode was null.`);
      }
    }
  });
}

// Simplified function to animate all particles
function animateParticles() {
  // Select all particles
  const allParticles = document.querySelectorAll('.light-particle');

  allParticles.forEach(particle => {
    // Check particle type before accessing style or offsetWidth
    if (!(particle instanceof HTMLElement)) return;

    // Reset any existing animations
    particle.style.animation = 'none';

    // Determine if this is a translation particle
    const isTranslation = particle.classList.contains('translation-particle');

    // Calculate particle properties
    const delay = Math.random() * (isTranslation ? 3 : 4);
    const duration = (isTranslation ? 6 : 5) + Math.random() * (isTranslation ? 4 : 5);

    // Force reflow
    void particle.offsetWidth;

    // Apply appropriate animation
    const floatAnimation = isTranslation ? 'float-translation-particle' : 'float-particle';
    const glowAnimation = isTranslation ? 'translation-glow-pulse' : 'glow-pulse';

    particle.style.animation = `${floatAnimation} ${duration}s ease-in-out ${delay}s infinite, 
                              ${glowAnimation} ${duration / 2}s ease-in-out ${delay}s infinite`;

    // Set random positions and properties
    particle.style.top = `${(isTranslation ? 30 : 20) + Math.random() * (isTranslation ? 40 : 60)}%`;
    particle.style.left = `${(isTranslation ? 15 : 10) + Math.random() * (isTranslation ? 70 : 80)}%`;
    particle.style.opacity = (0.2 + Math.random() * (isTranslation ? 0.4 : 0.5)).toString();
    particle.style.width = `${(isTranslation ? 2 : 3) + Math.random() * (isTranslation ? 5 : 8)}px`;
    particle.style.height = particle.style.width;
  });
}

// Modify displayVerse to start preloading the next verse
async function displayVerse(surahNumber, ayahNumber, verseData) {
  // Get the text elements
  const arabicTextElement = document.getElementById('arabic-text');
  const translationTextElement = document.getElementById('translation-text');
  const ayahReferenceElement = document.getElementById('ayah-reference'); // Get reference element

  // Clear previous content immediately
  if (arabicTextElement) arabicTextElement.innerHTML = '';
  if (translationTextElement) translationTextElement.innerHTML = '';
  if (ayahReferenceElement) ayahReferenceElement.textContent = ''; // Clear reference

  // Ensure elements exist and are HTMLElements before proceeding
  if (!(arabicTextElement instanceof HTMLElement) || !(translationTextElement instanceof HTMLElement) || !(ayahReferenceElement instanceof HTMLElement)) return;
  const arabicText = arabicTextElement;
  const translationText = translationTextElement;
  const ayahReference = ayahReferenceElement;

  // Display Ayah Reference
  ayahReference.textContent = `${surahNumber}:${ayahNumber}`; // Set the reference text

  // Animation parameters
  const arabicWordDelay = 0.08; // Delay between each Arabic word
  const englishWordDelay = 0.05; // Delay between each English word
  const animationDuration = '0.5s';

  // Process Arabic text (word by word)
  const arabicWords = verseData.arabic.split(' '); // Split by space
  arabicWords.forEach((word, index) => {
    const span = document.createElement('span');
    span.textContent = word + (index < arabicWords.length - 1 ? ' ' : ''); // Add space back
    span.className = 'reveal-word arabic-word'; // Use reveal-word class
    span.style.animationDelay = `${index * arabicWordDelay}s`;
    span.style.animationDuration = animationDuration;
    arabicText.appendChild(span);
  });

  // Process English text (word by word)
  const englishWords = verseData.english.split(' ');
  englishWords.forEach((word, index) => {
    const span = document.createElement('span');
    span.textContent = word + (index < englishWords.length - 1 ? ' ' : '');
    span.className = 'reveal-word english-word'; // Use reveal-word class
    span.style.animationDelay = `${index * englishWordDelay}s`;
    span.style.animationDuration = animationDuration;
    translationText.appendChild(span);
  });

  // Add the immersive glow effects (might need adjustment if they interfere)
  addTextGlowEffects();

  // Create a pulsating effect on the light particles (might need adjustment)
  animateParticles();

  // Update page title with current surah and ayah
  const surahName = quranData.find(s => s.number == surahNumber)?.name || '';
  document.title = `Quran - ${surahName} (${surahNumber}:${ayahNumber})`;

  // Start preloading the next verse
  if (nextVersePreloader) {
    clearTimeout(nextVersePreloader);
  }

  nextVersePreloader = setTimeout(() => {
    preloadNextVerse(surahNumber, ayahNumber);
  }, 500); // Small delay to ensure current verse is fully processed
}

// EVENT HANDLERS
function handleSurahChange() {
  const surahSelectElement = document.getElementById('surah-select');
  const ayahSelectElement = document.getElementById('ayah-select');
  const referenceText = document.getElementById('selected-reference-text');
  const quranSelector = document.querySelector('.quran-selector');
  const verseContainer = document.getElementById('verse-container');

  if (!(surahSelectElement instanceof HTMLSelectElement)) return;
  const surahSelect = surahSelectElement;
  const ayahSelect = ayahSelectElement; // Initially HTMLElement | null

  const selectedSurahNumber = parseInt(surahSelect.value);

  if (quranSelector instanceof HTMLElement) {
    quranSelector.classList.add('changing');
  }

  updateGlowElements();

  if (!selectedSurahNumber) {
    if (ayahSelect instanceof HTMLSelectElement) { // Check specific type for disabled
      ayahSelect.innerHTML = '<option value="">--Please select a Surah first--</option>';
      ayahSelect.disabled = true;
    }
    if (referenceText instanceof HTMLElement) {
      referenceText.textContent = 'Please select a Surah and Ayah to see the reference.';
    }
    if (quranSelector instanceof HTMLElement) {
      quranSelector.classList.remove('changing');
    }

    if (verseContainer instanceof HTMLElement) {
      verseContainer.classList.remove('visible');
    }
    return;
  }

  saveSelectionsToLocalStorage(selectedSurahNumber, "1");
  const selectedSurah = quranData.find(surah => surah.number === selectedSurahNumber);

  if (referenceText instanceof HTMLElement) {
    referenceText.innerHTML = 'Loading <span class="loading-dots"><span></span><span></span><span></span></span>';
  }

  setTimeout(() => {
    if (ayahSelect instanceof HTMLSelectElement && selectedSurah) {
      populateAyahSelect(selectedSurahNumber);

      const populatedAyahSelect = document.getElementById('ayah-select');
      if (populatedAyahSelect instanceof HTMLSelectElement && populatedAyahSelect.options.length > 1) {
        populatedAyahSelect.selectedIndex = 1;
        populatedAyahSelect.dispatchEvent(new Event('change'));
      } else {
        if (referenceText instanceof HTMLElement) {
          referenceText.textContent = `Selected Surah: ${selectedSurah.name}. Please select an Ayah.`;
        }
      }
    } else if (ayahSelect && selectedSurah) { // Handle case if it exists but isn't a select (though unlikely)
      if (referenceText instanceof HTMLElement) {
        referenceText.textContent = `Selected Surah: ${selectedSurah.name}. (Ayah selector not found/invalid)`;
      }
    }

    if (quranSelector instanceof HTMLElement) {
      quranSelector.classList.remove('changing');
    }
  }, 600);
}

function handleAyahChange() {
  const surahSelectElement = document.getElementById('surah-select');
  const ayahSelectElement = document.getElementById('ayah-select');

  if (!(surahSelectElement instanceof HTMLSelectElement) || !(ayahSelectElement instanceof HTMLSelectElement)) return;
  const surahSelect = surahSelectElement;
  const ayahSelect = ayahSelectElement;

  const selectedSurahNumber = surahSelect.value;
  const selectedAyahNumber = ayahSelect.value;

  if (!selectedSurahNumber || !selectedAyahNumber) return;

  saveSelectionsToLocalStorage(selectedSurahNumber, selectedAyahNumber);
  const globalAyahNumber = calculateGlobalAyahNumber(selectedSurahNumber, selectedAyahNumber);
  currentAyahNumber = globalAyahNumber;
  fetchQuranVerse(selectedSurahNumber, selectedAyahNumber)
    .then(verseData => {
      if (!verseData.error) {
        displayVerse(selectedSurahNumber, selectedAyahNumber, verseData);
      }
    })
    .catch(error => console.error("Error fetching verse:", error));

  // Load the audio, then decide whether to play based on the state
  playAyahAudio(globalAyahNumber).then(() => {
    if (wasPlayingBeforeNavigation) {
      playAudio(); // Play only if it was playing before
    } else {
      updatePlayPauseButton(true); // Ensure button is in play state
    }
  });
}

function handleMouseMove(e) {
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;

  const glowElements = document.querySelectorAll('.ambient-glow');
  glowElements.forEach((el) => { // Removed unused index
    if (el instanceof HTMLElement) { // Check type for style access
      const depth = parseFloat(el.dataset.depth || '1'); // Example: Use data-depth if available
      const moveX = (mouseX - 0.5) * depth * 30;
      const moveY = (mouseY - 0.5) * depth * 30;
      el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  });
}

// AUDIO PLAYER INITIALIZATION
function initCustomAudioPlayer() {
  const audioElement = document.getElementById('ayah-audio-player');
  const customPlayer = document.getElementById('custom-audio-player');
  const audioContainer = document.querySelector('.audio-container');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const prevAyahBtn = document.getElementById('prev-ayah-btn');
  const nextAyahBtn = document.getElementById('next-ayah-btn');

  let hideControlsTimeout;
  let isUserInteracting = false;

  // Apply initial visibility state
  if (audioContainer) {
    // Start visible, then fade out
    audioContainer.classList.add('visible');
    setTimeout(() => audioContainer.classList.remove('visible'), 3000);
  }

  // Add event listeners
  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
  if (prevAyahBtn) prevAyahBtn.addEventListener('click', () => navigate('prev'));
  if (nextAyahBtn) nextAyahBtn.addEventListener('click', () => navigate('next'));

  // Handle audio end
  if (audioElement instanceof HTMLAudioElement) { // Check type here
    audioElement.addEventListener('ended', () => {
      console.log('Audio ended, navigating to next ayah');
      updatePlayPauseButton(true);
      // Since it ended, it *was* playing.
      wasPlayingBeforeNavigation = true; // Ensure state is true before navigating
      navigate('next');
    });
  } else {
    console.warn("Audio element not found for 'ended' listener attachment.");
  }

  // Show controls on interaction
  let mouseMoveTimer;
  document.addEventListener('mousemove', function () {
    clearTimeout(mouseMoveTimer);
    mouseMoveTimer = setTimeout(showAllControls, 50); // Renamed function
  });
  document.addEventListener('click', () => showAllControls()); // Use renamed function
  document.addEventListener('touchstart', () => showAllControls()); // Use renamed function

  // Handle audio controls visibility when hovering
  if (audioContainer) {
    audioContainer.addEventListener('mouseenter', function () {
      isUserInteractingWithAudio = true;
      showAudioControls(false); // Don't reset timeout
    });

    audioContainer.addEventListener('mouseleave', function () {
      isUserInteractingWithAudio = false;
      resetAudioHideTimeout(); // Renamed function
    });
  }

  // Combined function to show all controls
  function showAllControls(resetTimeout = true) {
    showAudioControls(resetTimeout);
    showSettingsBar(resetTimeout);
  }

  // Renamed function for clarity
  function resetAudioHideTimeout(delay = 2500) {
    clearTimeout(audioControlsTimeout);
    if (audioContainer) {
      audioControlsTimeout = setTimeout(function () {
        if (!isUserInteractingWithAudio) {
          audioContainer.classList.remove('visible');
        }
      }, delay);
    }
  }

  // Initial hide for audio controls
  resetAudioHideTimeout(3000);
}

// SETUP EVENT LISTENERS
function setupEventListeners() {
  // Surah selection change
  const surahSelect = document.getElementById('surah-select');
  if (surahSelect) {
    surahSelect.addEventListener('change', handleSurahChange);
  }

  // Ayah selection change
  const ayahSelect = document.getElementById('ayah-select');
  if (ayahSelect) {
    ayahSelect.addEventListener('change', handleAyahChange);
  }

  // Mouse movement effects
  document.addEventListener('mousemove', handleMouseMove);

  // Handle settings bar visibility when hovering
  const settingsBar = document.getElementById('top-settings-bar');
  if (settingsBar) {
    settingsBar.addEventListener('mouseenter', function () {
      isUserInteractingWithSettings = true;
      showSettingsBar(false); // Don't reset timeout
    });

    settingsBar.addEventListener('mouseleave', function () {
      isUserInteractingWithSettings = false;
      resetSettingsBarHideTimeout(); // Call the new reset function
    });
  }
}

// INITIALIZATION 
function setDefaultSelections() {
  const surahSelectElement = document.getElementById('surah-select');

  if (!(surahSelectElement instanceof HTMLSelectElement)) {
    console.error("Surah select element not found or not a select element");
    return;
  }
  const surahSelect = surahSelectElement;

  const savedSelections = loadSelectionsFromLocalStorage();

  if (surahSelect.options.length > 1) {
    surahSelect.value = savedSelections.surah;
    surahSelect.dispatchEvent(new Event('change'));
  }
}

// MAIN INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  // Initialize particles.js if available
  if (typeof window.particlesJS !== 'undefined') {
    window.particlesJS.load('particles-js', 'particles.json', function () {
      console.log('Particles.js loaded successfully');
    });
  }

  // Set up core functionality
  setupEventListeners();
  initCustomAudioPlayer();
  setupFullscreenToggle(); // Call the new setup function
  resetSettingsBarHideTimeout(3500); // Initial hide for settings bar

  // Populate dropdowns with data
  setTimeout(() => {
    populateSurahDropdown();
    // Wait until all options are loaded before setting defaults
    setTimeout(setDefaultSelections, quranData.length * 5 + 100);
  }, 500);

  if ('fonts' in document) {
    // Preload the primary Arabic font
    Promise.all([
      /** @type {Promise<void>} */(new Promise(resolve => document.fonts.load('1em "Scheherazade New"').then(() => resolve(undefined)))),
      /** @type {Promise<void>} */(new Promise(resolve => document.fonts.load('1em "Amiri"').then(() => resolve(undefined)))),
      /** @type {Promise<void>} */(new Promise(resolve => document.fonts.load('1em "Noto Sans Arabic"').then(() => resolve(undefined))))
    ]).then(() => {
      // Add a class when fonts are loaded
      document.documentElement.classList.add('fonts-loaded');
    });
  }
});

// Modified loadVerse function to use cache when available and handle casting
async function loadVerse(surahNumber, ayahNumber) {
  const globalAyahNumber = calculateGlobalAyahNumber(surahNumber, ayahNumber);
  currentAyahNumber = globalAyahNumber; // Update global state

  // Update URL without triggering a page reload
  const newUrl = `?surah=${surahNumber}&ayah=${ayahNumber}`;
  history.pushState({ surah: surahNumber, ayah: ayahNumber }, '', newUrl);

  // Set the surah selector
  const surahSelect = document.getElementById('surah-select');
  if (surahSelect instanceof HTMLSelectElement) { // Type guard
    surahSelect.value = String(surahNumber); // Ensure value is string
  }

  // Generate a cache key
  const cacheKey = `${surahNumber}:${ayahNumber}`;
  let verseData;

  // Check for active Cast session *before* fetching/displaying locally
  if (castSession && castSession.getSessionState() === cast.framework.SessionState.SESSION_STARTED) {
    console.log("Cast session active. Loading media via castMedia.");
    // Fetch data needed for display (even if casting, we show text locally)
    if (verseCache.has(cacheKey)) {
      verseData = verseCache.get(cacheKey);
    } else {
      verseData = await fetchQuranVerse(surahNumber, ayahNumber);
      if (!verseData.error) {
        verseCache.set(cacheKey, verseData); // Add to cache
      }
    }
    if (!verseData.error) {
      await displayVerse(surahNumber, ayahNumber, verseData); // Display text locally
      await castMedia(globalAyahNumber); // Load and play on Cast device
    } else {
      console.error("Error fetching verse data before casting:", verseData.error);
      // Handle error (e.g., display error message locally)
    }
    return; // Exit function after initiating cast
  }

  // --- If not casting, proceed with local playback logic ---
  console.log("No active cast session. Loading media locally.");
  // Try to get the verse from cache
  if (verseCache.has(cacheKey)) {
    verseData = verseCache.get(cacheKey);
    await displayVerse(surahNumber, ayahNumber, verseData);
  } else {
    // If not in cache, fetch it normally
    try {
      verseData = await fetchQuranVerse(surahNumber, ayahNumber);
      if (!verseData.error) {
        verseCache.set(cacheKey, verseData); // Add to cache
        await displayVerse(surahNumber, ayahNumber, verseData);
      } else {
        console.error("Error fetching verse data for local display:", verseData.error);
        // Handle error - maybe display error message locally
        // Display *something* even on error?
        const arabicTextElement = document.getElementById('arabic-text');
        const translationTextElement = document.getElementById('translation-text');
        if (arabicTextElement) arabicTextElement.textContent = 'Error loading verse.';
        if (translationTextElement) translationTextElement.textContent = verseData.error;
      }
    } catch (error) {
      console.error("Error loading verse:", error);
      // Display error message locally
      const arabicTextElement = document.getElementById('arabic-text');
      const translationTextElement = document.getElementById('translation-text');
      if (arabicTextElement) arabicTextElement.textContent = 'Error loading verse.';
      if (translationTextElement) translationTextElement.textContent = 'Failed to fetch verse data.';
    }
  }

  // If verse data was loaded successfully (either from cache or fetch), prepare local audio
  if (verseData && !verseData.error) {
    // Preload and prepare local audio player
    await playAyahAudio(globalAyahNumber);
    // Attempt to autoplay locally only if it was playing before
    if (wasPlayingBeforeNavigation) {
      playAudio();
    } else {
      updatePlayPauseButton(true); // Ensure button shows play
    }
  }
  // Preload the *next* verse regardless of play success
  preloadNextVerse(surahNumber, ayahNumber);
  limitCacheSize(); // Check cache size
}

// Handle navigation buttons to use the cache
function navigateToNextAyah() {
  let nextSurah = currentSurahNumber;
  let nextAyah = parseInt(currentAyahWithinSurah) + 1;

  // If we're at the end of the surah, go to the next one
  const currentSurahData = quranData.find(s => s.number == currentSurahNumber);
  if (currentSurahData && nextAyah > currentSurahData.ayahCount) {
    nextSurah++;
    nextAyah = 1;

    // If we're at the end of the Quran, loop back to the beginning
    if (nextSurah > 114) {
      nextSurah = 1;
      nextAyah = 1;
    }
  }

  loadVerse(nextSurah, nextAyah);
}

function navigateToPreviousAyah() {
  let prevSurah = currentSurahNumber;
  let prevAyah = parseInt(currentAyahWithinSurah) - 1;

  // If we're at the beginning of the surah, go to the previous one
  if (prevAyah < 1) {
    prevSurah--;

    // If we're at the beginning of the Quran, loop back to the end
    if (prevSurah < 1) {
      prevSurah = 114;
    }

    // Get the number of ayahs in the previous surah
    const prevSurahData = quranData.find(s => s.number == prevSurah);
    if (prevSurahData) {
      prevAyah = prevSurahData.ayahCount;
    } else {
      prevAyah = 1; // Fallback
    }
  }

  loadVerse(prevSurah, prevAyah);
}

// Limit cache size to prevent memory issues
function limitCacheSize() {
  const MAX_CACHE_SIZE = 50; // Adjust based on your needs

  if (verseCache.size > MAX_CACHE_SIZE) {
    // Remove the oldest entries
    const keysToDelete = Array.from(verseCache.keys()).slice(0, verseCache.size - MAX_CACHE_SIZE);
    keysToDelete.forEach(key => verseCache.delete(key));
  }
}

// Add cache management to the app initialization
function initializeApp() {
  // ... existing initialization code ...

  // Set up a periodic cache cleanup
  setInterval(limitCacheSize, 60000); // Check every minute
}

// Function to reset settings bar hide timeout (similar to audio)
function resetSettingsBarHideTimeout(delay = 3000) {
  clearTimeout(settingsBarTimeout);
  const settingsBar = document.getElementById('top-settings-bar');
  if (settingsBar) {
    settingsBarTimeout = setTimeout(function () {
      if (!isUserInteractingWithSettings) {
        settingsBar.classList.remove('visible');
      }
    }, delay);
  }
}

// Fullscreen Toggle Logic
function setupFullscreenToggle() {
  const fullscreenButton = document.getElementById('fullscreen-toggle');
  const fullscreenIcon = fullscreenButton?.querySelector('.fullscreen-icon');
  const exitFullscreenIcon = fullscreenButton?.querySelector('.exit-fullscreen-icon');

  if (!fullscreenButton || !fullscreenIcon || !exitFullscreenIcon) {
    console.warn("Fullscreen button or icons not found.");
    return;
  }

  // Check if fullscreen is supported
  if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled && !document.mozFullScreenEnabled && !document.msFullscreenEnabled) {
    fullscreenButton.style.display = 'none'; // Hide button if not supported
    console.warn("Fullscreen API is not supported by this browser.");
    return;
  }

  function updateFullscreenIcon() {
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    if (isFullscreen) {
      fullscreenIcon.style.display = 'none';
      exitFullscreenIcon.style.display = 'block';
      fullscreenButton.title = "Exit Fullscreen";
    } else {
      fullscreenIcon.style.display = 'block';
      exitFullscreenIcon.style.display = 'none';
      fullscreenButton.title = "Enter Fullscreen";
    }
  }

  fullscreenButton.addEventListener('click', () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
      // Enter fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
      } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
        document.documentElement.webkitRequestFullscreen().catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
      } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
        document.documentElement.mozRequestFullScreen().catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
      } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
        document.documentElement.msRequestFullscreen().catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.error(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`));
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen().catch(err => console.error(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`));
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen().catch(err => console.error(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`));
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen().catch(err => console.error(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`));
      }
    }
  });

  // Update icon when fullscreen state changes (e.g., user presses ESC)
  document.addEventListener('fullscreenchange', updateFullscreenIcon);
  document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
  document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
  document.addEventListener('MSFullscreenChange', updateFullscreenIcon);

  // Initial icon state
  updateFullscreenIcon();
}

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered: ', registration);
      })
      .catch(registrationError => {
        console.log('Service Worker registration failed: ', registrationError);
      });
  });
} 
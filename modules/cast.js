import { fetchQuranVerse } from './api.js';
import { updatePlayPauseButton } from './audio.js'; // Assume this will be in audio.js
import { quranData } from './quranData.js';
import { castContext, castSession, setCastContext, setCastSession, verseCache } from './state.js';
import { calculateSurahAndAyah, padNumber } from './utils.js';

// Note: 'cast' and 'chrome.cast' types are not defined locally.
// These depend on the Google Cast SDK being loaded in the browser.
// Use type assertions or // @ts-ignore if using TypeScript/JSDoc heavily.

/**
 * Initializes the Cast API
 */
export function initializeCastApi() {
  // Add check for cast API availability
  // @ts-ignore
  if (typeof cast === 'undefined' || !cast.framework) {
    console.error('Cast SDK not available or framework not loaded.');
    return;
  }

  // Define APP_ID here, once the API is available
  // eslint-disable-next-line no-undef
  // @ts-ignore
  const APP_ID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;

  // eslint-disable-next-line no-undef
  // @ts-ignore
  const context = cast.framework.CastContext.getInstance();
  setCastContext(context); // Use setter

  if (!castContext) return; // Guard against null context

  castContext.setOptions({
    receiverApplicationId: APP_ID,
    // eslint-disable-next-line no-undef
    // @ts-ignore
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    // Add other options if needed
  });

  // Remote Player Controller
  // eslint-disable-next-line no-undef
  // @ts-ignore
  const remotePlayer = new cast.framework.RemotePlayer();
  // eslint-disable-next-line no-undef
  // @ts-ignore
  const remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);

  // Add event listeners for remote player changes
  remotePlayerController.addEventListener(
    // eslint-disable-next-line no-undef
    // @ts-ignore
    cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
    () => {
      updatePlayPauseButton(remotePlayer.isPaused);
    }
  );
  remotePlayerController.addEventListener(
    // eslint-disable-next-line no-undef
    // @ts-ignore
    cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,
    () => {
      const mediaInfo = remotePlayer.mediaInfo;
      if (mediaInfo) {
        console.log("Remote media info changed:", mediaInfo);
        // Optionally update local UI based on remote media info
        updatePlayPauseButton(remotePlayer.isPaused); // Ensure button state is correct
      } else {
        updatePlayPauseButton(true);
      }
    }
  );

  // Add event listeners for cast state changes
  castContext.addEventListener(
    // eslint-disable-next-line no-undef
    // @ts-ignore
    cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
    handleSessionStateChange
  );
  castContext.addEventListener(
    // eslint-disable-next-line no-undef
    // @ts-ignore
    cast.framework.CastContextEventType.CAST_STATE_CHANGED,
    handleCastStateChange
  );

  console.log('Cast SDK initialized.');
}

/**
 * Handles cast session state changes.
 * @param {any} event // Use 'any' as cast types are external
 */
function handleSessionStateChange(event) {
  console.log('Session state changed:', event.sessionState);
  // eslint-disable-next-line no-undef
  if (castContext) {
    // @ts-ignore
    setCastSession(castContext.getCurrentSession()); // Use setter
  }
  const audioContainer = document.querySelector('.audio-container');

  // @ts-ignore
  const SessionState = cast.framework.SessionState;

  switch (event.sessionState) {
    case SessionState.SESSION_STARTED:
    case SessionState.SESSION_RESUMED:
      console.log('Cast session active.');
      if (audioContainer) audioContainer.classList.add('casting-active');
      const localPlayer = document.getElementById('ayah-audio-player');
      if (localPlayer instanceof HTMLAudioElement) {
        localPlayer.pause();
      }
      // castMedia(currentAyahNumber); // Consider if this auto-cast is desired on resume
      break;
    case SessionState.SESSION_ENDED:
      console.log('Cast session ended.');
      if (audioContainer) audioContainer.classList.remove('casting-active');
      setCastSession(null); // Use setter
      updatePlayPauseButton(true);
      break;
    case SessionState.SESSION_START_FAILED:
    case SessionState.SESSION_ENDING:
      console.log('Cast session ended or failed to start.');
      if (audioContainer) audioContainer.classList.remove('casting-active');
      setCastSession(null); // Use setter
      updatePlayPauseButton(true);
      break;
  }
}

/**
 * Handles cast state changes (e.g., available devices).
 * @param {any} event // Use 'any' as cast types are external
 */
function handleCastStateChange(event) {
  console.log('Cast state changed:', event.castState);
  const castButton = document.getElementById('cast-button');
  // @ts-ignore
  const CastState = cast.framework.CastState;
  if (castButton instanceof HTMLElement) { // Check if it's an HTMLElement
    castButton.style.display = (event.castState === CastState.NO_DEVICES_AVAILABLE) ? 'none' : 'inline-block';
  }
}

/**
 * Loads and plays the specified Ayah on the cast device.
 * @param {number} globalAyahNumber The global Ayah number.
 */
export async function castMedia(globalAyahNumber) {
  if (!castSession) {
    console.error("No active cast session found.");
    return;
  }

  const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(globalAyahNumber);
  const surahData = quranData.find(s => s.number === surahNumber);
  const surahName = surahData ? surahData.name.split(' (')[0] : `Surah ${surahNumber}`;

  try {
    const cacheKey = `${surahNumber}:${ayahWithinSurah}`;
    let verseData = verseCache.has(cacheKey) ? verseCache.get(cacheKey) : await fetchQuranVerse(surahNumber, ayahWithinSurah);

    if (verseData.error) {
      console.error("Error fetching verse data for casting:", verseData.error);
      return;
    }

    const paddedSurah = padNumber(surahNumber, 3);
    const paddedAyah = padNumber(ayahWithinSurah, 3);
    const audioURL = `https://everyayah.com/data/khalefa_al_tunaiji_64kbps/${paddedSurah}${paddedAyah}.mp3`;

    // @ts-ignore
    const mediaInfo = new chrome.cast.media.MediaInfo(audioURL, 'audio/mp3');
    // @ts-ignore
    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
    // @ts-ignore
    mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
    mediaInfo.metadata.title = `${surahName}, Ayah ${ayahWithinSurah}`;
    mediaInfo.metadata.subtitle = verseData.english.substring(0, 100) + (verseData.english.length > 100 ? '...' : '');

    // @ts-ignore
    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.autoplay = true;

    console.log(`Casting Ayah ${globalAyahNumber}: ${surahName} ${ayahWithinSurah}`);

    await castSession.loadMedia(request);
    console.log('Media loaded successfully on cast device.');
    updatePlayPauseButton(false);

  } catch (error) {
    console.error('Error casting media:', error);
    updatePlayPauseButton(true);
  }
}

/**
 * Initialize the Cast SDK callback. Must be globally accessible.
 */
export function initializeGlobalCastApiCallback() {
  // @ts-ignore - Attaching to window is necessary for the SDK callback
  window.__onGCastApiAvailable = function (isAvailable) {
    console.log('__onGCastApiAvailable called. isAvailable:', isAvailable);
    // @ts-ignore
    console.log('Checking window.cast availability:', typeof window.cast);
    if (isAvailable) {
      // @ts-ignore
      if (typeof window.cast === 'undefined' || !window.cast.framework) {
        console.error('!!! window.cast or window.cast.framework is not defined *inside* __onGCastApiAvailable');
        return;
      }
      initializeCastApi(); // Call the internal initializer
    }
  };
}

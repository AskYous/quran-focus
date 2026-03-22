// GLOBAL STATE VARIABLES
export let currentAyahNumber = 1;
export let audioControlsTimeout;
export let isUserInteractingWithAudio = false;
export let settingsBarTimeout = null;
export let isUserInteractingWithSettings = false;
export let wasPlayingBeforeNavigation = false;
// export let castSession = null; // Removing castSession as casting is disabled
// export let isCasting = false; // Track casting state

// @ts-ignore
export const verseCache = new Map();
export let castContext = null;

// Functions to update state (optional, but good practice)
export function setCurrentAyahNumber(number) {
  const num = parseInt(String(number));
  if (!isNaN(num) && num >= 1 && num <= 6236) {
    currentAyahNumber = num;
  } else {
    console.warn(`Attempted to set invalid currentAyahNumber: ${number}`);
  }
}
export function setAudioControlsTimeout(timeout) { audioControlsTimeout = timeout; }
export function setIsUserInteractingWithAudio(flag) { isUserInteractingWithAudio = flag; }
export function setSettingsBarTimeout(timeout) { settingsBarTimeout = timeout; }
export function setIsUserInteractingWithSettings(value) { isUserInteractingWithSettings = value; }
export function setWasPlayingBeforeNavigation(value) { wasPlayingBeforeNavigation = value; }
export function setCastContext(context) { castContext = context; }
// export function setCastSession(session) { castSession = session; }
// export function setIsCasting(casting) { isCasting = casting; }

// Settings state
export let currentReciterId = 'khalefa_al_tunaiji_64kbps';
export let currentTranslationId = 'en.hilali';
export let playbackMode = 'ayah'; // 'ayah' or 'flowing'
export let isDrawerOpen = false;
export let isSearchOverlayOpen = false;

export function setCurrentReciterId(id) { currentReciterId = id; }
export function setCurrentTranslationId(id) { currentTranslationId = id; }
export function setPlaybackMode(mode) {
  if (mode === 'ayah' || mode === 'flowing') {
    playbackMode = mode;
  }
}
export function setIsDrawerOpen(open) { isDrawerOpen = open; }
export function setIsSearchOverlayOpen(open) { isSearchOverlayOpen = open; }

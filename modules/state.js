// GLOBAL STATE VARIABLES
export let currentAyahNumber = 1;
export let audioControlsTimeout;
export let isUserInteractingWithAudio = false;
export let settingsBarTimeout;
export let isUserInteractingWithSettings = false;
export let wasPlayingBeforeNavigation = false;
export const verseCache = new Map();
export let nextVersePreloader = null;
export let castContext = null;
export let castSession = null;

// Functions to update state (optional, but good practice)
export function setCurrentAyahNumber(num) { currentAyahNumber = num; }
export function setAudioControlsTimeout(timeout) { audioControlsTimeout = timeout; }
export function setIsUserInteractingWithAudio(flag) { isUserInteractingWithAudio = flag; }
export function setSettingsBarTimeout(timeout) { settingsBarTimeout = timeout; }
export function setIsUserInteractingWithSettings(flag) { isUserInteractingWithSettings = flag; }
export function setWasPlayingBeforeNavigation(flag) { wasPlayingBeforeNavigation = flag; }
export function setNextVersePreloader(preloader) { nextVersePreloader = preloader; }
export function setCastContext(context) { castContext = context; }
export function setCastSession(session) { castSession = session; }

// Core Imports from Modules
import { fetchQuranVerse } from './modules/api.js';
import { playAudio, playAyahAudio, updatePlayPauseButton } from './modules/audio.js';
import { castMedia, initializeGlobalCastApiCallback } from './modules/cast.js';
import { initializeApp } from './modules/init.js';
import { limitCacheSize, preloadNextVerse } from './modules/navigation.js';
import {
  castSession,
  nextVersePreloader,
  setCurrentAyahNumber,
  setNextVersePreloader,
  verseCache,
  wasPlayingBeforeNavigation
} from './modules/state.js';
import { displayVerse } from './modules/ui.js';
import { calculateGlobalAyahNumber, calculateSurahAndAyah } from './modules/utils.js';

// Initialize the global callback for the Cast SDK
// @ts-ignore - This function is globally defined by the Cast SDK loader script
initializeGlobalCastApiCallback();

/**
 * Core function to load and display a specific verse.
 * Handles fetching data (or using cache), casting, updating UI, and audio playback.
 * @param {string | number} surahNumber The surah number.
 * @param {string | number} ayahNumber The ayah number within the surah.
 * @returns {Promise<void>}
 */
export async function loadVerse(surahNumber, ayahNumber) {
  const sNum = parseInt(String(surahNumber));
  const aNum = parseInt(String(ayahNumber));

  // Basic validation
  if (isNaN(sNum) || isNaN(aNum) || sNum < 1 || sNum > 114 || aNum < 1) {
    console.error(`Invalid surah/ayah provided to loadVerse: ${surahNumber}, ${ayahNumber}`);
    return;
  }
  // Further validation against actual ayah count could be added here if needed, using utils.getSurahAyahCount

  const globalAyahNumber = calculateGlobalAyahNumber(sNum, aNum);
  setCurrentAyahNumber(globalAyahNumber); // Update global state

  // Update URL without triggering a page reload (optional, but good practice)
  try {
    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.get('surah') !== String(sNum) || currentParams.get('ayah') !== String(aNum)) {
      const newUrl = `?surah=${sNum}&ayah=${aNum}`;
      history.pushState({ surah: sNum, ayah: aNum }, '', newUrl);
    }
  } catch (e) {
    console.warn("Could not update URL state:", e);
  }

  // Set the dropdown values (ensure elements exist)
  const surahSelect = document.getElementById('surah-select');
  const ayahSelect = document.getElementById('ayah-select');
  if (surahSelect instanceof HTMLSelectElement && surahSelect.value !== String(sNum)) {
    surahSelect.value = String(sNum);
    // Note: If surah changed programmatically, ayah dropdown needs repopulation.
    // This is handled by `handleSurahChange`, but direct calls to `loadVerse` might bypass it.
    // Consider adding `populateAyahSelect(sNum)` here if needed for robustness.
  }
  if (ayahSelect instanceof HTMLSelectElement) {
    const optionExists = Array.from(ayahSelect.options).some(opt => opt.value === String(aNum));
    if (optionExists && ayahSelect.value !== String(aNum)) {
      ayahSelect.value = String(aNum);
    } else if (!optionExists) {
      console.warn(`Ayah option ${aNum} not found for Surah ${sNum} when loading verse.`);
      // Ayah dropdown might not be populated yet if called directly.
      // Default or error handling might be needed.
    }
  }

  // Generate cache key
  const cacheKey = `${sNum}:${aNum}`;
  let verseData;

  // Check for active Cast session
  // @ts-ignore - Cast types are external
  if (castSession && castSession.getSessionState() === cast.framework.SessionState.SESSION_STARTED) {
    console.log("[Cast] Session active. Loading media via castMedia.");
    if (verseCache.has(cacheKey)) {
      verseData = verseCache.get(cacheKey);
    } else {
      try {
        verseData = await fetchQuranVerse(sNum, aNum);
        if (!verseData.error) {
          verseCache.set(cacheKey, verseData);
          limitCacheSize();
        } else {
          console.error("[Cast] Error fetching verse data before casting:", verseData.error);
        }
      } catch (fetchError) {
        console.error("[Cast] Network error fetching verse data before casting:", fetchError);
        verseData = { error: "Network error fetching data" };
      }
    }

    if (verseData && !verseData.error) {
      await displayVerse(sNum, aNum, verseData);
      await castMedia(globalAyahNumber);
    } else {
      // Display error locally
      const arabicTextElement = document.getElementById('arabic-text');
      const translationTextElement = document.getElementById('translation-text');
      if (arabicTextElement instanceof HTMLElement) arabicTextElement.textContent = 'Error loading verse.';
      if (translationTextElement instanceof HTMLElement) translationTextElement.textContent = verseData?.error || 'Unknown error';
    }
    return;
  }

  // --- Local Playback Logic ---
  console.log("[Local] No active cast session. Loading media locally.");

  // Try cache
  if (verseCache.has(cacheKey)) {
    console.log(`[Local] Using cached verse: ${cacheKey}`);
    verseData = verseCache.get(cacheKey);
    await displayVerse(sNum, aNum, verseData);
  } else {
    // Fetch if not cached
    try {
      console.log(`[Local] Fetching verse: ${cacheKey}`);
      verseData = await fetchQuranVerse(sNum, aNum);
      if (!verseData.error) {
        verseCache.set(cacheKey, verseData);
        limitCacheSize();
        await displayVerse(sNum, aNum, verseData);
      } else {
        console.error("[Local] Error fetching verse data:", verseData.error);
        // Display error
        const arabicTextElement = document.getElementById('arabic-text');
        const translationTextElement = document.getElementById('translation-text');
        if (arabicTextElement instanceof HTMLElement) arabicTextElement.textContent = 'Error loading verse.';
        if (translationTextElement instanceof HTMLElement) translationTextElement.textContent = verseData.error;
      }
    } catch (error) {
      console.error("[Local] Network error or failure loading verse:", error);
      verseData = { error: "Network error fetching data" };
      // Display error
      const arabicTextElement = document.getElementById('arabic-text');
      const translationTextElement = document.getElementById('translation-text');
      if (arabicTextElement instanceof HTMLElement) arabicTextElement.textContent = 'Error loading verse.';
      if (translationTextElement instanceof HTMLElement) translationTextElement.textContent = verseData.error;
    }
  }

  // Handle audio based on fetched data success
  if (verseData && !verseData.error) {
    await playAyahAudio(globalAyahNumber);
    if (wasPlayingBeforeNavigation) {
      console.log("[Local] Attempting to autoplay.");
      playAudio();
    } else {
      updatePlayPauseButton(true);
    }
  } else {
    updatePlayPauseButton(true); // Ensure play button shown on error
  }

  // Preload next verse
  if (nextVersePreloader) clearTimeout(nextVersePreloader);
  const timeoutId = setTimeout(() => {
    preloadNextVerse(sNum, aNum);
  }, 750);
  setNextVersePreloader(timeoutId);
}

/**
 * Legacy function wrapper around loadVerse.
 * Kept for compatibility.
 * @param {number} globalAyahNumber
 * @returns {Promise<void>}
 */
export async function loadAndDisplayAyah(globalAyahNumber) {
  console.warn("loadAndDisplayAyah called, prefer using loadVerse directly.");
  if (!globalAyahNumber || isNaN(parseInt(String(globalAyahNumber)))) {
    console.error('Invalid ayah number provided to loadAndDisplayAyah:', globalAyahNumber);
    return;
  }
  const safeGlobalAyah = Math.max(1, Math.min(globalAyahNumber, 6236));
  const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(safeGlobalAyah);
  return loadVerse(surahNumber, ayahWithinSurah);
}

// MAIN INITIALIZATION LISTENER
document.addEventListener('DOMContentLoaded', () => {
  initializeApp(); // Call the main initialization function from the module
});

// SERVICE WORKER REGISTRATION
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js') // Path relative to HTML
      .then(registration => {
        console.log('Service Worker registered: ', registration);
      })
      .catch(registrationError => {
        console.log('Service Worker registration failed: ', registrationError);
      });
  });
}
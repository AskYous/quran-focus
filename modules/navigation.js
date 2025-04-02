import { loadVerse } from '../script.js'; // Assumes loadVerse is exported from main script
import { fetchQuranVerse } from './api.js';
import { preloadAudio } from './audio.js';
import { quranData } from './quranData.js';
import { setCurrentAyahNumber, verseCache } from './state.js';
import { calculateGlobalAyahNumber } from './utils.js';

const MAX_CACHE_SIZE = 50; // Max verses to keep in text/metadata cache

/**
 * Navigates to the next or previous ayah based on dropdown selections.
 * @param {'next' | 'prev'} direction
 */
export function navigate(direction) {
  const surahSelectElement = document.getElementById('surah-select');
  const ayahSelectElement = document.getElementById('ayah-select');

  if (!(surahSelectElement instanceof HTMLSelectElement) || !(ayahSelectElement instanceof HTMLSelectElement)) return;

  let currentSurah = parseInt(surahSelectElement.value);
  let currentAyah = parseInt(ayahSelectElement.value);
  let targetSurah = currentSurah;
  let targetAyah = currentAyah;

  const currentSurahData = quranData.find(s => s.number === currentSurah);
  if (!currentSurahData) return; // Should not happen if dropdowns are populated

  if (direction === 'next') {
    if (currentAyah >= currentSurahData.ayahCount) {
      targetSurah = currentSurah >= 114 ? 1 : currentSurah + 1;
      targetAyah = 1;
    } else {
      targetAyah++;
    }
  } else { // direction === 'prev'
    if (currentAyah <= 1) {
      targetSurah = currentSurah <= 1 ? 114 : currentSurah - 1;
      const targetSurahData = quranData.find(s => s.number === targetSurah);
      targetAyah = targetSurahData ? targetSurahData.ayahCount : 1; // Go to last ayah of prev surah
    } else {
      targetAyah--;
    }
  }

  // Calculate global number and load the verse
  const globalAyahNumber = calculateGlobalAyahNumber(targetSurah, targetAyah);
  setCurrentAyahNumber(globalAyahNumber); // Update state

  // Call loadVerse (which should handle UI updates and audio)
  loadVerse(targetSurah, targetAyah).catch(error => {
    console.error(`Error navigating to ${direction} ayah:`, error);
  });
}

// The navigateToNextAyah and navigateToPreviousAyah functions using currentAyahNumber
// might be redundant if the primary navigation is through the `navigate` function above.
// Keeping them for now but consider if they are still needed.

/**
 * Preloads the verse data and audio for the next Ayah.
 * @param {string | number} currentSurah
 * @param {string | number} currentAyah
 */
export async function preloadNextVerse(currentSurah, currentAyah) {
  try {
    let nextSurah = parseInt(String(currentSurah));
    let nextAyah = parseInt(String(currentAyah)) + 1;

    const currentSurahData = quranData.find(s => s.number == nextSurah);
    if (currentSurahData && nextAyah > currentSurahData.ayahCount) {
      nextSurah++;
      nextAyah = 1;
      if (nextSurah > 114) {
        nextSurah = 1;
      }
    }

    const cacheKey = `${nextSurah}:${nextAyah}`;
    if (!verseCache.has(cacheKey)) {
      // console.log(`Preloading verse: ${cacheKey}`);
      const verseData = await fetchQuranVerse(nextSurah, nextAyah);
      if (!verseData.error) {
        verseCache.set(cacheKey, verseData);
        limitCacheSize(); // Check cache size after adding
        // Also preload audio associated with this verse
        const nextGlobalAyah = calculateGlobalAyahNumber(nextSurah, nextAyah);
        preloadAudio(nextGlobalAyah);
      } else {
        console.warn(`Failed to preload verse ${cacheKey}: ${verseData.error}`);
      }
    }
  } catch (error) {
    console.error("Error preloading next verse:", error);
  }
}

/**
 * Limits the size of the verse cache by removing the oldest entries.
 */
export function limitCacheSize() {
  if (verseCache.size > MAX_CACHE_SIZE) {
    const keysToDelete = Array.from(verseCache.keys()).slice(0, verseCache.size - MAX_CACHE_SIZE);
    // console.log(`Cache limit exceeded (${verseCache.size}/${MAX_CACHE_SIZE}). Removing ${keysToDelete.length} oldest entries.`);
    keysToDelete.forEach(key => verseCache.delete(key));
  }
}

/**
 * Initializes periodic cache cleanup.
 */
export function initializeCacheCleanup() {
  // Set up a periodic cache cleanup
  setInterval(limitCacheSize, 60000); // Check every minute
  console.log("Periodic cache cleanup initialized.");
}

import { loadVerse } from '../script.js'; // Assumes loadVerse is exported from main script
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
 * Limits the size of the verse cache.
 */
export function limitCacheSize() {
  while (verseCache.size > MAX_CACHE_SIZE) {
    // Delete the oldest entry (first key in iteration order)
    const oldestKey = verseCache.keys().next().value;
    verseCache.delete(oldestKey);
    // console.log(`Cache limit reached. Removed oldest entry: ${oldestKey}`);
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

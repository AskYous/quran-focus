import { quranData } from './quranData.js';

/**
 * Calculates the global ayah number (1-6236) from surah and ayah number.
 * @param {string | number} surahNumber Surah number (1-114).
 * @param {string | number} ayahNumber Ayah number within the surah.
 * @returns {number} The global ayah number.
 */
export function calculateGlobalAyahNumber(surahNumber, ayahNumber) {
  const sn = parseInt(String(surahNumber));
  const an = parseInt(String(ayahNumber));

  if (isNaN(sn) || isNaN(an) || sn < 1 || sn > 114 || an < 1) {
    console.error('Invalid input for calculateGlobalAyahNumber', { surahNumber, ayahNumber });
    return 1; // Default to first ayah
  }

  let globalNumber = 0;
  for (let i = 0; i < sn - 1; i++) {
    globalNumber += quranData[i].ayahCount;
  }
  globalNumber += an;

  // Ensure the ayah number is within the bounds of the calculated surah
  const targetSurahData = quranData.find(s => s.number === sn);
  if (!targetSurahData || an > targetSurahData.ayahCount) {
    console.error(`Ayah number ${an} is out of bounds for Surah ${sn}`);
    // Optional: return the last valid ayah of the surah? Or just default to 1?
    return 1;
  }

  // Clamp to total ayahs (6236)
  return Math.max(1, Math.min(globalNumber, 6236));
}

/**
 * Calculates the surah and ayah number from the global ayah number.
 * @param {number} globalAyahNumber The global ayah number (1-6236).
 * @returns {{surahNumber: number, ayahWithinSurah: number}}
 */
export function calculateSurahAndAyah(globalAyahNumber) {
  let remainingAyahs = Math.max(1, Math.min(globalAyahNumber, 6236));
  let surahNumber = 1;

  for (let i = 0; i < quranData.length; i++) {
    if (remainingAyahs <= quranData[i].ayahCount) {
      return {
        surahNumber: quranData[i].number,
        ayahWithinSurah: remainingAyahs
      };
    }
    remainingAyahs -= quranData[i].ayahCount;
    surahNumber++;
  }

  // Fallback (shouldn't be reached if globalAyahNumber is within 1-6236)
  console.warn('Could not determine Surah/Ayah for global number:', globalAyahNumber);
  return { surahNumber: 114, ayahWithinSurah: 6 };
}

/**
 * Pads a number with leading zeros to a specified length.
 * @param {number} num The number to pad.
 * @param {number} length The desired total length.
 * @returns {string} The padded number as a string.
 */
export function padNumber(num, length) {
  return String(num).padStart(length, '0');
}

// --- Local Storage --- 

/**
 * Saves the selected Surah and Ayah numbers to local storage.
 * @param {string | number} surahNumber
 * @param {string | number} ayahNumber
 */
export function saveSelectionsToLocalStorage(surahNumber, ayahNumber) {
  try {
    localStorage.setItem('quranFocusSpace_surah', String(surahNumber));
    localStorage.setItem('quranFocusSpace_ayah', String(ayahNumber));
    // console.log('Selections saved to local storage:', { surah: surahNumber, ayah: ayahNumber });
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
}

/**
 * Loads the saved Surah and Ayah numbers from local storage.
 * @returns {{surah: string, ayah: string}}
 */
export function loadSelectionsFromLocalStorage() {
  try {
    const savedSurah = localStorage.getItem('quranFocusSpace_surah');
    const savedAyah = localStorage.getItem('quranFocusSpace_ayah');
    return {
      surah: savedSurah ? savedSurah : "1",
      ayah: savedAyah ? savedAyah : "1"
    };
  } catch (error) {
    console.error('Error loading from local storage:', error);
    return { surah: "1", ayah: "1" }; // Default values on error
  }
}

export function getSurahAyahCount(surahNum) {
  const surah = quranData.find(s => s.number === surahNum);
  return surah ? surah.ayahCount : 0;
} 
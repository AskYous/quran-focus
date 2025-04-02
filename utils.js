import { quranData } from './quranData.js';

// Helper function to pad numbers with leading zeros
export function padNumber(num, length) {
  return String(num).padStart(length, '0');
}

export function calculateGlobalAyahNumber(surahNumber, ayahNumber) {
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

export function calculateSurahAndAyah(globalAyahNumber) {
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

export function getSurahAyahCount(surahNum) {
  const surah = quranData.find(s => s.number === surahNum);
  return surah ? surah.ayahCount : 0;
} 
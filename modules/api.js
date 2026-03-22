import { currentTranslationId } from './state.js';

export async function fetchQuranVerse(surahNumber, ayahNumber, translationId = null) {
  const edition = translationId || currentTranslationId;
  console.log(`Fetching verse data for Surah ${surahNumber}, Ayah ${ayahNumber}, Translation: ${edition}`);

  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/editions/quran-simple,${edition}`
    );

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();

    const verseData = {
      arabic: data.data[0]?.text || 'Arabic text not available',
      translation: data.data[1]?.text || 'Translation not available',
      translationDirection: data.data[1]?.direction || 'ltr',
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

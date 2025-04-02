export async function fetchQuranVerse(surahNumber, ayahNumber) {
  console.log(`Fetching verse data for Surah ${surahNumber}, Ayah ${ayahNumber}`);

  try {
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/editions/quran-simple,en.hilali`);

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
import axios from 'axios';
import { Ayah, Surah } from '../types';

const API_URL = 'https://api.alquran.cloud/v1';

// Multiple audio sources to try in case one fails
const AUDIO_SOURCES = [
  // Primary source - everyayah.com with correct path format
  {
    name: 'everyayah.com',
    url: 'https://everyayah.com/data/Saood_ash-Shuraym_128kbps',
    getUrl: (surahNumber: number, ayahNumber: number) => {
      const formattedSurahNumber = surahNumber.toString().padStart(3, '0');
      const formattedAyahNumber = ayahNumber.toString().padStart(3, '0');
      return `https://everyayah.com/data/Saood_ash-Shuraym_128kbps/${formattedSurahNumber}${formattedAyahNumber}.mp3`;
    }
  },
  // Alternative source - alquran.cloud
  {
    name: 'alquran.cloud',
    url: 'https://cdn.islamic.network/quran/audio/128/ar.shalshuraym',
    getUrl: (surahNumber: number, ayahNumber: number) => {
      return `https://cdn.islamic.network/quran/audio/128/ar.shalshuraym/${surahNumber}/${ayahNumber}.mp3`;
    }
  },
  // Another alternative - mp3quran.net
  {
    name: 'mp3quran.net',
    url: 'https://server8.mp3quran.net/shr',
    getUrl: (surahNumber: number, ayahNumber: number) => {
      const formattedSurahNumber = surahNumber.toString().padStart(3, '0');
      const formattedAyahNumber = ayahNumber.toString().padStart(3, '0');
      return `https://server8.mp3quran.net/shr/${formattedSurahNumber}${formattedAyahNumber}.mp3`;
    }
  }
];

export const fetchSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await axios.get(`${API_URL}/surah`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return [];
  }
};

export const fetchAyahs = async (surahNumber: number): Promise<Ayah[]> => {
  try {
    // Use the original Arabic text for proper display
    const response = await axios.get(`${API_URL}/surah/${surahNumber}`);
    return response.data.data.ayahs;
  } catch (error) {
    console.error('Error fetching ayahs:', error);
    return [];
  }
};

export const getAudioUrl = (surahNumber: number, ayahNumber: number, sourceIndex = 0): string => {
  // Get the source to use based on the sourceIndex (cycling through available sources)
  const source = AUDIO_SOURCES[sourceIndex % AUDIO_SOURCES.length];
  console.log(`Using audio source: ${source.name} (index ${sourceIndex % AUDIO_SOURCES.length})`);
  
  // Get URL from the selected source
  return source.getUrl(surahNumber, ayahNumber);
}; 
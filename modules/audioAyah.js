import { currentReciterId } from './state.js';
import { calculateSurahAndAyah, padNumber } from './utils.js';

let recitersData = null;

export function setRecitersData(data) {
  recitersData = data;
}

/**
 * Builds the audio URL for a specific ayah using the current reciter's ayah-by-ayah source.
 */
export function getAyahAudioUrl(globalAyahNumber) {
  const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(globalAyahNumber);
  const paddedSurah = padNumber(surahNumber, 3);
  const paddedAyah = padNumber(ayahWithinSurah, 3);

  if (recitersData) {
    const reciter = recitersData.find(r => r.id === currentReciterId);
    if (reciter?.sources?.ayahByAyah) {
      const source = reciter.sources.ayahByAyah;
      return source.baseUrl + source.format
        .replace('{surah3}', paddedSurah)
        .replace('{ayah3}', paddedAyah);
    }
  }

  // Fallback to default
  return `https://everyayah.com/data/khalefa_al_tunaiji_64kbps/${paddedSurah}${paddedAyah}.mp3`;
}

/**
 * Loads audio for a specific ayah. Does not auto-play.
 */
export function loadAyahAudio(globalAyahNumber, audioPlayer) {
  const audioURL = getAyahAudioUrl(globalAyahNumber);
  audioPlayer.src = audioURL;
  audioPlayer.load();

  return new Promise((resolve) => {
    let resolved = false;
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        console.warn(`Audio ${globalAyahNumber} timed out loading.`);
        resolved = true;
        resolve();
      }
    }, 5000);

    audioPlayer.oncanplaythrough = () => {
      if (!resolved) {
        clearTimeout(timeoutId);
        audioPlayer.oncanplaythrough = null;
        resolved = true;
        resolve();
      }
    };
    audioPlayer.onerror = () => {
      if (!resolved) {
        clearTimeout(timeoutId);
        console.error(`Error loading audio ${globalAyahNumber}`);
        audioPlayer.onerror = null;
        resolved = true;
        resolve();
      }
    };
  });
}

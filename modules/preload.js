import { playAyahAudio } from './audio.js';
import { calculateSurahAndAyah } from './utils.js';

/**
 * Audio objects to hold preloaded audio
 * @type {Object<number, HTMLAudioElement>}
 */
export const preloadedAudio = {};

/**
 * Preloads the audio for a specified Ayah without playing it
 * @param {number} ayahNumber Global Ayah number to preload
 * @returns {Promise<void>}
 */
export async function preloadAyahAudio(ayahNumber) {
  if (ayahNumber < 1 || ayahNumber > 6236) {
    console.warn(`Invalid ayah number for preloading: ${ayahNumber}`);
    return;
  }

  const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(ayahNumber);
  console.log(`Preloading audio for Surah ${surahNumber}, Ayah ${ayahWithinSurah} (Global #${ayahNumber})`);

  try {
    // Create a temporary audio element for preloading
    const tempAudio = new Audio();
    tempAudio.preload = 'auto';
    
    // Use the same URL format as playAyahAudio
    const paddedSurah = surahNumber.toString().padStart(3, '0');
    const paddedAyah = ayahWithinSurah.toString().padStart(3, '0');
    const audioURL = `https://everyayah.com/data/khalefa_al_tunaiji_64kbps/${paddedSurah}${paddedAyah}.mp3`;
    
    tempAudio.src = audioURL;
    
    // Store the preloaded audio in our cache
    preloadedAudio[ayahNumber] = tempAudio;
    
    // Start loading the audio file
    tempAudio.load();
    
    // Return a promise that resolves when the audio is loadable
    return new Promise((resolve) => {
      tempAudio.oncanplaythrough = () => {
        resolve();
      };
      
      // Also resolve on error so we don't hang
      tempAudio.onerror = () => {
        console.warn(`Error preloading audio for ayah ${ayahNumber}`);
        delete preloadedAudio[ayahNumber]; // Remove from cache on error
        resolve();
      };
      
      // Also set a timeout to prevent hanging indefinitely
      setTimeout(() => {
        if (!tempAudio.readyState >= 3) {
          console.warn(`Timeout preloading audio for ayah ${ayahNumber}`);
          resolve();
        }
      }, 5000);
    });
  } catch (error) {
    console.error(`Error preloading ayah ${ayahNumber}:`, error);
  }
}

/**
 * Checks if an Ayah's audio is already preloaded
 * @param {number} ayahNumber The global Ayah number
 * @returns {boolean} True if the audio is preloaded
 */
export function isAyahAudioPreloaded(ayahNumber) {
  return !!preloadedAudio[ayahNumber];
}

/**
 * Gets a preloaded audio element if available
 * @param {number} ayahNumber The global Ayah number
 * @returns {HTMLAudioElement|null} The preloaded audio or null
 */
export function getPreloadedAudio(ayahNumber) {
  return preloadedAudio[ayahNumber] || null;
}

/**
 * Cleans up preloaded audio to manage memory usage
 * Keeps only the most recent preloaded items
 * @param {number} maxItems Maximum number of preloaded items to keep
 */
export function cleanupPreloadedAudio(maxItems = 3) {
  const keys = Object.keys(preloadedAudio).map(Number);
  if (keys.length <= maxItems) return;
  
  // Sort ascending (lowest/oldest first)
  keys.sort((a, b) => a - b);
  
  // Remove oldest items until we're at max
  const itemsToRemove = keys.length - maxItems;
  for (let i = 0; i < itemsToRemove; i++) {
    const key = keys[i];
    const audio = preloadedAudio[key];
    if (audio) {
      audio.src = ''; // Clear source
      delete preloadedAudio[key];
    }
  }
}
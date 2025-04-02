import { loadVerse } from '../script.js'; // Needed for setDefaultSelections
import { handleSurahChange, setupEventListeners } from './events.js';
import { setupFullscreenToggle } from './fullscreen.js';
import { initializeCacheCleanup } from './navigation.js';
import { quranData } from './quranData.js';
import { populateAyahSelect, populateSurahDropdown, resetSettingsBarHideTimeout } from './ui.js';
import { loadSelectionsFromLocalStorage } from './utils.js';

/**
 * Sets the default Surah and Ayah selections based on local storage or defaults.
 */
function setDefaultSelections() {
  const surahSelectElement = document.getElementById('surah-select');

  if (!(surahSelectElement instanceof HTMLSelectElement)) {
    console.error("Surah select element not found or not a select element");
    return;
  }

  const savedSelections = loadSelectionsFromLocalStorage();

  // Ensure dropdown has options before setting value
  // The check `options.length > 1` assumes the placeholder is the first option.
  if (surahSelectElement.options.length > 1) {
    const surahExists = Array.from(surahSelectElement.options).some(opt => opt.value === savedSelections.surah);
    if (surahExists) {
      surahSelectElement.value = savedSelections.surah;
      console.log(`Default surah set to: ${savedSelections.surah}`);

      // After setting the surah, populate the ayahs and set the saved ayah
      // We need populateAyahSelect to finish before setting the ayah value.
      populateAyahSelect(savedSelections.surah);

      // Use setTimeout to allow the DOM to update with new ayah options
      setTimeout(() => {
        const ayahSelectElement = document.getElementById('ayah-select');
        if (ayahSelectElement instanceof HTMLSelectElement) {
          const ayahExists = Array.from(ayahSelectElement.options).some(opt => opt.value === savedSelections.ayah);
          if (ayahExists) {
            ayahSelectElement.value = savedSelections.ayah;
            console.log(`Default ayah set to: ${savedSelections.ayah}`);
            // Now load the verse *after* both dropdowns are set
            loadVerse(savedSelections.surah, savedSelections.ayah)
              .catch(e => console.error("Error loading initial verse:", e));
          } else {
            console.warn(`Saved ayah ${savedSelections.ayah} not found in dropdown, defaulting to 1.`);
            ayahSelectElement.value = "1";
            loadVerse(savedSelections.surah, "1")
              .catch(e => console.error("Error loading initial verse (default ayah):", e));
          }
        } else {
          console.error("Ayah select element not found after populating.");
        }
      }, 50); // Small delay might be needed

    } else {
      console.warn(`Saved surah ${savedSelections.surah} not found in dropdown, defaulting to 1.`);
      surahSelectElement.value = "1";
      // Trigger the change handler for Surah 1 to load its ayahs and the first verse
      handleSurahChange();
    }

  } else {
    console.warn("Surah dropdown not populated yet, cannot set default selection.");
    // Optionally, retry after a delay
    // setTimeout(setDefaultSelections, 200);
  }
}

/**
 * Preloads essential fonts.
 */
function preloadFonts() {
  const docElement = document.documentElement;
  if (!docElement) return; // Guard against documentElement being null

  if ('fonts' in document) {
    Promise.all([
            /** @type {Promise<void>} */(new Promise(resolve => document.fonts.load('1em "Scheherazade New"').then(() => resolve(undefined), () => resolve(undefined)))),
            /** @type {Promise<void>} */(new Promise(resolve => document.fonts.load('1em "Amiri"').then(() => resolve(undefined), () => resolve(undefined)))),
            /** @type {Promise<void>} */(new Promise(resolve => document.fonts.load('1em "Noto Sans Arabic"').then(() => resolve(undefined), () => resolve(undefined))))
    ]).then(() => {
      docElement.classList.add('fonts-loaded');
      console.log("Essential fonts preloaded.");
    }).catch(error => {
      console.warn("Font preloading failed:", error);
      // Add class anyway to prevent potential style issues if fonts load later
      docElement.classList.add('fonts-loaded');
    });
  } else {
    console.log("Font Loading API not supported, skipping font preload.");
    // Add class immediately if API is not supported
    docElement.classList.add('fonts-loaded');
  }
}

/**
 * Main application initialization function.
 */
export function initializeApp() {
  console.log("Initializing Quran Focus App...");

  // Initialize particles background (if library is loaded)
  // @ts-ignore - particlesJS is loaded globally via script tag
  if (typeof window.particlesJS !== 'undefined') {
    // @ts-ignore
    window.particlesJS.load('particles-js', 'particles.json', function () {
      console.log('Particles.js background initialized');
    });
  } else {
    console.warn('particlesJS library not found.');
  }

  // Set up core UI and event handling
  setupEventListeners();
  setupFullscreenToggle();
  initializeCacheCleanup(); // Start cache cleanup interval
  resetSettingsBarHideTimeout(3500); // Initial hide for settings bar
  preloadFonts(); // Start preloading fonts

  // Populate Surah dropdown, then set defaults once populated
  populateSurahDropdown();
  // Wait slightly longer than the dropdown population animation before setting defaults
  setTimeout(setDefaultSelections, quranData.length * 5 + 200);

  console.log("App initialization sequence complete.");
}

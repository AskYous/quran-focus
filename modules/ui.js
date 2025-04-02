import { preloadNextVerse } from './navigation.js'; // Assume preloadNextVerse moves to navigation
import { quranData } from './quranData.js';
import { isUserInteractingWithSettings, nextVersePreloader, setNextVersePreloader, setSettingsBarTimeout, settingsBarTimeout } from './state.js';

/**
 * Populates the Surah selection dropdown with animation.
 */
export function populateSurahDropdown() {
  const surahSelect = document.getElementById('surah-select');
  if (!(surahSelect instanceof HTMLSelectElement)) return;

  let delay = 0;
  surahSelect.innerHTML = '<option value="">-- Please select a Surah --</option>'; // Start with default

  quranData.forEach((surah, index) => {
    setTimeout(() => {
      const option = document.createElement('option');
      option.value = String(surah.number);
      option.textContent = `${surah.number}. ${surah.name}`;
      surahSelect.appendChild(option);

      if (index === quranData.length - 1) {
        surahSelect.classList.add('loaded');
      }
    }, delay);
    delay += 5;
  });
}

/**
 * Populates the Ayah selection dropdown for a given Surah number.
 * @param {string | number} surahNumber The Surah number.
 */
export function populateAyahSelect(surahNumber) {
  const ayahSelect = document.getElementById('ayah-select');
  const selectedSurah = quranData.find(surah => surah.number === parseInt(String(surahNumber)));

  if (ayahSelect instanceof HTMLSelectElement && selectedSurah) {
    ayahSelect.innerHTML = '<option value="">-- Please select an Ayah --</option>';
    for (let i = 1; i <= selectedSurah.ayahCount; i++) {
      const option = document.createElement('option');
      option.value = String(i);
      option.textContent = `Ayah ${i}`;
      ayahSelect.appendChild(option);
    }
    ayahSelect.disabled = false;
  } else if (ayahSelect) {
    // Handle case where ayahSelect exists but is not a SELECT element or surah not found
    ayahSelect.innerHTML = '<option value="">-- Error Loading Ayahs --</option>';
    if (ayahSelect instanceof HTMLSelectElement) ayahSelect.disabled = true;
  }
}

/**
 * Updates the metadata display (Juz, Page, Hizb).
 * @param {object | undefined} ayahData Metadata object from API response.
 */
export function updateAyahMetadata(ayahData) {
  if (!ayahData) return;

  const juzInfo = document.getElementById('juz-info');
  const pageInfo = document.getElementById('page-info');
  const hizbInfo = document.getElementById('hizb-info');

  if (juzInfo) juzInfo.textContent = String(ayahData.juz) || '-';
  if (pageInfo) pageInfo.textContent = String(ayahData.page) || '-';
  // Assuming hizbQuarter is a number like 1, 2, 3... 240
  if (hizbInfo) {
    if (typeof ayahData.hizbQuarter === 'number' && ayahData.hizbQuarter > 0) {
      const hizbNumber = Math.ceil(ayahData.hizbQuarter / 4);
      const quarterInHizb = ayahData.hizbQuarter % 4 === 0 ? 4 : ayahData.hizbQuarter % 4;
      hizbInfo.textContent = `${hizbNumber}:${quarterInHizb}`;
    } else {
      hizbInfo.textContent = '-';
    }
  }
}

/**
 * Randomly repositions ambient glow elements.
 */
export function updateGlowElements() {
  const glowElements = document.querySelectorAll('.ambient-glow');
  glowElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      const newTop = Math.random() * 100 - 50;
      const newLeft = Math.random() * 100 - 50;
      el.style.top = `${newTop}%`;
      el.style.left = `${newLeft}%`;
    }
  });
}

/**
 * Placeholder for potential future transition animations between verses.
 * Currently resolves immediately.
 * @returns {Promise<void>}
 */
export function createAyahTransition() {
  // Original transition code commented out, can be re-implemented here if desired.
  // const arabicText = document.getElementById('arabic-text');
  // const translationText = document.getElementById('translation-text');
  // arabicText?.classList.add('transition-out');
  // translationText?.classList.add('transition-out');
  // return new Promise(resolve => setTimeout(resolve, 300));
  return Promise.resolve();
}

/**
 * Ensures text elements are wrapped in glow containers.
 */
function addTextGlowEffects() {
  const elements = [
    { id: 'arabic-text', containerClass: 'ayah-glow-container' },
    { id: 'translation-text', containerClass: 'translation-glow-container' }
  ];

  elements.forEach(element => {
    const textElement = document.getElementById(element.id);
    if (!(textElement instanceof HTMLElement)) return;

    // Check if already wrapped
    if (textElement.parentElement?.classList.contains(element.containerClass)) {
      return;
    }

    // Create glow container if it doesn't exist or isn't the parent
    const glowContainer = document.createElement('div');
    glowContainer.className = element.containerClass;

    if (textElement.parentNode) {
      textElement.parentNode.insertBefore(glowContainer, textElement);
      glowContainer.appendChild(textElement);
    } else {
      console.warn(`Could not add glow container for ${element.id} as parentNode was null.`);
    }
  });
}

/**
 * Applies floating and glowing animations to particle elements.
 */
function animateParticles() {
  const allParticles = document.querySelectorAll('.light-particle');

  allParticles.forEach(particle => {
    if (!(particle instanceof HTMLElement)) return;

    particle.style.animation = 'none'; // Reset
    const isTranslation = particle.classList.contains('translation-particle');
    const delay = Math.random() * (isTranslation ? 3 : 4);
    const duration = (isTranslation ? 6 : 5) + Math.random() * (isTranslation ? 4 : 5);
    void particle.offsetWidth; // Force reflow

    const floatAnimation = isTranslation ? 'float-translation-particle' : 'float-particle';
    const glowAnimation = isTranslation ? 'translation-glow-pulse' : 'glow-pulse';

    particle.style.animation = `${floatAnimation} ${duration}s ease-in-out ${delay}s infinite,
                              ${glowAnimation} ${duration / 2}s ease-in-out ${delay}s infinite`;

    // Set random initial positions and properties
    particle.style.top = `${(isTranslation ? 30 : 20) + Math.random() * (isTranslation ? 40 : 60)}%`;
    particle.style.left = `${(isTranslation ? 15 : 10) + Math.random() * (isTranslation ? 70 : 80)}%`;
    particle.style.opacity = String(0.2 + Math.random() * (isTranslation ? 0.4 : 0.5));
    const size = `${(isTranslation ? 2 : 3) + Math.random() * (isTranslation ? 5 : 8)}px`;
    particle.style.width = size;
    particle.style.height = size;
  });
}

/**
 * Displays the verse text (Arabic and English) with word-by-word animation.
 * Updates metadata and triggers preloading of the next verse.
 * @param {string | number} surahNumber
 * @param {string | number} ayahNumber
 * @param {any} verseData The fetched verse data object.
 */
export async function displayVerse(surahNumber, ayahNumber, verseData) {
  const arabicTextElement = document.getElementById('arabic-text');
  const translationTextElement = document.getElementById('translation-text');
  const ayahReferenceElement = document.getElementById('ayah-reference');

  // Clear previous content immediately and ensure elements are valid
  if (arabicTextElement) arabicTextElement.innerHTML = ''; else return;
  if (translationTextElement) translationTextElement.innerHTML = ''; else return;
  if (ayahReferenceElement) ayahReferenceElement.textContent = ''; else return;

  // Ensure elements are HTMLElements before proceeding
  if (!(arabicTextElement instanceof HTMLElement) || !(translationTextElement instanceof HTMLElement) || !(ayahReferenceElement instanceof HTMLElement)) return;

  // Update Ayah Reference
  const surahData = quranData.find(s => s.number == surahNumber);
  const surahName = surahData ? surahData.name.split(' (')[0] : `Surah ${surahNumber}`;
  ayahReferenceElement.textContent = `${surahName} (${surahNumber}:${ayahNumber})`;
  document.title = `Quran Focus - ${surahName} (${surahNumber}:${ayahNumber})`;

  // Wait for potential transition animation
  await createAyahTransition();

  // Animation parameters
  const arabicWordDelay = 0.08;
  const englishWordDelay = 0.05;
  const animationDuration = '0.5s';

  // Process Arabic text
  const arabicWords = verseData.arabic.split(' ');
  arabicWords.forEach((word, index) => {
    const span = document.createElement('span');
    span.textContent = word + (index < arabicWords.length - 1 ? ' ' : '');
    span.className = 'reveal-word arabic-word';
    span.style.animationDelay = `${index * arabicWordDelay}s`;
    span.style.animationDuration = animationDuration;
    arabicTextElement.appendChild(span);
  });

  // Process English text
  const englishWords = verseData.english.split(' ');
  englishWords.forEach((word, index) => {
    const span = document.createElement('span');
    span.textContent = word + (index < englishWords.length - 1 ? ' ' : '');
    span.className = 'reveal-word english-word';
    span.style.animationDelay = `${index * englishWordDelay}s`;
    span.style.animationDuration = animationDuration;
    translationTextElement.appendChild(span);
  });

  // Apply visual effects
  addTextGlowEffects();
  animateParticles();

  // Update metadata display
  updateAyahMetadata(verseData.meta);

  // Start preloading the next verse (uses state for timeout handle)
  if (nextVersePreloader) {
    clearTimeout(nextVersePreloader);
  }
  const preloaderTimeout = setTimeout(() => {
    preloadNextVerse(surahNumber, ayahNumber);
  }, 500);
  setNextVersePreloader(preloaderTimeout); // Store timeout ID
}

/**
 * Shows the settings bar and sets a timeout to hide it.
 * @param {boolean} [resetTimeout=true] Whether to reset the hide timeout.
 */
export function showSettingsBar(resetTimeout = true) {
  const settingsBar = document.getElementById('top-settings-bar');
  if (!settingsBar) return;

  settingsBar.classList.add('visible');

  if (resetTimeout) {
    clearTimeout(settingsBarTimeout);
    const timeout = setTimeout(() => {
      // Use isUserInteractingWithSettings flag from state
      if (!isUserInteractingWithSettings && settingsBar) {
        settingsBar.classList.remove('visible');
      }
    }, 3000);
    setSettingsBarTimeout(timeout); // Store timeout ID in state
  }
}

/**
 * Resets the timeout for hiding the settings bar.
 * @param {number} [delay=3000] The delay before hiding.
 */
export function resetSettingsBarHideTimeout(delay = 3000) {
  clearTimeout(settingsBarTimeout);
  const settingsBar = document.getElementById('top-settings-bar');
  if (settingsBar) {
    const timeout = setTimeout(function () {
      // Use isUserInteractingWithSettings flag from state
      if (!isUserInteractingWithSettings) {
        settingsBar.classList.remove('visible');
      }
    }, delay);
    setSettingsBarTimeout(timeout); // Store timeout ID in state
  }
}

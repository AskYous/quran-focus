import { loadVerse } from '../script.js'; // Needed for handleAyahChange
import { togglePlayPause, updatePlayPauseButton } from './audio.js'; // Removed showAudioControls, resetAudioHideTimeout
import { navigate } from './navigation.js';
import { quranData } from './quranData.js';
import { setCurrentAyahNumber, setIsUserInteractingWithSettings } from './state.js'; // Removed setIsUserInteractingWithAudio
import { populateAyahSelect, resetSettingsBarHideTimeout, showSettingsBar, toggleSettingsBar, updateGlowElements } from './ui.js'; // Added toggleSettingsBar
import { calculateGlobalAyahNumber, saveSelectionsToLocalStorage } from './utils.js';

/**
 * Handles changes to the Surah dropdown selection.
 */
export function handleSurahChange() {
  const surahSelectElement = document.getElementById('surah-select');
  const ayahSelectElement = document.getElementById('ayah-select');
  const referenceText = document.getElementById('selected-reference-text'); // Assuming this element exists
  const quranSelector = document.querySelector('.quran-selector');
  const verseContainer = document.getElementById('verse-container');

  if (!(surahSelectElement instanceof HTMLSelectElement)) return;

  const selectedSurahNumber = parseInt(surahSelectElement.value);

  if (quranSelector instanceof HTMLElement) quranSelector.classList.add('changing');
  updateGlowElements();

  if (!selectedSurahNumber) {
    // Reset Ayah dropdown and reference text if no Surah is selected
    if (ayahSelectElement instanceof HTMLSelectElement) {
      ayahSelectElement.innerHTML = '<option value="">-- Select Surah --</option>';
      ayahSelectElement.disabled = true;
    }
    if (referenceText instanceof HTMLElement) referenceText.textContent = 'Select Surah & Ayah';
    if (quranSelector instanceof HTMLElement) quranSelector.classList.remove('changing');
    if (verseContainer instanceof HTMLElement) verseContainer.classList.remove('visible'); // Hide verse
    return;
  }

  // Save the newly selected Surah (defaulting Ayah to 1)
  saveSelectionsToLocalStorage(selectedSurahNumber, "1");
  const selectedSurah = quranData.find(surah => surah.number === selectedSurahNumber);

  if (referenceText instanceof HTMLElement) referenceText.innerHTML = 'Loading Ayahs...';

  // Populate Ayah select, then trigger its change event to load the first Ayah
  setTimeout(() => {
    if (selectedSurah) {
      populateAyahSelect(selectedSurahNumber);
      // Ensure ayahSelectElement is re-queried or asserted after population
      const populatedAyahSelect = document.getElementById('ayah-select');
      if (populatedAyahSelect instanceof HTMLSelectElement && populatedAyahSelect.options.length > 1) {
        populatedAyahSelect.value = "1"; // Explicitly set to Ayah 1
        // Instead of dispatching change, directly call handleAyahChange or loadVerse
        // handleAyahChange(); // This might be better
        loadVerse(selectedSurahNumber, 1).catch(e => console.error("Error loading verse after surah change:", e));
      } else {
        if (referenceText instanceof HTMLElement) referenceText.textContent = `Surah: ${selectedSurah.name}. Ayah?`;
      }
    } else {
      // Handle case where selectedSurah is not found (shouldn't happen)
      if (referenceText instanceof HTMLElement) referenceText.textContent = 'Error finding Surah';
    }

    if (quranSelector instanceof HTMLElement) quranSelector.classList.remove('changing');
  }, 300); // Short delay for UI update
}

/**
 * Handles changes to the Ayah dropdown selection.
 */
export function handleAyahChange() {
  const surahSelectElement = document.getElementById('surah-select');
  const ayahSelectElement = document.getElementById('ayah-select');

  if (!(surahSelectElement instanceof HTMLSelectElement) || !(ayahSelectElement instanceof HTMLSelectElement)) return;

  const selectedSurahNumber = surahSelectElement.value;
  const selectedAyahNumber = ayahSelectElement.value;

  if (!selectedSurahNumber || !selectedAyahNumber) {
    console.log("Ayah change detected, but Surah or Ayah not selected.");
    return;
  }

  // Save selection
  saveSelectionsToLocalStorage(selectedSurahNumber, selectedAyahNumber);

  // Calculate global number and update state
  const globalAyahNumber = calculateGlobalAyahNumber(selectedSurahNumber, selectedAyahNumber);
  setCurrentAyahNumber(globalAyahNumber);

  // Load the selected verse (handles display and audio loading/playing)
  loadVerse(selectedSurahNumber, selectedAyahNumber).catch(error => {
    console.error(`Error loading selected ayah (${selectedSurahNumber}:${selectedAyahNumber}):`, error);
  });
}

/**
 * Handles mouse movement for parallax effect on glow elements.
 * @param {MouseEvent} e
 */
export function handleMouseMove(e) {
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;

  const glowElements = document.querySelectorAll('.ambient-glow');
  glowElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      // Use parseFloat with fallback for data-depth
      const depth = parseFloat(el.dataset.depth || '1');
      const moveX = (mouseX - 0.5) * depth * 30; // Adjust multiplier for effect intensity
      const moveY = (mouseY - 0.5) * depth * 30;
      el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  });
}

/**
 * Sets up primary event listeners for the application.
 */
export function setupEventListeners() {
  const surahSelect = document.getElementById('surah-select');
  if (surahSelect) surahSelect.addEventListener('change', handleSurahChange);

  const ayahSelect = document.getElementById('ayah-select');
  if (ayahSelect) ayahSelect.addEventListener('change', handleAyahChange);

  // Mouse movement for visual effects
  document.addEventListener('mousemove', handleMouseMove);

  // Handle settings bar visibility on hover/interaction
  const settingsBar = document.getElementById('top-settings-bar');
  if (settingsBar instanceof HTMLElement) {
    settingsBar.addEventListener('mouseenter', () => {
      setIsUserInteractingWithSettings(true);
      showSettingsBar(false);
    });
    settingsBar.addEventListener('mouseleave', () => {
      setIsUserInteractingWithSettings(false);
      resetSettingsBarHideTimeout();
    });
  }

  // Handle Tap and Double Tap
  let lastTap = 0;
  let tapTimeout;
  const doubleTapDelay = 300; // ms

  document.body.addEventListener('click', (event) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTap;

    // Ignore clicks inside the settings bar itself
    const settingsBar = document.getElementById('top-settings-bar');
    // Check if the target is a Node and within the settings bar
    if (settingsBar && event.target instanceof Node && settingsBar.contains(event.target)) {
      return;
    }

    if (tapTimeout) clearTimeout(tapTimeout);

    if (timeSinceLastTap < doubleTapDelay && timeSinceLastTap > 0) {
      // Double tap detected
      console.log("Double tap detected");
      toggleSettingsBar();
      lastTap = 0; // Reset last tap time to prevent triple tap issues
    } else {
      // Single tap detected (wait to see if it becomes a double tap)
      tapTimeout = setTimeout(() => {
        console.log("Single tap detected");
        togglePlayPause();
      }, doubleTapDelay);
    }
    lastTap = now;
  });

  // Handle audio ending: navigate to next ayah
  const audioElement = document.getElementById('ayah-audio-player');
  if (audioElement instanceof HTMLAudioElement) {
    audioElement.addEventListener('ended', () => {
      console.log('Audio ended, navigating to next ayah');
      updatePlayPauseButton(true); // Update UI, though button isn't visible
      navigate('next');
    });
  } else {
    console.warn("Audio element not found for 'ended' listener attachment.");
  }

  console.log("Core event listeners set up, including tap/double-tap.");
}

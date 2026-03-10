import { initAudio, stopAudio } from './audio.js';
import { fuzzySearch } from './search.js';
import {
  currentReciterId, currentTranslationId, playbackMode,
  setCurrentReciterId, setCurrentTranslationId, setIsDrawerOpen,
  setIsSearchOverlayOpen, setPlaybackMode, verseCache
} from './state.js';
import { loadSettingsFromLocalStorage, saveSettingsToLocalStorage } from './utils.js';

let recitersData = [];
let translationsData = [];
let activeSearchType = null; // 'reciter' or 'translation'

/**
 * Initializes settings: loads data files, restores persisted settings, sets up event listeners.
 */
export async function initSettings() {
  const [recitersResponse, translationsResponse] = await Promise.all([
    fetch('data/reciters.json').catch(() => null),
    fetch('data/translations.json').catch(() => null)
  ]);

  if (recitersResponse?.ok) {
    recitersData = await recitersResponse.json();
  }
  if (translationsResponse?.ok) {
    translationsData = await translationsResponse.json();
  }

  // Restore persisted settings
  const saved = loadSettingsFromLocalStorage();
  setCurrentReciterId(saved.reciterId);
  setCurrentTranslationId(saved.translationId);
  setPlaybackMode(saved.playbackMode);

  // Initialize audio with reciters data
  initAudio(recitersData);

  // Update UI to reflect current settings
  updateReciterDisplay();
  updateTranslationDisplay();
  updatePlaybackModeUI();

  // Set up event listeners
  setupDrawerListeners();
}

function reciterSupportsAyah(reciter) {
  return !!reciter?.sources?.ayahByAyah;
}

function reciterSupportsFlowing(reciter) {
  return !!reciter?.quranicAudioRecitationId;
}

function updateReciterDisplay() {
  const nameEl = document.getElementById('current-reciter-name');
  if (!nameEl) return;
  const reciter = recitersData.find(r => r.id === currentReciterId);
  nameEl.textContent = reciter ? reciter.name : 'Unknown Reciter';

  const modeSection = document.getElementById('playback-mode-section');
  if (modeSection) {
    const hasAyah = reciterSupportsAyah(reciter);
    const hasFlowing = reciterSupportsFlowing(reciter);
    const hasBoth = hasAyah && hasFlowing;

    // Always show mode section so user sees what's available
    modeSection.classList.remove('hidden');

    // Disable buttons for unsupported modes
    const ayahBtn = document.getElementById('mode-ayah');
    const flowingBtn = document.getElementById('mode-flowing');
    if (ayahBtn) {
      ayahBtn.disabled = !hasAyah;
      ayahBtn.title = hasAyah ? '' : 'Not available for this reciter';
    }
    if (flowingBtn) {
      flowingBtn.disabled = !hasFlowing;
      flowingBtn.title = hasFlowing ? '' : 'Not available for this reciter';
    }

    // Auto-select the only available mode
    if (!hasBoth && reciter) {
      if (hasFlowing && !hasAyah) {
        setPlaybackMode('flowing');
      } else {
        setPlaybackMode('ayah');
      }
      updatePlaybackModeUI();
    }
  }
}

function updateTranslationDisplay() {
  const nameEl = document.getElementById('current-translation-name');
  if (!nameEl) return;
  const translation = translationsData.find(t => t.id === currentTranslationId);
  nameEl.textContent = translation ? translation.name : 'Unknown Translation';
}

function updatePlaybackModeUI() {
  const ayahBtn = document.getElementById('mode-ayah');
  const flowingBtn = document.getElementById('mode-flowing');
  if (ayahBtn) ayahBtn.classList.toggle('active', playbackMode === 'ayah');
  if (flowingBtn) flowingBtn.classList.toggle('active', playbackMode === 'flowing');
}

function openDrawer() {
  const drawer = document.getElementById('settings-drawer');
  const backdrop = document.getElementById('settings-drawer-backdrop');
  if (drawer) { drawer.classList.remove('hidden'); requestAnimationFrame(() => drawer.classList.add('visible')); }
  if (backdrop) { backdrop.classList.remove('hidden'); requestAnimationFrame(() => backdrop.classList.add('visible')); }
  setIsDrawerOpen(true);
}

function closeDrawer() {
  const drawer = document.getElementById('settings-drawer');
  const backdrop = document.getElementById('settings-drawer-backdrop');
  if (drawer) { drawer.classList.remove('visible'); setTimeout(() => drawer.classList.add('hidden'), 300); }
  if (backdrop) { backdrop.classList.remove('visible'); setTimeout(() => backdrop.classList.add('hidden'), 300); }
  setIsDrawerOpen(false);
}

function openSearchOverlay(type) {
  activeSearchType = type;
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');

  if (!overlay || !input) return;

  input.value = '';
  input.placeholder = type === 'reciter' ? 'Search reciters...' : 'Search translations...';
  overlay.classList.remove('hidden');
  requestAnimationFrame(() => overlay.classList.add('visible'));
  setIsSearchOverlayOpen(true);

  setTimeout(() => input.focus(), 100);
  renderSearchResults('');
}

function closeSearchOverlay() {
  const overlay = document.getElementById('search-overlay');
  if (overlay) {
    overlay.classList.remove('visible');
    setTimeout(() => overlay.classList.add('hidden'), 200);
  }
  activeSearchType = null;
  setIsSearchOverlayOpen(false);
}

function renderSearchResults(query) {
  const results = document.getElementById('search-results');
  if (!results) return;
  results.innerHTML = '';

  if (activeSearchType === 'reciter') {
    const filtered = fuzzySearch(query, recitersData, ['name', 'nameArabic']);
    filtered.forEach(reciter => {
      const hasAyah = reciterSupportsAyah(reciter);
      const hasFlowing = reciterSupportsFlowing(reciter);
      const badges = [];
      if (hasAyah) badges.push('<span class="reciter-badge badge-ayah">Ayah</span>');
      if (hasFlowing) badges.push('<span class="reciter-badge badge-flowing">Flowing</span>');

      const item = document.createElement('div');
      item.className = 'search-result-item' + (reciter.id === currentReciterId ? ' selected' : '');
      item.innerHTML = `
        <div>
          <div class="item-name">${reciter.name} ${badges.join('')}</div>
          <div class="item-detail">${reciter.nameArabic || ''}</div>
        </div>
        ${reciter.id === currentReciterId ? '<span class="checkmark">✓</span>' : ''}
      `;
      item.addEventListener('click', () => selectReciter(reciter));
      results.appendChild(item);
    });
  } else if (activeSearchType === 'translation') {
    const filtered = fuzzySearch(query, translationsData, ['name', 'language']);

    // Group by language
    const groups = {};
    filtered.forEach(t => {
      if (!groups[t.language]) groups[t.language] = [];
      groups[t.language].push(t);
    });

    Object.entries(groups).forEach(([language, items]) => {
      const header = document.createElement('div');
      header.className = 'search-result-group-header';
      header.textContent = language;
      results.appendChild(header);

      items.forEach(translation => {
        const item = document.createElement('div');
        item.className = 'search-result-item' + (translation.id === currentTranslationId ? ' selected' : '');
        item.innerHTML = `
          <div>
            <div class="item-name">${translation.name}</div>
          </div>
          ${translation.id === currentTranslationId ? '<span class="checkmark">✓</span>' : ''}
        `;
        item.addEventListener('click', () => selectTranslation(translation));
        results.appendChild(item);
      });
    });
  }
}

function selectReciter(reciter) {
  stopAudio();
  setCurrentReciterId(reciter.id);
  saveSettingsToLocalStorage(reciter.id, currentTranslationId, playbackMode);
  updateReciterDisplay();
  closeSearchOverlay();
}

function selectTranslation(translation) {
  setCurrentTranslationId(translation.id);
  verseCache.clear();
  saveSettingsToLocalStorage(currentReciterId, translation.id, playbackMode);
  updateTranslationDisplay();
  closeSearchOverlay();

  // Reload the currently displayed verse with the new translation
  reloadCurrentVerse();
}

function reloadCurrentVerse() {
  const surahSelect = document.getElementById('surah-select');
  const ayahSelect = document.getElementById('ayah-select');
  if (surahSelect instanceof HTMLSelectElement && ayahSelect instanceof HTMLSelectElement) {
    const surah = parseInt(surahSelect.value);
    const ayah = parseInt(ayahSelect.value);
    if (surah && ayah) {
      import('../script.js').then(({ loadVerse }) => {
        loadVerse(surah, ayah).catch(err => console.error('Error reloading verse:', err));
      });
    }
  }
}

function setupDrawerListeners() {
  const toggleBtn = document.getElementById('settings-drawer-toggle');
  if (toggleBtn) toggleBtn.addEventListener('click', (e) => { e.stopPropagation(); openDrawer(); });

  const closeBtn = document.getElementById('drawer-close');
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  const backdrop = document.getElementById('settings-drawer-backdrop');
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  const reciterBtn = document.getElementById('reciter-select-btn');
  if (reciterBtn) reciterBtn.addEventListener('click', () => openSearchOverlay('reciter'));

  const translationBtn = document.getElementById('translation-select-btn');
  if (translationBtn) translationBtn.addEventListener('click', () => openSearchOverlay('translation'));

  const searchBack = document.getElementById('search-overlay-back');
  if (searchBack) searchBack.addEventListener('click', closeSearchOverlay);

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));

  // Playback mode toggle
  const modeAyah = document.getElementById('mode-ayah');
  const modeFlowing = document.getElementById('mode-flowing');
  if (modeAyah) modeAyah.addEventListener('click', () => {
    if (modeAyah.disabled) return;
    setPlaybackMode('ayah');
    saveSettingsToLocalStorage(currentReciterId, currentTranslationId, 'ayah');
    updatePlaybackModeUI();
    stopAudio();
  });
  if (modeFlowing) modeFlowing.addEventListener('click', () => {
    if (modeFlowing.disabled) return;
    setPlaybackMode('flowing');
    saveSettingsToLocalStorage(currentReciterId, currentTranslationId, 'flowing');
    updatePlaybackModeUI();
    stopAudio();
  });

  // Fullscreen (moved from top bar)
  const fullscreenBtn = document.getElementById('fullscreen-toggle-drawer');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    });
  }

  // Show guide (moved from top bar)
  const guideBtn = document.getElementById('show-onboarding-drawer');
  if (guideBtn) {
    guideBtn.addEventListener('click', () => {
      closeDrawer();
      const modal = document.getElementById('onboarding-modal');
      if (modal) modal.classList.remove('hidden');
    });
  }
}

/**
 * Returns true if the drawer or search overlay is currently open.
 */
export function isSettingsUIOpen() {
  const drawer = document.getElementById('settings-drawer');
  const overlay = document.getElementById('search-overlay');
  return (drawer && drawer.classList.contains('visible')) ||
         (overlay && overlay.classList.contains('visible'));
}

/**
 * Triggers silent update of translations data.
 */
export async function silentDataUpdate() {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/edition?format=text&type=translation');
    if (response.ok) {
      const data = await response.json();
      if (data.data) {
        const freshTranslations = data.data.map(edition => ({
          id: edition.identifier,
          name: edition.englishName || edition.name,
          language: edition.language,
          languageCode: edition.language,
          direction: edition.direction || 'ltr'
        }));

        if (JSON.stringify(freshTranslations) !== JSON.stringify(translationsData)) {
          translationsData = freshTranslations;
          console.log('[Settings] Translations catalog updated silently');
        }
      }
    }
  } catch (error) {
    console.log('[Settings] Silent update failed, using bundled data');
  }
}

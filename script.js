// DATA STRUCTURES MODULE
// Quran structure data - Surah names and their Ayah counts
const quranData = [
  { number: 1, name: "Al-Fatihah (The Opening)", ayahCount: 7 },
  { number: 2, name: "Al-Baqarah (The Cow)", ayahCount: 286 },
  { number: 3, name: "Aal-Imran (The Family of Imran)", ayahCount: 200 },
  { number: 4, name: "An-Nisa (The Women)", ayahCount: 176 },
  { number: 5, name: "Al-Ma'idah (The Table Spread)", ayahCount: 120 },
  { number: 6, name: "Al-An'am (The Cattle)", ayahCount: 165 },
  { number: 7, name: "Al-A'raf (The Heights)", ayahCount: 206 },
  { number: 8, name: "Al-Anfal (The Spoils of War)", ayahCount: 75 },
  { number: 9, name: "At-Tawbah (The Repentance)", ayahCount: 129 },
  { number: 10, name: "Yunus (Jonah)", ayahCount: 109 },
  { number: 11, name: "Hud", ayahCount: 123 },
  { number: 12, name: "Yusuf (Joseph)", ayahCount: 111 },
  { number: 13, name: "Ar-Ra'd (The Thunder)", ayahCount: 43 },
  { number: 14, name: "Ibrahim (Abraham)", ayahCount: 52 },
  { number: 15, name: "Al-Hijr (The Rocky Tract)", ayahCount: 99 },
  { number: 16, name: "An-Nahl (The Bee)", ayahCount: 128 },
  { number: 17, name: "Al-Isra (The Night Journey)", ayahCount: 111 },
  { number: 18, name: "Al-Kahf (The Cave)", ayahCount: 110 },
  { number: 19, name: "Maryam (Mary)", ayahCount: 98 },
  { number: 20, name: "Ta-Ha", ayahCount: 135 },
  { number: 21, name: "Al-Anbiya (The Prophets)", ayahCount: 112 },
  { number: 22, name: "Al-Hajj (The Pilgrimage)", ayahCount: 78 },
  { number: 23, name: "Al-Mu'minun (The Believers)", ayahCount: 118 },
  { number: 24, name: "An-Nur (The Light)", ayahCount: 64 },
  { number: 25, name: "Al-Furqan (The Criterion)", ayahCount: 77 },
  { number: 26, name: "Ash-Shu'ara (The Poets)", ayahCount: 227 },
  { number: 27, name: "An-Naml (The Ants)", ayahCount: 93 },
  { number: 28, name: "Al-Qasas (The Stories)", ayahCount: 88 },
  { number: 29, name: "Al-Ankabut (The Spider)", ayahCount: 69 },
  { number: 30, name: "Ar-Rum (The Romans)", ayahCount: 60 },
  { number: 31, name: "Luqman", ayahCount: 34 },
  { number: 32, name: "As-Sajdah (The Prostration)", ayahCount: 30 },
  { number: 33, name: "Al-Ahzab (The Combined Forces)", ayahCount: 73 },
  { number: 34, name: "Saba (Sheba)", ayahCount: 54 },
  { number: 35, name: "Fatir (Originator)", ayahCount: 45 },
  { number: 36, name: "Ya-Sin", ayahCount: 83 },
  { number: 37, name: "As-Saffat (Those who set the Ranks)", ayahCount: 182 },
  { number: 38, name: "Sad", ayahCount: 88 },
  { number: 39, name: "Az-Zumar (The Troops)", ayahCount: 75 },
  { number: 40, name: "Ghafir (The Forgiver)", ayahCount: 85 },
  { number: 41, name: "Fussilat (Explained in Detail)", ayahCount: 54 },
  { number: 42, name: "Ash-Shura (The Consultation)", ayahCount: 53 },
  { number: 43, name: "Az-Zukhruf (The Gold Adornments)", ayahCount: 89 },
  { number: 44, name: "Ad-Dukhan (The Smoke)", ayahCount: 59 },
  { number: 45, name: "Al-Jathiyah (The Kneeling)", ayahCount: 37 },
  { number: 46, name: "Al-Ahqaf (The Wind-Curved Sandhills)", ayahCount: 35 },
  { number: 47, name: "Muhammad", ayahCount: 38 },
  { number: 48, name: "Al-Fath (The Victory)", ayahCount: 29 },
  { number: 49, name: "Al-Hujurat (The Rooms)", ayahCount: 18 },
  { number: 50, name: "Qaf", ayahCount: 45 },
  { number: 51, name: "Adh-Dhariyat (The Winnowing Winds)", ayahCount: 60 },
  { number: 52, name: "At-Tur (The Mount)", ayahCount: 49 },
  { number: 53, name: "An-Najm (The Star)", ayahCount: 62 },
  { number: 54, name: "Al-Qamar (The Moon)", ayahCount: 55 },
  { number: 55, name: "Ar-Rahman (The Beneficent)", ayahCount: 78 },
  { number: 56, name: "Al-Waqi'ah (The Inevitable)", ayahCount: 96 },
  { number: 57, name: "Al-Hadid (The Iron)", ayahCount: 29 },
  { number: 58, name: "Al-Mujadilah (The Pleading Woman)", ayahCount: 22 },
  { number: 59, name: "Al-Hashr (The Exile)", ayahCount: 24 },
  { number: 60, name: "Al-Mumtahanah (The Examined One)", ayahCount: 13 },
  { number: 61, name: "As-Saff (The Ranks)", ayahCount: 14 },
  { number: 62, name: "Al-Jumu'ah (The Congregation, Friday)", ayahCount: 11 },
  { number: 63, name: "Al-Munafiqun (The Hypocrites)", ayahCount: 11 },
  { number: 64, name: "At-Taghabun (The Mutual Disillusion)", ayahCount: 18 },
  { number: 65, name: "At-Talaq (The Divorce)", ayahCount: 12 },
  { number: 66, name: "At-Tahrim (The Prohibition)", ayahCount: 12 },
  { number: 67, name: "Al-Mulk (The Sovereignty)", ayahCount: 30 },
  { number: 68, name: "Al-Qalam (The Pen)", ayahCount: 52 },
  { number: 69, name: "Al-Haqqah (The Reality)", ayahCount: 52 },
  { number: 70, name: "Al-Ma'arij (The Ascending Stairways)", ayahCount: 44 },
  { number: 71, name: "Nuh (Noah)", ayahCount: 28 },
  { number: 72, name: "Al-Jinn (The Jinn)", ayahCount: 28 },
  { number: 73, name: "Al-Muzzammil (The Enshrouded One)", ayahCount: 20 },
  { number: 74, name: "Al-Muddaththir (The Cloaked One)", ayahCount: 56 },
  { number: 75, name: "Al-Qiyamah (The Resurrection)", ayahCount: 40 },
  { number: 76, name: "Al-Insan (Man)", ayahCount: 31 },
  { number: 77, name: "Al-Mursalat (The Emissaries)", ayahCount: 50 },
  { number: 78, name: "An-Naba (The Tidings)", ayahCount: 40 },
  { number: 79, name: "An-Nazi'at (Those who drag forth)", ayahCount: 46 },
  { number: 80, name: "Abasa (He frowned)", ayahCount: 42 },
  { number: 81, name: "At-Takwir (The Overthrowing)", ayahCount: 29 },
  { number: 82, name: "Al-Infitar (The Cleaving)", ayahCount: 19 },
  { number: 83, name: "Al-Mutaffifin (Defrauding)", ayahCount: 36 },
  { number: 84, name: "Al-Inshiqaq (The Sundering)", ayahCount: 25 },
  { number: 85, name: "Al-Buruj (The Mansions of the Stars)", ayahCount: 22 },
  { number: 86, name: "At-Tariq (The Morning Star)", ayahCount: 17 },
  { number: 87, name: "Al-A'la (The Most High)", ayahCount: 19 },
  { number: 88, name: "Al-Ghashiyah (The Overwhelming)", ayahCount: 26 },
  { number: 89, name: "Al-Fajr (The Dawn)", ayahCount: 30 },
  { number: 90, name: "Al-Balad (The City)", ayahCount: 20 },
  { number: 91, name: "Ash-Shams (The Sun)", ayahCount: 15 },
  { number: 92, name: "Al-Lail (The Night)", ayahCount: 21 },
  { number: 93, name: "Ad-Duha (The Morning Hours)", ayahCount: 11 },
  { number: 94, name: "Ash-Sharh (The Relief)", ayahCount: 8 },
  { number: 95, name: "At-Tin (The Fig)", ayahCount: 8 },
  { number: 96, name: "Al-Alaq (The Clot)", ayahCount: 19 },
  { number: 97, name: "Al-Qadr (The Power, Fate)", ayahCount: 5 },
  { number: 98, name: "Al-Bayyinah (The Clear Proof)", ayahCount: 8 },
  { number: 99, name: "Az-Zalzalah (The Earthquake)", ayahCount: 8 },
  { number: 100, name: "Al-Adiyat (The Courser)", ayahCount: 11 },
  { number: 101, name: "Al-Qari'ah (The Calamity)", ayahCount: 11 },
  { number: 102, name: "At-Takathur (Rivalry in world increase)", ayahCount: 8 },
  { number: 103, name: "Al-Asr (The Declining Day)", ayahCount: 3 },
  { number: 104, name: "Al-Humazah (The Traducer)", ayahCount: 9 },
  { number: 105, name: "Al-Fil (The Elephant)", ayahCount: 5 },
  { number: 106, name: "Quraish (Quraish)", ayahCount: 4 },
  { number: 107, name: "Al-Ma'un (Small Kindnesses)", ayahCount: 7 },
  { number: 108, name: "Al-Kawthar (Abundance)", ayahCount: 3 },
  { number: 109, name: "Al-Kafirun (The Disbelievers)", ayahCount: 6 },
  { number: 110, name: "An-Nasr (Divine Support)", ayahCount: 3 },
  { number: 111, name: "Al-Masad (The Palm Fiber)", ayahCount: 5 },
  { number: 112, name: "Al-Ikhlas (Sincerity)", ayahCount: 4 },
  { number: 113, name: "Al-Falaq (The Daybreak)", ayahCount: 5 },
  { number: 114, name: "An-Nas (Mankind)", ayahCount: 6 }
];

// CONFIGURATION MODULE
const RECITER = {
  shuraym: {
    id: "ar.ahmedajamy",
    name: "Ahmed ibn Ali al-Ajamy",
    bitrate: 128
  }
};

// GLOBAL STATE VARIABLES
let currentAyahNumber = 1;
let audioControlsTimeout;
let isUserInteractingWithAudio = false;

// Add a cache to store preloaded verses
const verseCache = new Map();
let nextVersePreloader = null;

// Function to preload the next verse
async function preloadNextVerse(currentSurah, currentAyah) {
  try {
    // Calculate the next verse number
    let nextSurah = parseInt(currentSurah);
    let nextAyah = parseInt(currentAyah) + 1;

    // If we've reached the end of the surah, move to the next surah
    const currentSurahData = quranData.find(s => s.number == currentSurah);
    if (currentSurahData && nextAyah > currentSurahData.ayahCount) {
      nextSurah++;
      nextAyah = 1;

      // If we've reached the end of the Quran, wrap around to the first surah
      if (nextSurah > 114) {
        nextSurah = 1;
      }
    }

    // Generate a cache key
    const cacheKey = `${nextSurah}:${nextAyah}`;

    // Check if this verse is already in the cache
    if (!verseCache.has(cacheKey)) {
      // Fetch the next verse data
      const verseData = await fetchQuranVerse(nextSurah, nextAyah);

      // Store in cache
      verseCache.set(cacheKey, verseData);

      // Preload the audio as well
      const nextAyahGlobal = calculateGlobalAyahNumber(nextSurah, nextAyah);
      preloadAudio(nextAyahGlobal);
    }
  } catch (error) {
    console.error("Error preloading next verse:", error);
  }
}

// Function to preload audio without playing it
function preloadAudio(ayahNumber) {
  // Create a temporary audio element for preloading
  const tempAudio = new Audio();
  const audioURL = `https://cdn.islamic.network/quran/audio/128/ar.ahmedajamy/${ayahNumber}.mp3`;

  // Just load the audio, don't play it
  tempAudio.src = audioURL;
  tempAudio.preload = 'auto';
  tempAudio.load();

  // We don't need to keep a reference to this element once it loads
  tempAudio.oncanplaythrough = () => {
    tempAudio.oncanplaythrough = null;
  };
}

// API & DATA ACCESS MODULE
async function fetchQuranVerse(surahNumber, ayahNumber) {
  console.log(`Fetching verse data for Surah ${surahNumber}, Ayah ${ayahNumber}`);

  try {
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/editions/quran-simple,en.sahih`);

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

// UTILITY MODULE
function calculateGlobalAyahNumber(surahNumber, ayahNumber) {
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

function calculateSurahAndAyah(globalAyahNumber) {
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

function getSurahAyahCount(surahNum) {
  const surah = quranData.find(s => s.number === surahNum);
  return surah ? surah.ayahCount : 0;
}

// AUDIO CONTROL MODULE
function playAyahAudio(ayahNumber) {
  // Use the correct ID for Ahmed ibn Ali al-Ajamy: ar.ahmedajamy
  const audioURL = `https://cdn.islamic.network/quran/audio/128/ar.ahmedajamy/${ayahNumber}.mp3`;

  // Set the audio source
  const audioPlayerElement = document.getElementById('ayah-audio-player');
  if (audioPlayerElement instanceof HTMLAudioElement) {
    const audioPlayer = audioPlayerElement; // Type is now known
    audioPlayer.src = audioURL;

    // Reset play button state
    updatePlayPauseButton(false);

    // Preload the audio
    audioPlayer.load();

    // Return a promise that resolves when the audio is loaded
    return new Promise((resolve) => {
      // Directly set oncanplaythrough if needed, or just resolve
      const timeoutId = setTimeout(() => {
        console.warn(`Audio ${ayahNumber} timed out loading.`);
        resolve(); // Resolve even on timeout
      }, 3000);

      audioPlayer.oncanplaythrough = () => {
        clearTimeout(timeoutId); // Clear timeout if loaded successfully
        audioPlayer.oncanplaythrough = null; // Remove listener
        resolve();
      };
      audioPlayer.onerror = () => { // Also handle potential load errors
        clearTimeout(timeoutId);
        console.error(`Error loading audio ${ayahNumber}`);
        audioPlayer.onerror = null;
        resolve(); // Resolve anyway to not block execution
      };
    });
  }
  return Promise.resolve();
}

function togglePlayPause() {
  const audioPlayerElement = document.getElementById('ayah-audio-player');
  if (!(audioPlayerElement instanceof HTMLAudioElement)) return;
  const audioPlayer = audioPlayerElement;

  if (audioPlayer.paused) {
    if (!audioPlayer.src || audioPlayer.src === window.location.href) {
      // No valid source - load current ayah
      loadAndDisplayAyah(currentAyahNumber);
      setTimeout(() => playAudio(), 300); // Call playAudio which also checks type
    } else {
      playAudio(); // Call playAudio which also checks type
    }
  } else {
    audioPlayer.pause();
    updatePlayPauseButton(true);
  }
}

function playAudio() {
  const audioPlayerElement = document.getElementById('ayah-audio-player');
  if (!(audioPlayerElement instanceof HTMLAudioElement)) {
    console.log('Audio element not found or not an audio element.');
    return;
  }
  const audioPlayer = audioPlayerElement;

  if (!audioPlayer.src || audioPlayer.src === window.location.href) {
    console.log('No valid audio source to play');
    return;
  }

  console.log('Playing audio:', audioPlayer.src);

  audioPlayer.play()
    .then(() => {
      console.log('Audio playback started successfully');
      updatePlayPauseButton(false);
    })
    .catch(error => {
      console.error('Error playing audio:', error);
      // Attempt to load again if play fails due to needing user interaction
      if (error.name === 'NotAllowedError') {
        console.log('Playback prevented, possibly requires user interaction.');
        // Optionally prompt user or just update button
      }
      updatePlayPauseButton(true);
    });

  showAudioControls();
}

function updatePlayPauseButton(showPlay) {
  const playIcon = document.querySelector('.play-icon');
  const pauseIcon = document.querySelector('.pause-icon');

  if (playIcon && pauseIcon) {
    playIcon.style.display = showPlay ? 'block' : 'none';
    pauseIcon.style.display = showPlay ? 'none' : 'block';
  }
}

function showAudioControls(resetTimeout = true) {
  const audioContainer = document.querySelector('.audio-container');
  if (!audioContainer) return;

  audioContainer.classList.add('visible');

  if (resetTimeout) {
    clearTimeout(audioControlsTimeout);
    audioControlsTimeout = setTimeout(() => {
      if (!isUserInteractingWithAudio) {
        audioContainer.classList.remove('visible');
      }
    }, 2500);
  }
}

// NAVIGATION MODULE
function navigate(direction) {
  const surahSelectElement = document.getElementById('surah-select');
  const ayahSelectElement = document.getElementById('ayah-select');

  if (!(surahSelectElement instanceof HTMLSelectElement) || !(ayahSelectElement instanceof HTMLSelectElement)) return;
  const surahSelect = surahSelectElement;
  const ayahSelect = ayahSelectElement;

  let currentSurah = parseInt(surahSelect.value);
  let currentAyah = parseInt(ayahSelect.value);

  if (direction === 'next') {
    if (currentAyah >= ayahSelect.options.length - 1) {
      currentSurah = currentSurah >= 114 ? 1 : currentSurah + 1;
      currentAyah = 1;
    } else {
      currentAyah++;
    }
  } else {
    if (currentAyah <= 1) {
      currentSurah = currentSurah <= 1 ? 114 : currentSurah - 1;
      currentAyah = -1; // Flag for last ayah
    } else {
      currentAyah--;
    }
  }

  // Update surah if changed
  if (currentSurah !== parseInt(surahSelect.value)) {
    surahSelect.value = String(currentSurah);
    surahSelect.dispatchEvent(new Event('change'));

    if (currentAyah === -1) {
      setTimeout(() => {
        // Re-check ayahSelect type after potential population
        const updatedAyahSelect = document.getElementById('ayah-select');
        if (updatedAyahSelect instanceof HTMLSelectElement) {
          updatedAyahSelect.selectedIndex = updatedAyahSelect.options.length - 1;
          updatedAyahSelect.dispatchEvent(new Event('change'));
          setTimeout(() => playAudio(), 500);
        }
      }, 300);
      return;
    }
  }

  // Update ayah if it wasn't handled by surah change
  if (currentAyah !== -1) {
    ayahSelect.value = String(currentAyah);
    ayahSelect.dispatchEvent(new Event('change'));
    setTimeout(() => playAudio(), 500);
  }
}

// LOCAL STORAGE MODULE
function saveSelectionsToLocalStorage(surahNumber, ayahNumber) {
  try {
    localStorage.setItem('quranMeditationSpace_surah', surahNumber);
    localStorage.setItem('quranMeditationSpace_ayah', ayahNumber);
    console.log('Selections saved to local storage:', { surah: surahNumber, ayah: ayahNumber });
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
}

function loadSelectionsFromLocalStorage() {
  try {
    const savedSurah = localStorage.getItem('quranMeditationSpace_surah');
    const savedAyah = localStorage.getItem('quranMeditationSpace_ayah');
    return {
      surah: savedSurah ? savedSurah : "1",
      ayah: savedAyah ? savedAyah : "1"
    };
  } catch (error) {
    console.error('Error loading from local storage:', error);
    return { surah: "1", ayah: "1" }; // Default values
  }
}

// UI UPDATE MODULE
function populateSurahDropdown() {
  const surahSelect = document.getElementById('surah-select');
  if (!surahSelect) return;

  let delay = 0;

  quranData.forEach((surah, index) => {
    setTimeout(() => {
      const option = document.createElement('option');
      option.value = String(surah.number);
      option.textContent = `${surah.number}. ${surah.name}`;
      surahSelect.appendChild(option);

      // When all items are loaded, add a subtle fade-in effect
      if (index === quranData.length - 1) {
        surahSelect.classList.add('loaded');
      }
    }, delay);

    // Add a small delay for each item for a smooth cascading effect
    delay += 5;
  });
}

function populateAyahSelect(surahNumber) {
  const ayahSelect = document.getElementById('ayah-select');
  const selectedSurah = quranData.find(surah => surah.number === parseInt(surahNumber));

  if (ayahSelect && selectedSurah) {
    ayahSelect.innerHTML = '<option value="">--Please select an Ayah--</option>';
    for (let i = 1; i <= selectedSurah.ayahCount; i++) {
      const option = document.createElement('option');
      option.value = String(i);
      option.textContent = `Ayah ${i}`;
      ayahSelect.appendChild(option);
    }
    ayahSelect.disabled = false;
  }
}

function updateAyahMetadata(ayahData) {
  if (!ayahData) return;

  const juzInfo = document.getElementById('juz-info');
  const pageInfo = document.getElementById('page-info');
  const hizbInfo = document.getElementById('hizb-info');

  if (juzInfo) juzInfo.textContent = ayahData.juz || '-';
  if (pageInfo) pageInfo.textContent = ayahData.page || '-';
  if (hizbInfo) hizbInfo.textContent = ayahData.hizbQuarter ?
    `${Math.floor(ayahData.hizbQuarter / 4) + 1}:${ayahData.hizbQuarter % 4 || 4}` : '-';
}

function updateGlowElements() {
  const glowElements = document.querySelectorAll('.ambient-glow');
  glowElements.forEach(el => {
    const randomX = Math.floor(Math.random() * 300) - 150;
    const randomY = Math.floor(Math.random() * 300) - 150;
    el.style.transform = `translate(${randomX}px, ${randomY}px)`;
  });
}

function loadAndDisplayAyah(globalAyahNumber) {
  // Validate the ayah number
  if (!globalAyahNumber || isNaN(parseInt(globalAyahNumber))) {
    console.error('Invalid ayah number:', globalAyahNumber);
    return false;
  }

  // Convert to integer and store as current ayah
  currentAyahNumber = parseInt(globalAyahNumber);

  console.log(`Loading ayah number ${currentAyahNumber}`);

  // Calculate surah and ayah within surah
  const { surahNumber, ayahWithinSurah } = calculateSurahAndAyah(currentAyahNumber);

  // Update dropdowns
  const surahSelect = document.getElementById('surah-select');
  const ayahSelect = document.getElementById('ayah-select');

  if (surahSelect && ayahSelect) {
    // Set the surah selector
    surahSelect.value = surahNumber;

    // Rebuild ayah options for this surah
    populateAyahSelect(surahNumber);

    // Set the ayah selector
    setTimeout(() => {
      ayahSelect.value = ayahWithinSurah;
    }, 100);
  }

  // Show loading state
  const arabicTextElement = document.getElementById('arabic-text');
  const translationElement = document.getElementById('translation-text');

  if (arabicTextElement) arabicTextElement.innerHTML = 'Loading Arabic text...';
  if (translationElement) translationElement.textContent = 'Loading translation...';

  // Make the API call to fetch verse data
  fetchQuranVerse(surahNumber, ayahWithinSurah)
    .then(verseData => {
      if (!verseData.error) {
        // Use our display verse function with transitions instead of direct updates
        displayVerse(surahNumber, ayahWithinSurah, verseData);

        // Update metadata
        updateAyahMetadata(verseData.meta);
      }
    })
    .catch(error => console.error("Error fetching verse:", error));

  // Load the audio for this ayah
  return playAyahAudio(currentAyahNumber);
}

// Add a function to create the smooth transition effect
function createAyahTransition() {
  // Get the verse elements
  const arabicText = document.getElementById('arabic-text');
  const translationText = document.getElementById('translation-text');

  // Add transition-out class to start the fade-out animation
  // arabicText.classList.add('transition-out');
  // translationText.classList.add('transition-out');

  // Create subtle pulse effect
  const pulseElement = document.querySelector('.verse-transition-pulse');
  // if (pulseElement) {
  //   pulseElement.classList.add('pulse-animation');

  //   // Remove the class after animation completes
  //   setTimeout(() => {
  //     pulseElement.classList.remove('pulse-animation');
  //   }, 1000);
  // }

  // Wait for the fade-out to complete before updating content
  // return new Promise(resolve => {
  //   setTimeout(() => {
  //     // Remove transition classes
  //     // arabicText.classList.remove('transition-out');
  //     // translationText.classList.remove('transition-out');

  //     // Add transition-in class to trigger fade-in animation
  //     // arabicText.classList.add('transition-in');
  //     // translationText.classList.add('transition-in');

  //     // Remove transition-in class after animation completes
  //     // setTimeout(() => {
  //     //   arabicText.classList.remove('transition-in');
  //     //   translationText.classList.remove('transition-in');
  //     // }, 600);

  //     resolve();
  //   }, 300); // Duration of fade-out
  // });
  // Return a promise that resolves immediately
  return Promise.resolve();
}

// Simplified function to create text glow effects for both Arabic and English
function addTextGlowEffects() {
  const elements = [
    { id: 'arabic-text', containerClass: 'ayah-glow-container' },
    { id: 'translation-text', containerClass: 'translation-glow-container' }
  ];

  // Process each text element
  elements.forEach(element => {
    const textElement = document.getElementById(element.id);
    // Ensure textElement exists and is an HTMLElement before accessing parentNode
    if (!(textElement instanceof HTMLElement)) return;

    // Create glow container if it doesn't exist
    const containerSelector = '.' + element.containerClass;
    if (!document.querySelector(containerSelector)) {
      const glowContainer = document.createElement('div');
      glowContainer.className = element.containerClass;
      // Check parentNode before inserting
      if (textElement.parentNode) {
        textElement.parentNode.insertBefore(glowContainer, textElement);
        glowContainer.appendChild(textElement);
      } else {
        console.warn(`Could not add glow container for ${element.id} as parentNode was null.`);
      }
    }
  });
}

// Simplified function to animate all particles
function animateParticles() {
  // Select all particles
  const allParticles = document.querySelectorAll('.light-particle');

  allParticles.forEach(particle => {
    // Check particle type before accessing style or offsetWidth
    if (!(particle instanceof HTMLElement)) return;

    // Reset any existing animations
    particle.style.animation = 'none';

    // Determine if this is a translation particle
    const isTranslation = particle.classList.contains('translation-particle');

    // Calculate particle properties
    const delay = Math.random() * (isTranslation ? 3 : 4);
    const duration = (isTranslation ? 6 : 5) + Math.random() * (isTranslation ? 4 : 5);

    // Force reflow
    void particle.offsetWidth;

    // Apply appropriate animation
    const floatAnimation = isTranslation ? 'float-translation-particle' : 'float-particle';
    const glowAnimation = isTranslation ? 'translation-glow-pulse' : 'glow-pulse';

    particle.style.animation = `${floatAnimation} ${duration}s ease-in-out ${delay}s infinite, 
                              ${glowAnimation} ${duration / 2}s ease-in-out ${delay}s infinite`;

    // Set random positions and properties
    particle.style.top = `${(isTranslation ? 30 : 20) + Math.random() * (isTranslation ? 40 : 60)}%`;
    particle.style.left = `${(isTranslation ? 15 : 10) + Math.random() * (isTranslation ? 70 : 80)}%`;
    particle.style.opacity = (0.2 + Math.random() * (isTranslation ? 0.4 : 0.5)).toString();
    particle.style.width = `${(isTranslation ? 2 : 3) + Math.random() * (isTranslation ? 5 : 8)}px`;
    particle.style.height = particle.style.width;
  });
}

// Modify displayVerse to start preloading the next verse
async function displayVerse(surahNumber, ayahNumber, verseData) {
  // Get the text elements
  const arabicTextElement = document.getElementById('arabic-text');
  const translationTextElement = document.getElementById('translation-text');

  // Clear previous content immediately
  if (arabicTextElement) arabicTextElement.innerHTML = '';
  if (translationTextElement) translationTextElement.innerHTML = '';

  // Ensure elements exist and are HTMLElements before proceeding
  if (!(arabicTextElement instanceof HTMLElement) || !(translationTextElement instanceof HTMLElement)) return;
  const arabicText = arabicTextElement;
  const translationText = translationTextElement;

  // Animation parameters
  const arabicWordDelay = 0.08; // Delay between each Arabic word
  const englishWordDelay = 0.05; // Delay between each English word
  const animationDuration = '0.5s';

  // Process Arabic text (word by word)
  const arabicWords = verseData.arabic.split(' '); // Split by space
  arabicWords.forEach((word, index) => {
    const span = document.createElement('span');
    span.textContent = word + (index < arabicWords.length - 1 ? ' ' : ''); // Add space back
    span.className = 'reveal-word arabic-word'; // Use reveal-word class
    span.style.animationDelay = `${index * arabicWordDelay}s`;
    span.style.animationDuration = animationDuration;
    arabicText.appendChild(span);
  });

  // Process English text (word by word)
  const englishWords = verseData.english.split(' ');
  englishWords.forEach((word, index) => {
    const span = document.createElement('span');
    span.textContent = word + (index < englishWords.length - 1 ? ' ' : '');
    span.className = 'reveal-word english-word'; // Use reveal-word class
    span.style.animationDelay = `${index * englishWordDelay}s`;
    span.style.animationDuration = animationDuration;
    translationText.appendChild(span);
  });

  // Add the immersive glow effects (might need adjustment if they interfere)
  addTextGlowEffects();

  // Create a pulsating effect on the light particles (might need adjustment)
  animateParticles();

  // Update page title with current surah and ayah
  const surahName = quranData.find(s => s.number == surahNumber)?.name || '';
  document.title = `Quran - ${surahName} (${surahNumber}:${ayahNumber})`;

  // Start preloading the next verse
  if (nextVersePreloader) {
    clearTimeout(nextVersePreloader);
  }

  nextVersePreloader = setTimeout(() => {
    preloadNextVerse(surahNumber, ayahNumber);
  }, 500); // Small delay to ensure current verse is fully processed
}

// EVENT HANDLERS
function handleSurahChange() {
  const surahSelectElement = document.getElementById('surah-select');
  const ayahSelectElement = document.getElementById('ayah-select');
  const referenceText = document.getElementById('selected-reference-text');
  const quranSelector = document.querySelector('.quran-selector');
  const verseContainer = document.getElementById('verse-container');

  if (!(surahSelectElement instanceof HTMLSelectElement)) return;
  const surahSelect = surahSelectElement;
  const ayahSelect = ayahSelectElement;

  const selectedSurahNumber = parseInt(surahSelect.value);

  // Add subtle animation effect to the container
  if (quranSelector) {
    quranSelector.classList.add('changing');
  }

  // Update glow elements position randomly
  updateGlowElements();

  // Clear and disable Ayah dropdown if no Surah is selected
  if (!selectedSurahNumber) {
    // Add check for ayahSelect type before accessing disabled
    if (ayahSelect instanceof HTMLSelectElement) {
      ayahSelect.innerHTML = '<option value="">--Please select a Surah first--</option>';
      ayahSelect.disabled = true;
    }
    if (referenceText instanceof HTMLElement) {
      referenceText.textContent = 'Please select a Surah and Ayah to see the reference.';
    }
    if (quranSelector) {
      quranSelector.classList.remove('changing');
    }

    // Hide verse container if no surah selected
    if (verseContainer) {
      verseContainer.classList.remove('visible');
    }
    return;
  }

  // Save selection to local storage (without ayah yet)
  saveSelectionsToLocalStorage(selectedSurahNumber, "1");

  // Find the selected Surah data
  const selectedSurah = quranData.find(surah => surah.number === selectedSurahNumber);

  // Add loading animation
  if (referenceText) {
    referenceText.innerHTML = 'Loading <span class="loading-dots"><span></span><span></span><span></span></span>';
  }

  // Simulate loading delay for a smoother experience
  setTimeout(() => {
    if (ayahSelect && selectedSurah) {
      // Enable and populate Ayah dropdown
      populateAyahSelect(selectedSurahNumber);

      // Check ayahSelect again after population, ensure it's HTMLSelectElement
      const populatedAyahSelect = document.getElementById('ayah-select');
      if (populatedAyahSelect instanceof HTMLSelectElement && populatedAyahSelect.options.length > 1) {
        populatedAyahSelect.selectedIndex = 1;
        populatedAyahSelect.dispatchEvent(new Event('change'));
      } else {
        // If no Ayahs were populated, update reference text accordingly
        if (referenceText) {
          referenceText.textContent = `Selected Surah: ${selectedSurah.name}. Please select an Ayah.`;
        }
      }
    }

    // Remove animation class
    if (quranSelector) {
      quranSelector.classList.remove('changing');
    }
  }, 600);
}

function handleAyahChange() {
  const surahSelectElement = document.getElementById('surah-select');
  const ayahSelectElement = document.getElementById('ayah-select');

  if (!(surahSelectElement instanceof HTMLSelectElement) || !(ayahSelectElement instanceof HTMLSelectElement)) return;
  const surahSelect = surahSelectElement;
  const ayahSelect = ayahSelectElement;

  const selectedSurahNumber = surahSelect.value;
  const selectedAyahNumber = ayahSelect.value;

  if (!selectedSurahNumber || !selectedAyahNumber) return;

  // Save the selection
  saveSelectionsToLocalStorage(selectedSurahNumber, selectedAyahNumber);

  // Calculate global ayah number
  const globalAyahNumber = calculateGlobalAyahNumber(selectedSurahNumber, selectedAyahNumber);
  currentAyahNumber = globalAyahNumber;

  // Fetch verse data and handle transition
  fetchQuranVerse(selectedSurahNumber, selectedAyahNumber)
    .then(verseData => {
      if (!verseData.error) {
        displayVerse(selectedSurahNumber, selectedAyahNumber, verseData);
      }
    })
    .catch(error => console.error("Error fetching verse:", error));

  // Load audio without playing
  playAyahAudio(globalAyahNumber);
}

function handleMouseMove(e) {
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;

  // Subtle parallax effect on glow elements
  const glowElements = document.querySelectorAll('.ambient-glow');
  glowElements.forEach((el, index) => {
    const depth = index + 1;
    const moveX = (mouseX - 0.5) * depth * 30;
    const moveY = (mouseY - 0.5) * depth * 30;

    el.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
}

// AUDIO PLAYER INITIALIZATION
function initCustomAudioPlayer() {
  const audioElement = document.getElementById('ayah-audio-player');
  const customPlayer = document.getElementById('custom-audio-player');
  const audioContainer = document.querySelector('.audio-container');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const prevAyahBtn = document.getElementById('prev-ayah-btn');
  const nextAyahBtn = document.getElementById('next-ayah-btn');

  let hideControlsTimeout;
  let isUserInteracting = false;

  // Apply initial visibility state
  if (audioContainer) {
    // Start visible, then fade out
    audioContainer.classList.add('visible');
    setTimeout(() => audioContainer.classList.remove('visible'), 3000);
  }

  // Add event listeners
  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
  if (prevAyahBtn) prevAyahBtn.addEventListener('click', () => navigate('prev'));
  if (nextAyahBtn) nextAyahBtn.addEventListener('click', () => navigate('next'));

  // Handle audio end
  if (audioElement instanceof HTMLAudioElement) { // Check type here
    audioElement.addEventListener('ended', () => {
      console.log('Audio ended, navigating to next ayah');
      updatePlayPauseButton(true);
      navigate('next');
    });
  } else {
    console.warn("Audio element not found for 'ended' listener attachment.");
  }

  // Show controls on interaction
  let mouseMoveTimer;
  document.addEventListener('mousemove', function () {
    clearTimeout(mouseMoveTimer);
    mouseMoveTimer = setTimeout(showControls, 50);
  });
  document.addEventListener('click', () => showControls());
  document.addEventListener('touchstart', () => showControls());

  // Handle controls visibility when hovering
  if (audioContainer) {
    audioContainer.addEventListener('mouseenter', function () {
      isUserInteracting = true;
      showControls(false); // Don't reset timeout
    });

    audioContainer.addEventListener('mouseleave', function () {
      isUserInteracting = false;
      resetHideTimeout();
    });
  }

  function showControls(resetTimeout = true) {
    if (audioContainer) {
      audioContainer.classList.add('visible');
      if (resetTimeout) resetHideTimeout();
    }
  }

  function resetHideTimeout(delay = 2500) {
    clearTimeout(hideControlsTimeout);
    if (audioContainer) {
      hideControlsTimeout = setTimeout(function () {
        if (!isUserInteracting) {
          audioContainer.classList.remove('visible');
        }
      }, delay);
    }
  }
}

// SETUP EVENT LISTENERS
function setupEventListeners() {
  // Surah selection change
  const surahSelect = document.getElementById('surah-select');
  if (surahSelect) {
    surahSelect.addEventListener('change', handleSurahChange);
  }

  // Ayah selection change
  const ayahSelect = document.getElementById('ayah-select');
  if (ayahSelect) {
    ayahSelect.addEventListener('change', handleAyahChange);
  }

  // Settings panel toggle
  const settingsToggle = document.getElementById('settings-toggle');
  const settingsPanel = document.getElementById('settings-panel');
  if (settingsToggle && settingsPanel) {
    settingsToggle.addEventListener('click', () => {
      settingsPanel.classList.toggle('hidden');
      settingsPanel.classList.toggle('visible');
    });

    // Close settings when clicking outside
    document.addEventListener('click', function (event) {
      const isClickInsideSettings = settingsPanel.contains(event.target) ||
        settingsToggle.contains(event.target);

      if (!isClickInsideSettings && settingsPanel.classList.contains('visible')) {
        settingsPanel.classList.remove('visible');
        settingsPanel.classList.add('hidden');
      }
    });
  }

  // Mouse movement effects
  document.addEventListener('mousemove', handleMouseMove);
}

// INITIALIZATION 
function setDefaultSelections() {
  const surahSelectElement = document.getElementById('surah-select');

  if (!(surahSelectElement instanceof HTMLSelectElement)) {
    console.error("Surah select element not found or not a select element");
    return;
  }
  const surahSelect = surahSelectElement;

  const savedSelections = loadSelectionsFromLocalStorage();

  if (surahSelect.options.length > 1) {
    surahSelect.value = savedSelections.surah;
    surahSelect.dispatchEvent(new Event('change'));
  }
}

// MAIN INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  // Initialize particles.js if available
  if (typeof window.particlesJS !== 'undefined') {
    window.particlesJS.load('particles-js', 'particles.json', function () {
      console.log('Particles.js loaded successfully');
    });
  }

  // Set up core functionality
  setupEventListeners();
  initCustomAudioPlayer();

  // Populate dropdowns with data
  setTimeout(() => {
    populateSurahDropdown();
    // Wait until all options are loaded before setting defaults
    setTimeout(setDefaultSelections, quranData.length * 5 + 100);
  }, 500);
});

// Modified loadVerse function to use cache when available
async function loadVerse(surahNumber, ayahNumber) {
  // Save current position to history state
  currentSurahNumber = surahNumber;
  currentAyahNumber = ayahNumber;

  // Update URL without triggering a page reload
  const newUrl = `?surah=${surahNumber}&ayah=${ayahNumber}`;
  history.pushState({ surah: surahNumber, ayah: ayahNumber }, '', newUrl);

  // Set the surah selector
  const surahSelect = document.getElementById('surah-select');
  if (surahSelect) {
    surahSelect.value = surahNumber;
  }

  // Generate a cache key
  const cacheKey = `${surahNumber}:${ayahNumber}`;

  // Try to get the verse from cache
  let verseData;
  if (verseCache.has(cacheKey)) {
    verseData = verseCache.get(cacheKey);
    await displayVerse(surahNumber, ayahNumber, verseData);
  } else {
    // If not in cache, fetch it normally
    try {
      verseData = await fetchQuranVerse(surahNumber, ayahNumber);
      verseCache.set(cacheKey, verseData); // Add to cache
      await displayVerse(surahNumber, ayahNumber, verseData);
    } catch (error) {
      console.error("Error loading verse:", error);
    }
  }

  // Handle audio loading and playing
  return playAyahAudio(currentAyahNumber);
}

// Handle navigation buttons to use the cache
function navigateToNextAyah() {
  let nextSurah = currentSurahNumber;
  let nextAyah = parseInt(currentAyahWithinSurah) + 1;

  // If we're at the end of the surah, go to the next one
  const currentSurahData = quranData.find(s => s.number == currentSurahNumber);
  if (currentSurahData && nextAyah > currentSurahData.ayahCount) {
    nextSurah++;
    nextAyah = 1;

    // If we're at the end of the Quran, loop back to the beginning
    if (nextSurah > 114) {
      nextSurah = 1;
      nextAyah = 1;
    }
  }

  loadVerse(nextSurah, nextAyah);
}

function navigateToPreviousAyah() {
  let prevSurah = currentSurahNumber;
  let prevAyah = parseInt(currentAyahWithinSurah) - 1;

  // If we're at the beginning of the surah, go to the previous one
  if (prevAyah < 1) {
    prevSurah--;

    // If we're at the beginning of the Quran, loop back to the end
    if (prevSurah < 1) {
      prevSurah = 114;
    }

    // Get the number of ayahs in the previous surah
    const prevSurahData = quranData.find(s => s.number == prevSurah);
    if (prevSurahData) {
      prevAyah = prevSurahData.ayahCount;
    } else {
      prevAyah = 1; // Fallback
    }
  }

  loadVerse(prevSurah, prevAyah);
}

// Limit cache size to prevent memory issues
function limitCacheSize() {
  const MAX_CACHE_SIZE = 50; // Adjust based on your needs

  if (verseCache.size > MAX_CACHE_SIZE) {
    // Remove the oldest entries
    const keysToDelete = Array.from(verseCache.keys()).slice(0, verseCache.size - MAX_CACHE_SIZE);
    keysToDelete.forEach(key => verseCache.delete(key));
  }
}

// Add cache management to the app initialization
function initializeApp() {
  // ... existing initialization code ...

  // Set up a periodic cache cleanup
  setInterval(limitCacheSize, 60000); // Check every minute
} 
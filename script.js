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
    id: "ar.saoodshuraym",
    name: "Sa'ud ash-Shuraym",
    bitrate: 64
  }
};

// GLOBAL STATE VARIABLES
let currentAyahNumber = 1;

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
function playAyahAudio(globalAyahNumber) {
  try {
    // If there's a valid ayah number to play
    if (globalAyahNumber) {
      console.log(`Setting up audio for ayah number ${globalAyahNumber}`);

      // Construct the audio URL using the AlQuran.Cloud CDN
      const audioUrl = `https://cdn.islamic.network/quran/audio/${RECITER.shuraym.bitrate}/${RECITER.shuraym.id}/${globalAyahNumber}.mp3`;

      // Get the audio element
      const audioPlayer = document.getElementById('ayah-audio-player');

      // Update the audio element's src attribute if element exists
      if (audioPlayer) {
        audioPlayer.setAttribute('src', audioUrl);
        audioPlayer.load();

        // Reset the play/pause button to show play icon
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        if (playIcon && pauseIcon) {
          playIcon.style.display = 'block';
          pauseIcon.style.display = 'none';
        }

        console.log(`Set audio source to: ${audioUrl}`);
        return true; // Return true if audio source was set successfully
      }
    }
  } catch (error) {
    console.error('Error in playAyahAudio:', error);
  }
  return false;
}

function togglePlayPause() {
  const audioPlayer = document.getElementById('ayah-audio-player');
  const playIcon = document.querySelector('.play-icon');
  const pauseIcon = document.querySelector('.pause-icon');

  if (audioPlayer && playIcon && pauseIcon) {
    if (audioPlayer.paused) {
      playAudio();
    } else {
      audioPlayer.pause();
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  }
}

function playAudio() {
  const audioPlayer = document.getElementById('ayah-audio-player');
  const playIcon = document.querySelector('.play-icon');
  const pauseIcon = document.querySelector('.pause-icon');

  if (audioPlayer && playIcon && pauseIcon) {
    // Check if the audio source is valid before playing
    if (!audioPlayer.src || audioPlayer.src === window.location.href) {
      console.log('No valid audio source set. Loading current ayah audio...');
      // Load audio for current ayah
      if (loadAndDisplayAyah(currentAyahNumber)) {
        // Small delay to ensure audio is loaded
        setTimeout(() => audioPlayer.play()
          .then(() => {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
          })
          .catch(error => {
            console.error('Error playing audio:', error);
          }), 300);
        return;
      }
    }

    // If we have a valid source already, proceed normally
    audioPlayer.play()
      .then(() => {
        // Update UI when successfully started playing
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      })
      .catch(error => {
        console.error('Error auto-playing audio:', error);
      });
  }
}

// NAVIGATION MODULE
function navigateToNextAyah() {
  try {
    const surahSelect = document.getElementById('surah-select');
    const ayahSelect = document.getElementById('ayah-select');

    if (!surahSelect || !ayahSelect) return;

    let currentSurah = parseInt(surahSelect.value);
    let currentAyah = parseInt(ayahSelect.value);
    let totalAyahs = ayahSelect.options.length - 1; // Account for the placeholder option

    // If we're at the last ayah of the current surah
    if (currentAyah >= totalAyahs) {
      // If we're at the last surah, wrap around to the first surah
      if (currentSurah >= 114) {
        currentSurah = 1;
      } else {
        currentSurah++;
      }

      // Update the surah dropdown
      surahSelect.value = currentSurah;

      // Trigger the change event to load the ayahs for this surah
      surahSelect.dispatchEvent(new Event('change'));

      // Select the first ayah of the next surah
      setTimeout(() => {
        ayahSelect.selectedIndex = 1; // First ayah (index 0 is the placeholder)
        ayahSelect.dispatchEvent(new Event('change'));
        // Play the audio after selection
        playAudioAfterAyahChange();
      }, 300);
    } else {
      // Simply go to the next ayah in the current surah
      ayahSelect.value = currentAyah + 1;
      ayahSelect.dispatchEvent(new Event('change'));
      // Play the audio
      playAudioAfterAyahChange();
    }
  } catch (error) {
    console.error('Error navigating to next ayah:', error);
  }
}

function navigateToPreviousAyah() {
  try {
    const surahSelect = document.getElementById('surah-select');
    const ayahSelect = document.getElementById('ayah-select');

    if (!surahSelect || !ayahSelect) return;

    let currentSurah = parseInt(surahSelect.value);
    let currentAyah = parseInt(ayahSelect.value);

    // If we're at the first ayah of the current surah
    if (currentAyah <= 1) {
      // If we're at Surah 1, wrap around to the last surah
      if (currentSurah <= 1) {
        currentSurah = 114; // Last surah in the Quran
      } else {
        currentSurah--;
      }

      // Update the surah dropdown
      surahSelect.value = currentSurah;

      // Trigger the change event to load the ayahs for this surah
      surahSelect.dispatchEvent(new Event('change'));

      // Select the last ayah of the previous surah (will be populated after the event)
      setTimeout(() => {
        if (ayahSelect.options.length > 0) {
          ayahSelect.selectedIndex = ayahSelect.options.length - 1;
          ayahSelect.dispatchEvent(new Event('change'));
          // Play the audio after selection
          playAudioAfterAyahChange();
        }
      }, 300);
    } else {
      // Simply go to the previous ayah in the current surah
      ayahSelect.value = currentAyah - 1;
      ayahSelect.dispatchEvent(new Event('change'));
      // Play the audio
      playAudioAfterAyahChange();
    }
  } catch (error) {
    console.error('Error navigating to previous ayah:', error);
  }
}

function playAudioAfterAyahChange() {
  setTimeout(() => {
    const audioElement = document.getElementById('ayah-audio-player');
    if (audioElement && audioElement.src && audioElement.src !== window.location.href) {
      // Update the play/pause button appearance
      const playIcon = document.querySelector('.play-icon');
      const pauseIcon = document.querySelector('.pause-icon');

      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'block';

      // Play the audio
      const playPromise = audioElement.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Auto-play was prevented
          if (playIcon) playIcon.style.display = 'block';
          if (pauseIcon) pauseIcon.style.display = 'none';
        });
      }

      // Show the controls
      const audioContainer = document.querySelector('.audio-container');
      if (audioContainer) {
        audioContainer.classList.add('visible');
      }
    }
  }, 500); // Small delay to ensure audio is loaded
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
        // Update the UI with the verse data
        if (arabicTextElement) arabicTextElement.innerHTML = verseData.arabic;
        if (translationElement) translationElement.textContent = verseData.english || 'Translation not available';

        // Update metadata
        updateAyahMetadata(verseData.meta);

        // Add animation
        const verseContainer = document.getElementById('verse-container');
        if (verseContainer) {
          verseContainer.classList.add('verse-fade-in');
          setTimeout(() => verseContainer.classList.remove('verse-fade-in'), 1000);
        }
      }
    })
    .catch(error => console.error("Error fetching verse:", error));

  // Load the audio for this ayah
  return playAyahAudio(currentAyahNumber);
}

// EVENT HANDLERS
function handleSurahChange() {
  const surahSelect = document.getElementById('surah-select');
  const ayahSelect = document.getElementById('ayah-select');
  const referenceText = document.getElementById('selected-reference-text');
  const quranSelector = document.querySelector('.quran-selector');
  const verseContainer = document.getElementById('verse-container');

  const selectedSurahNumber = parseInt(surahSelect.value);

  // Add subtle animation effect to the container
  if (quranSelector) {
    quranSelector.classList.add('changing');
  }

  // Update glow elements position randomly
  updateGlowElements();

  // Clear and disable Ayah dropdown if no Surah is selected
  if (!selectedSurahNumber) {
    if (ayahSelect) {
      ayahSelect.innerHTML = '<option value="">--Please select a Surah first--</option>';
      ayahSelect.disabled = true;
    }
    if (referenceText) {
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

      // Automatically select the first Ayah (index 1 since we have an empty option at index 0)
      if (ayahSelect.options.length > 1) {
        ayahSelect.selectedIndex = 1; // Select the first Ayah (option at index 1)

        // Manually trigger the change event to load the verse
        ayahSelect.dispatchEvent(new Event('change'));
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
  const surahSelect = document.getElementById('surah-select');
  const ayahSelect = document.getElementById('ayah-select');
  const verseContainer = document.getElementById('verse-container');
  const arabicTextElement = document.getElementById('arabic-text');
  const translationElement = document.getElementById('translation-text');
  const verseMetaElement = document.getElementById('verse-meta');

  const selectedSurahNumber = surahSelect.value;
  const selectedAyahNumber = ayahSelect.value;

  if (!selectedSurahNumber || !selectedAyahNumber) {
    return;
  }

  // Save the selection to local storage
  saveSelectionsToLocalStorage(selectedSurahNumber, selectedAyahNumber);

  // Ensure the verse container is visible
  if (verseContainer) {
    verseContainer.style.display = 'block';
    verseContainer.style.opacity = '1';
  }

  // Display loading state
  if (arabicTextElement) {
    arabicTextElement.innerHTML = 'Loading Arabic text...';
  }

  if (translationElement) {
    translationElement.textContent = 'Loading translation...';
  }

  // Calculate the global ayah number for audio playback
  const globalAyahNumber = calculateGlobalAyahNumber(selectedSurahNumber, selectedAyahNumber);
  currentAyahNumber = globalAyahNumber;

  // Play the audio for the selected ayah
  playAyahAudio(globalAyahNumber);

  // Make the API call to fetch verse data
  fetchQuranVerse(selectedSurahNumber, selectedAyahNumber)
    .then(verseData => {
      if (!verseData.error) {
        // Display Arabic text
        if (arabicTextElement) {
          arabicTextElement.innerHTML = verseData.arabic;
        }

        // Display translation
        if (translationElement) {
          translationElement.textContent = verseData.english || 'Translation not available';
        }

        // Display metadata if available
        if (verseMetaElement && verseData.meta) {
          verseMetaElement.innerHTML = `
            <div class="meta-item">Juz ${verseData.meta.juz}</div>
            <div class="meta-item">Page ${verseData.meta.page}</div>
            <div class="meta-item">Hizb ${Math.ceil(verseData.meta.hizbQuarter / 4)}.${verseData.meta.hizbQuarter % 4 === 0 ? 4 : verseData.meta.hizbQuarter % 4}</div>
          `;
        }

        // Add the fade-in animation when a new verse is displayed
        if (verseContainer) {
          verseContainer.classList.add('verse-fade-in');

          // Remove the class after animation completes
          setTimeout(() => {
            verseContainer.classList.remove('verse-fade-in');
          }, 1000);
        }

        // Now also update the metadata in the settings panel
        updateAyahMetadata(verseData.meta);
      }
    })
    .catch(error => {
      console.error("Error fetching verse:", error);
    });
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
  if (prevAyahBtn) prevAyahBtn.addEventListener('click', navigateToPreviousAyah);
  if (nextAyahBtn) nextAyahBtn.addEventListener('click', navigateToNextAyah);

  // Handle audio end
  if (audioElement) {
    audioElement.addEventListener('ended', () => {
      const playIcon = document.querySelector('.play-icon');
      const pauseIcon = document.querySelector('.pause-icon');

      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';

      // Auto-play next ayah when current one finishes
      navigateToNextAyah();
    });
  }

  // Show controls on interaction
  let mouseMoveTimer;
  document.addEventListener('mousemove', function () {
    clearTimeout(mouseMoveTimer);
    mouseMoveTimer = setTimeout(showControls, 50);
  });
  document.addEventListener('click', showControls);
  document.addEventListener('touchstart', showControls);

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
  // Get references to the DOM elements
  const surahSelect = document.getElementById('surah-select');

  if (!surahSelect) {
    console.error("Surah select element not found");
    return;
  }

  // Load from local storage or use defaults
  const savedSelections = loadSelectionsFromLocalStorage();

  // Default to Surah Al-Fatihah (1) or saved selection
  if (surahSelect.options.length > 1) {
    // Select the Surah from local storage or default to Al-Fatihah
    surahSelect.value = savedSelections.surah;

    // Trigger the change event to populate Ayah dropdown
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
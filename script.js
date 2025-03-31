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

// Reciter configuration - can be easily extended with more reciters
const RECITER = {
  shuraym: {
    id: "ar.saoodshuraym",
    name: "Sa'ud ash-Shuraym",
    bitrate: 64  // Bitrate to use for the audio (64, 128, etc.)
  }
};

// Function to fetch Quran verses from API
async function fetchQuranVerse(surahNumber, ayahNumber) {
  console.log(`Fetching verse data for Surah ${surahNumber}, Ayah ${ayahNumber}`);

  try {
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/editions/quran-simple,en.sahih`);
    console.log("API response received:", response);

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API data parsed:", data);

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

    console.log("Extracted verse data:", verseData);
    return verseData;
  } catch (error) {
    console.error("Error in fetchQuranVerse:", error);
    return { error: error.message };
  }
}

// Function to play the ayah audio using Shuraym's recitation
function playAyahAudio(ayahNumber) {
  try {
    // Calculate the global ayah number (required for the CDN)
    let globalAyahNumber = parseInt(ayahNumber);

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

        // Reset the play/pause button to show play icon
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        if (playIcon && pauseIcon) {
          playIcon.style.display = 'block';
          pauseIcon.style.display = 'none';
        }

        console.log(`Set audio source to: ${audioUrl}`);
      } else {
        console.error('Audio player element not found');
      }
    }
  } catch (error) {
    console.error('Error in playAyahAudio:', error);
  }
}

// Function to calculate global ayah number from surah and ayah
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

// Function to save selections to local storage
function saveSelectionsToLocalStorage(surahNumber, ayahNumber) {
  try {
    localStorage.setItem('quranMeditationSpace_surah', surahNumber);
    localStorage.setItem('quranMeditationSpace_ayah', ayahNumber);
    console.log('Selections saved to local storage:', { surah: surahNumber, ayah: ayahNumber });
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
}

// Function to load selections from local storage
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

document.addEventListener('DOMContentLoaded', function () {
  // Initialize particles.js
  if (typeof window.particlesJS !== 'undefined') {
    window.particlesJS.load('particles-js', 'particles.json', function () {
      console.log('Particles.js loaded successfully');
    });
  }

  // Get DOM elements
  const surahSelect = document.getElementById('surah-select');
  const ayahSelect = document.getElementById('ayah-select');
  const referenceText = document.getElementById('selected-reference-text');
  const quranSelector = document.querySelector('.quran-selector');
  const glowElements = document.querySelectorAll('.ambient-glow');
  const verseContainer = document.getElementById('verse-container');
  const arabicTextElement = document.getElementById('arabic-text');
  const translationElement = document.getElementById('translation-text');
  const verseMetaElement = document.getElementById('verse-meta');

  console.log("DOM elements found:", {
    surahSelect: !!surahSelect,
    ayahSelect: !!ayahSelect,
    verseContainer: !!verseContainer,
    arabicTextElement: !!arabicTextElement,
    translationElement: !!translationElement,
    verseMetaElement: !!verseMetaElement
  });

  // Populate Surah dropdown with a smooth loading effect
  setTimeout(() => {
    populateSurahDropdown();

    // Set default values after dropdown is populated
    setTimeout(() => {
      setDefaultSelections();
    }, quranData.length * 5 + 100); // Wait until all options are loaded
  }, 500);

  function populateSurahDropdown() {
    let delay = 0;

    if (surahSelect) {
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
  }

  // Function to set default values for Surah and Ayah
  function setDefaultSelections() {
    // Load from local storage or use defaults
    const savedSelections = loadSelectionsFromLocalStorage();

    // Default to Surah Al-Fatihah (1) or saved selection
    if (surahSelect && surahSelect.options.length > 1) {
      // Select the Surah from local storage or default to Al-Fatihah
      surahSelect.value = savedSelections.surah;

      // Trigger the change event to populate Ayah dropdown
      const changeEvent = new Event('change', { bubbles: true });
      surahSelect.dispatchEvent(changeEvent);

      // Set a timeout to select the Ayah after Ayah dropdown is populated
      setTimeout(() => {
        if (ayahSelect && ayahSelect.options.length > 1) {
          // Try to set ayah from local storage, but check if it's in range
          const surahNumber = parseInt(savedSelections.surah);
          const selectedSurah = quranData.find(surah => surah.number === surahNumber);

          if (selectedSurah) {
            const savedAyahNumber = parseInt(savedSelections.ayah);
            // Make sure the saved ayah is within range for this surah
            if (savedAyahNumber > 0 && savedAyahNumber <= selectedSurah.ayahCount) {
              ayahSelect.value = savedSelections.ayah;
            } else {
              // If out of range, default to the first ayah
              ayahSelect.value = "1";
            }
          } else {
            // If surah not found, default to the first ayah
            ayahSelect.value = "1";
          }

          // Trigger the change event to load the verse and play audio
          ayahSelect.dispatchEvent(new Event('change', { bubbles: true }));

          // Also calculate and play the audio for the initially loaded Ayah
          if (savedSelections.surah && savedSelections.ayah) {
            const globalAyahNumber = calculateGlobalAyahNumber(savedSelections.surah, savedSelections.ayah);
            playAyahAudio(globalAyahNumber);
          }
        }
      }, 700); // Wait for Ayah dropdown to be populated
    }
  }

  // Handle Surah selection change
  if (surahSelect) {
    surahSelect.addEventListener('change', function () {
      const selectedSurahNumber = parseInt(this.value);

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
          ayahSelect.innerHTML = '<option value="">--Please select an Ayah--</option>';
          for (let i = 1; i <= selectedSurah.ayahCount; i++) {
            const option = document.createElement('option');
            option.value = String(i);
            option.textContent = `Ayah ${i}`;
            ayahSelect.appendChild(option);
          }

          ayahSelect.disabled = false;

          // Automatically select the first Ayah (index 1 since we have an empty option at index 0)
          if (ayahSelect.options.length > 1) {
            ayahSelect.selectedIndex = 1; // Select the first Ayah (option at index 1)

            // Manually trigger the change event to load the verse
            const changeEvent = new Event('change', { bubbles: true });
            ayahSelect.dispatchEvent(changeEvent);
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
    });
  }

  // Handle Ayah selection change
  if (ayahSelect) {
    ayahSelect.addEventListener('change', function () {
      console.log("Ayah selection changed");
      const selectedSurahNumber = surahSelect.value;
      const selectedAyahNumber = ayahSelect.value;

      console.log("Selected Surah:", selectedSurahNumber, "Selected Ayah:", selectedAyahNumber);

      if (!selectedSurahNumber || !selectedAyahNumber) {
        console.log("No selection made, returning early");
        return;
      }

      // Save the selection to local storage
      saveSelectionsToLocalStorage(selectedSurahNumber, selectedAyahNumber);

      // Ensure the verse container is visible
      if (verseContainer) {
        verseContainer.style.display = 'block';
        verseContainer.style.opacity = '1';
        console.log("Verse container should be visible now");
      }

      // Display loading state
      if (arabicTextElement) {
        arabicTextElement.innerHTML = 'Loading Arabic text...';
        console.log("Set loading message for Arabic text");
      }

      if (translationElement) {
        translationElement.textContent = 'Loading translation...';
      }

      // Calculate the global ayah number for audio playback
      const globalAyahNumber = calculateGlobalAyahNumber(selectedSurahNumber, selectedAyahNumber);

      // Play the audio for the selected ayah
      playAyahAudio(globalAyahNumber);

      // Make the API call to fetch verse data
      fetchQuranVerse(selectedSurahNumber, selectedAyahNumber)
        .then(verseData => {
          console.log("Verse data received:", verseData);

          if (!verseData.error) {
            // Display Arabic text
            if (arabicTextElement) {
              console.log("Setting Arabic text:", verseData.arabic);
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
          } else {
            console.error("Error in verse data:", verseData.error);
          }
        })
        .catch(error => {
          console.error("Error fetching verse:", error);
        });
    });
  }

  // Helper function to update reference text
  function updateReferenceText(surah, ayahNumber) {
    if (referenceText) {
      referenceText.textContent = `Quran ${surah.number}:${ayahNumber} - ${surah.name}, Ayah ${ayahNumber}`;
    }
  }

  // Helper function to update glow elements
  function updateGlowElements() {
    glowElements.forEach(el => {
      // Generate random positions for ambient glow elements
      const randomX = Math.floor(Math.random() * 300) - 150;
      const randomY = Math.floor(Math.random() * 300) - 150;

      el.style.transform = `translate(${randomX}px, ${randomY}px)`;
    });
  }

  // Add mousemove effect for interactive background
  document.addEventListener('mousemove', function (e) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    // Subtle parallax effect on glow elements
    glowElements.forEach((el, index) => {
      const depth = index + 1;
      const moveX = (mouseX - 0.5) * depth * 30;
      const moveY = (mouseY - 0.5) * depth * 30;

      el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  // Initialize custom audio player functionality
  initCustomAudioPlayer();

  // Add new variables for settings panel
  const settingsToggle = document.getElementById('settings-toggle');
  const settingsPanel = document.getElementById('settings-panel');

  // Toggle settings panel visibility
  if (settingsToggle && settingsPanel) {
    settingsToggle.addEventListener('click', function () {
      settingsPanel.classList.toggle('hidden');
      settingsPanel.classList.toggle('visible');
    });

    // Close settings panel when clicking outside of it
    document.addEventListener('click', function (event) {
      const isClickInsideSettings = settingsPanel.contains(event.target) ||
        settingsToggle.contains(event.target);

      if (!isClickInsideSettings && settingsPanel.classList.contains('visible')) {
        settingsPanel.classList.remove('visible');
        settingsPanel.classList.add('hidden');
      }
    });
  }

  // Set up audio event listeners
  setupAudioEvents();
});

function initCustomAudioPlayer() {
  const audioElement = document.getElementById('ayah-audio-player');
  const customPlayer = document.getElementById('custom-audio-player');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const volumeBtn = document.getElementById('volume-btn');
  const progressBar = customPlayer.querySelector('.progress-bar');
  const progressFilled = customPlayer.querySelector('.progress-filled');
  const currentTime = customPlayer.querySelector('.current-time');
  const durationTime = customPlayer.querySelector('.duration');
  const playIcon = customPlayer.querySelector('.play-icon');
  const pauseIcon = customPlayer.querySelector('.pause-icon');

  // Play/Pause functionality
  playPauseBtn.addEventListener('click', togglePlay);

  // Update progress bar as song plays
  audioElement.addEventListener('timeupdate', updateProgress);

  // Click on progress bar to skip
  progressBar.addEventListener('click', skipTo);

  // Audio duration loaded
  audioElement.addEventListener('loadedmetadata', setDuration);

  // Handle audio ending
  audioElement.addEventListener('ended', audioEnded);

  function togglePlay() {
    if (audioElement.paused) {
      audioElement.play();
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    } else {
      audioElement.pause();
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  }

  function updateProgress() {
    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    progressFilled.style.width = `${percent}%`;

    // Update current time
    currentTime.textContent = formatTime(audioElement.currentTime);
  }

  function skipTo(e) {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioElement.currentTime = pos * audioElement.duration;
  }

  function setDuration() {
    durationTime.textContent = formatTime(audioElement.duration);
  }

  function audioEnded() {
    // Reset UI elements
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';

    // Automatically advance to next ayah
    advanceToNextAyah();
  }

  // Function to advance to the next ayah
  function advanceToNextAyah() {
    const surahSelect = document.getElementById('surah-select');
    const ayahSelect = document.getElementById('ayah-select');
    const verseContainer = document.querySelector('.verse-container');

    if (!surahSelect || !ayahSelect) return;

    // Add fade-out animation to current verse
    if (verseContainer) {
      verseContainer.classList.add('verse-fade-out');

      // Wait for animation to complete before changing verse
      setTimeout(() => {
        // Regular verse changing logic
        const currentSurahNumber = parseInt(surahSelect.value);
        const currentAyahNumber = parseInt(ayahSelect.value);
        const currentSurah = quranData.find(surah => surah.number === currentSurahNumber);

        if (!currentSurah) return;

        // Check if there are more ayahs in the current surah
        if (currentAyahNumber < currentSurah.ayahCount) {
          // Move to next ayah in current surah
          ayahSelect.value = String(currentAyahNumber + 1);
        } else {
          // We're at the end of the current surah
          // Check if there's a next surah available
          if (currentSurahNumber < quranData.length) {
            // Move to first ayah of next surah
            surahSelect.value = String(currentSurahNumber + 1);

            // Trigger surah change event to update ayah dropdown
            const surahChangeEvent = new Event('change', { bubbles: true });
            surahSelect.dispatchEvent(surahChangeEvent);

            // After ayah dropdown is updated, select the first ayah
            setTimeout(() => {
              ayahSelect.selectedIndex = 1; // First ayah (index 0 is the placeholder)
            }, 100);
          } else {
            // We're at the end of the Quran
            console.log("Reached the end of the Quran");
            verseContainer.classList.remove('verse-fade-out');
            return;
          }
        }

        // Trigger the change event to load the next verse
        const changeEvent = new Event('change', { bubbles: true });
        ayahSelect.dispatchEvent(changeEvent);

        // Add a small delay to reveal the new verse with animation
        setTimeout(() => {
          verseContainer.classList.remove('verse-fade-out');
          verseContainer.classList.add('verse-fade-in');

          // Remove the fade-in class after animation completes
          setTimeout(() => {
            verseContainer.classList.remove('verse-fade-in');
          }, 1000);
        }, 100);

        // Auto-play the next ayah after a short delay to ensure audio is loaded
        setTimeout(() => {
          const audioPlayer = document.getElementById('ayah-audio-player');
          if (audioPlayer) {
            audioPlayer.play()
              .then(() => {
                // Update UI to show pause icon when playing
                const playIcon = document.querySelector('.play-icon');
                const pauseIcon = document.querySelector('.pause-icon');
                if (playIcon && pauseIcon) {
                  playIcon.style.display = 'none';
                  pauseIcon.style.display = 'block';
                }
              })
              .catch(error => {
                console.error('Auto-play failed:', error);
              });
          }
        }, 1000); // Increased delay to match the animation timing
      }, 500); // Wait for fade-out animation
    } else {
      // Fallback if verse container not found - use original logic
      // ... existing fallback code from original function ...
    }

    // Add this line near the beginning of the function
    triggerTransitionPulse();
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // Add this function to create the pulse effect
  function triggerTransitionPulse() {
    const pulseElement = document.querySelector('.verse-transition-pulse');
    if (pulseElement) {
      pulseElement.classList.add('pulse-animation');

      // Remove the class after animation completes
      setTimeout(() => {
        pulseElement.classList.remove('pulse-animation');
      }, 1000);
    }
  }
}

// Update this to only reference the metadata elements in the settings panel
function updateAyahMetadata(ayahData) {
  // Make sure we have valid ayah data
  if (!ayahData) return;

  // Get ONLY the metadata elements in the settings panel
  const juzInfo = document.getElementById('juz-info'); // This should be in the settings panel
  const pageInfo = document.getElementById('page-info'); // This should be in the settings panel
  const hizbInfo = document.getElementById('hizb-info'); // This should be in the settings panel

  // Don't try to update elements that should have been removed
  // const juzDisplay = document.getElementById('juz-display'); // Remove this if it was in main UI
  // const pageDisplay = document.getElementById('page-display'); // Remove this if it was in main UI
  // const hizbDisplay = document.getElementById('hizb-display'); // Remove this if it was in main UI

  // Update only the settings panel metadata
  if (juzInfo) juzInfo.textContent = ayahData.juz || '-';
  if (pageInfo) pageInfo.textContent = ayahData.page || '-';
  if (hizbInfo) hizbInfo.textContent = ayahData.hizbQuarter ?
    `${Math.floor(ayahData.hizbQuarter / 4) + 1}:${ayahData.hizbQuarter % 4 || 4}` : '-';
}

function setupAudioEvents() {
  const audioPlayer = document.getElementById('ayah-audio-player');

  if (audioPlayer) {
    // Listen for the 'ended' event which fires when audio playback finishes
    audioPlayer.addEventListener('ended', function () {
      // Get current surah and ayah
      const currentSurah = document.getElementById('surah-select').value;
      const currentAyah = document.getElementById('ayah-select').value;

      if (currentSurah && currentAyah) {
        // Convert to numbers for calculation
        const surahNum = parseInt(currentSurah);
        const ayahNum = parseInt(currentAyah);

        // Get the total number of ayahs in current surah
        const totalAyahs = getSurahAyahCount(surahNum);

        if (ayahNum < totalAyahs) {
          // If not the last ayah in the surah, go to next ayah
          selectNextAyah(surahNum, ayahNum + 1, true); // Pass true to auto-play
        } else {
          // If last ayah in surah, go to first ayah of next surah
          // But check if we're not at the last surah already
          if (surahNum < 114) {
            selectNextAyah(surahNum + 1, 1, true); // Pass true to auto-play
          }
        }
      }
    });
  }
}

// Updated function to select the next ayah, update UI, and auto-play
function selectNextAyah(surahNum, ayahNum, autoPlay = false) {
  // Get the select elements
  const surahSelect = document.getElementById('surah-select');
  const ayahSelect = document.getElementById('ayah-select');
  const audioPlayer = document.getElementById('ayah-audio-player');

  if (!surahSelect || !ayahSelect || !audioPlayer) return;

  // Flag to track when we should play audio
  let shouldPlayAfterUpdate = autoPlay;

  // Update the surah select if needed
  if (surahSelect.value !== surahNum.toString()) {
    surahSelect.value = surahNum.toString();

    // Trigger change event to populate ayah dropdown
    const event = new Event('change');
    surahSelect.dispatchEvent(event);

    // We need to wait a bit for ayahs to be populated
    setTimeout(() => {
      ayahSelect.value = ayahNum.toString();
      ayahSelect.dispatchEvent(new Event('change'));

      // Play after the change event has fully processed
      setTimeout(() => {
        if (shouldPlayAfterUpdate) {
          playAudio();
        }
      }, 300); // Small additional delay to ensure audio is loaded
    }, 100);
  } else {
    // Just update the ayah
    ayahSelect.value = ayahNum.toString();
    ayahSelect.dispatchEvent(new Event('change'));

    // Play after the change event has fully processed
    setTimeout(() => {
      if (shouldPlayAfterUpdate) {
        playAudio();
      }
    }, 300); // Small delay to ensure audio is loaded
  }
}

// Helper function to play audio and update UI accordingly
function playAudio() {
  const audioPlayer = document.getElementById('ayah-audio-player');
  const playIcon = document.querySelector('.play-icon');
  const pauseIcon = document.querySelector('.pause-icon');

  if (audioPlayer && playIcon && pauseIcon) {
    // Start playing
    audioPlayer.play()
      .then(() => {
        // Update UI when successfully started playing
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      })
      .catch(error => {
        console.error('Error auto-playing audio:', error);
        // Some browsers prevent auto-play without user interaction
        // Just leave the play button visible in this case
      });
  }
}

// Helper function to get the total ayahs in a surah
function getSurahAyahCount(surahNum) {
  // This could be fetched from your existing data structure
  // This is an array of ayah counts for each surah (1-indexed)
  const ayahCounts = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128,
    111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73,
    54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60,
    49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52,
    44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19,
    26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3,
    6, 3, 5, 4, 5, 6
  ];

  return ayahCounts[surahNum - 1]; // Adjust for 0-indexed array
} 
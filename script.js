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

          // Trigger the change event to load the verse
          ayahSelect.dispatchEvent(new Event('change', { bubbles: true }));
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
}); 
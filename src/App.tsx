import { useEffect, useState } from 'react'
import AyahSelector from './components/AyahSelector'
import QuranPlayer from './components/QuranPlayer'
import SurahSelector from './components/SurahSelector'
import { fetchSurahs } from './services/quranService'
import { Surah } from './types'

function App() {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null)
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // Load default Surah and Ayah on component mount
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true)
      try {
        // Fetch all surahs
        const surahs = await fetchSurahs()

        if (surahs && surahs.length > 0) {
          // Set default to first Surah (Al-Fatiha)
          const defaultSurah = surahs.find(s => s.number === 1) || surahs[0]
          setSelectedSurah(defaultSurah)

          // Set default to first Ayah
          setSelectedAyah(1)
        }
      } catch (error) {
        console.error('Error initializing app:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quran Focus</h1>
          <p className="text-gray-600">Listen to Saud Shuraym's recitation with focus</p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SurahSelector
              onSelect={(surah) => {
                setSelectedSurah(surah)
                setSelectedAyah(1) // Reset to first Ayah when Surah changes
              }}
              selectedSurah={selectedSurah}
            />
            <AyahSelector
              surah={selectedSurah}
              onSelect={setSelectedAyah}
              selectedAyah={selectedAyah}
            />
          </div>
        </div>

        {loading ? (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
            Loading Quran data...
          </div>
        ) : (
          <QuranPlayer
            surah={selectedSurah}
            startingAyah={selectedAyah}
            autoPlay={true}
          />
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Quran Focus. Built with React and Tailwind.</p>
        </footer>
      </div>
    </div>
  )
}

export default App

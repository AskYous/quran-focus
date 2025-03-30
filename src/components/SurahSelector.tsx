import { useEffect, useState } from 'react';
import { fetchSurahs } from '../services/quranService';
import { Surah } from '../types';

interface SurahSelectorProps {
  onSelect: (surah: Surah) => void;
  selectedSurah?: Surah | null;
}

export default function SurahSelector({ onSelect, selectedSurah }: SurahSelectorProps) {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSurahs = async () => {
      setLoading(true);
      const data = await fetchSurahs();
      setSurahs(data);

      // If we have surahs but no selected surah, auto-select Al-Fatiha (1)
      if (data.length > 0 && !selectedSurah) {
        const defaultSurah = data.find(s => s.number === 1) || data[0];
        onSelect(defaultSurah);
      }

      setLoading(false);
    };

    loadSurahs();
  }, [onSelect, selectedSurah]);

  if (loading) {
    return <div className="text-center py-4">Loading Surahs...</div>;
  }

  return (
    <div className="w-full">
      <label htmlFor="surah-select" className="block mb-2 text-sm font-medium">
        Select Surah
      </label>
      <select
        id="surah-select"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        value={selectedSurah?.number || ''}
        onChange={(e) => {
          const selectedSurahNumber = Number(e.target.value);
          const surahToSelect = surahs.find(s => s.number === selectedSurahNumber);
          if (surahToSelect) onSelect(surahToSelect);
        }}
      >
        <option value="">Choose a Surah</option>
        {surahs.map((surah) => (
          <option key={surah.number} value={surah.number}>
            {surah.number}. {surah.englishName} ({surah.name})
          </option>
        ))}
      </select>
    </div>
  );
} 
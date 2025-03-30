import { useEffect, useState } from 'react';
import { Surah } from '../types';

interface AyahSelectorProps {
  surah: Surah | null;
  onSelect: (ayahNumber: number) => void;
  selectedAyah?: number | null;
}

export default function AyahSelector({ surah, onSelect, selectedAyah }: AyahSelectorProps) {
  const [localSelectedAyah, setLocalSelectedAyah] = useState<number | null>(selectedAyah || null);

  // Update local state when props change
  useEffect(() => {
    if (selectedAyah !== undefined) {
      setLocalSelectedAyah(selectedAyah);
    }
  }, [selectedAyah]);

  // When surah changes, auto-select first Ayah if not already selected
  useEffect(() => {
    if (surah && (!localSelectedAyah || localSelectedAyah > surah.numberOfAyahs)) {
      const defaultAyah = 1;
      setLocalSelectedAyah(defaultAyah);
      onSelect(defaultAyah);
    }
  }, [surah, localSelectedAyah, onSelect]);

  if (!surah) {
    return <div className="text-center py-4 text-gray-500">Please select a Surah first</div>;
  }

  const ayahNumbers = Array.from({ length: surah.numberOfAyahs }, (_, i) => i + 1);

  return (
    <div className="w-full mt-4">
      <label htmlFor="ayah-select" className="block mb-2 text-sm font-medium">
        Select Ayah from {surah.englishName}
      </label>
      <select
        id="ayah-select"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        value={localSelectedAyah || ''}
        onChange={(e) => {
          const ayahNumber = Number(e.target.value);
          setLocalSelectedAyah(ayahNumber);
          onSelect(ayahNumber);
        }}
      >
        <option value="">Choose an Ayah</option>
        {ayahNumbers.map((number) => (
          <option key={number} value={number}>
            Ayah {number}
          </option>
        ))}
      </select>
    </div>
  );
} 
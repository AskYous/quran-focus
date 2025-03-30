import { useEffect, useRef, useState } from 'react';
import { fetchAyahs, getAudioUrl } from '../services/quranService';
import { Ayah, Surah } from '../types';

interface QuranPlayerProps {
  surah: Surah | null;
  startingAyah: number | null;
  autoPlay?: boolean;
}

// Maximum number of sources to try
const MAX_RETRY_ATTEMPTS = 2;

export default function QuranPlayer({ surah, startingAyah, autoPlay = true }: QuranPlayerProps) {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioSourceIndex, setAudioSourceIndex] = useState(0);
  const [allSourcesFailed, setAllSourcesFailed] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const retryCountRef = useRef(0);
  const dataLoadedRef = useRef(false);

  // Load ayahs when surah changes
  useEffect(() => {
    if (!surah) return;

    const loadAyahs = async () => {
      setLoading(true);
      dataLoadedRef.current = false;
      setAllSourcesFailed(false); // Reset failed state on new surah
      retryCountRef.current = 0;  // Reset retry count
      setAudioSourceIndex(0);     // Reset to first source
      const data = await fetchAyahs(surah.number);
      setAyahs(data);
      setLoading(false);
      dataLoadedRef.current = true;
    };

    loadAyahs();
  }, [surah]);

  // Update current ayah when startingAyah changes
  useEffect(() => {
    if (startingAyah && surah) {
      setCurrentAyah(startingAyah);
      // Reset audio source index when starting a new ayah
      setAudioSourceIndex(0);
      retryCountRef.current = 0;
      setAllSourcesFailed(false); // Reset failed state on new ayah
    }
  }, [startingAyah, surah]);

  // Auto-play when data is loaded and we have valid surah and ayah
  useEffect(() => {
    // Only auto-play if all conditions are met, user has interacted, and we haven't already failed with all sources
    if (autoPlay && surah && currentAyah && dataLoadedRef.current && !isPlaying && !loading && ayahs.length > 0 && !allSourcesFailed && userInteracted) {
      // Set a small delay to ensure everything is ready
      const timer = setTimeout(() => {
        setIsPlaying(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [autoPlay, surah, currentAyah, isPlaying, loading, ayahs, allSourcesFailed, userInteracted]);

  // Try the next audio source
  const tryNextAudioSource = () => {
    if (retryCountRef.current < MAX_RETRY_ATTEMPTS) {
      retryCountRef.current += 1;
      setAudioSourceIndex(prev => prev + 1);
      setAudioError(`Trying alternative audio source ${retryCountRef.current + 1}/3...`);
    } else {
      // Mark all sources as failed to prevent further auto-play attempts
      setAllSourcesFailed(true);
      setAudioError("Failed to play audio after trying all sources. Please try a different Ayah or Surah.");
      setIsPlaying(false);
    }
  };

  // Handle audio playback and auto-advance
  useEffect(() => {
    if (!currentAyah || !surah || loading || allSourcesFailed) return;

    // Clear previous audio error
    setAudioError(null);

    // Create new audio element with the current source index
    const audioUrl = getAudioUrl(surah.number, currentAyah, audioSourceIndex);
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    // Debug the URL
    console.log("Loading audio from URL:", audioUrl);

    // Set up event listeners
    const handleEnded = () => {
      // Reset retry count for the next ayah
      retryCountRef.current = 0;
      setAudioSourceIndex(0);
      setAllSourcesFailed(false);

      if (currentAyah < surah.numberOfAyahs) {
        setCurrentAyah(prev => prev ? prev + 1 : null);
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = (e: Event) => {
      console.error("Audio error:", e);

      // Try the next audio source
      tryNextAudioSource();
    };

    const handleCanPlay = () => {
      // Successfully loaded audio, reset error
      setAudioError(null);

      if (isPlaying) {
        audio.play().catch(error => {
          console.error('Error playing audio:', error);

          if (error.name === 'NotAllowedError') {
            setAudioError("Browser requires user interaction before playing audio. Please click the play button.");
            setUserInteracted(false);
            setIsPlaying(false);
          } else {
            setAudioError(error.message);
            tryNextAudioSource();
          }
        });
      }
    };

    // Add event listeners
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    // Start loading the audio
    audio.load();

    // Try to play if we're in playing state
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);

          if (error.name === 'NotAllowedError') {
            setAudioError("Browser requires user interaction before playing audio. Please click the play button.");
            setUserInteracted(false);
            setIsPlaying(false);
          } else {
            tryNextAudioSource();
          }
        });
      }
    }

    // Clean up function
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.pause();
      audio.src = '';
    };
  }, [currentAyah, surah, isPlaying, loading, audioSourceIndex, allSourcesFailed]);

  const togglePlayback = () => {
    if (!surah || !currentAyah) return;

    // Set user interaction flag to true when user clicks play button
    setUserInteracted(true);

    // If all sources failed and user clicks play, reset and try again
    if (allSourcesFailed) {
      setAllSourcesFailed(false);
      retryCountRef.current = 0;
      setAudioSourceIndex(0);
      setAudioError(null);
      setIsPlaying(true);
      return;
    }

    setAudioError(null);

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('Error in toggle playback:', error);

            if (error.name === 'NotAllowedError') {
              setAudioError("Browser requires user interaction before playing audio. Please try again.");
              setUserInteracted(true);  // User has interacted, but we'll try again
            } else {
              tryNextAudioSource();
            }
          });
      }
    } else {
      // No audio ref yet, just set state to start playing
      setIsPlaying(true);
    }
  };

  if (!surah || !startingAyah) {
    return (
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
        Please select a Surah and Ayah to start playback
      </div>
    );
  }

  if (loading) {
    return <div className="mt-8 text-center py-4">Loading Ayahs...</div>;
  }

  const currentAyahData = ayahs.find(a => a.numberInSurah === currentAyah);

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {surah.englishName} ({surah.name})
        </h2>
        <button
          onClick={togglePlayback}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          {!userInteracted && autoPlay ? 'Start Playback' : allSourcesFailed ? 'Try Again' : isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      {!userInteracted && autoPlay && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded">
          Your browser requires user interaction before playing audio. Please click "Start Playback" to begin.
        </div>
      )}

      {audioError && (
        <div className={`mb-4 p-3 rounded ${audioError.includes('Trying') ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
          {audioError}
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Now Playing: Ayah {currentAyah}</h3>
        {currentAyahData ? (
          <div className="flex flex-col gap-4">
            <p className="text-2xl font-arabic text-right leading-loose" dir="rtl">
              {currentAyahData.text}
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-500">Select an Ayah to start listening</div>
        )}
      </div>
    </div>
  );
} 
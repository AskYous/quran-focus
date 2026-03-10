// Cache: key = "recitationId:chapterNumber", value = { audioUrl, timings }
const timingCache = new Map();

/**
 * Fetches verse timing data and audio URL for a specific reciter and chapter
 * from the QDC API (qurancdn.com).
 * @param {number} recitationId - The Quran.com recitation ID
 * @param {number} chapterNumber - The surah number (1-114)
 * @returns {Promise<{audioUrl: string, timings: Array<{verseKey: string, timestampFrom: number, timestampTo: number}>} | null>}
 */
export async function fetchVerseTimings(recitationId, chapterNumber) {
  const cacheKey = `${recitationId}:${chapterNumber}`;
  if (timingCache.has(cacheKey)) {
    return timingCache.get(cacheKey);
  }

  try {
    const response = await fetch(
      `https://api.qurancdn.com/api/qdc/audio/reciters/${recitationId}/audio_files?chapter=${chapterNumber}&segments=true`
    );
    if (!response.ok) {
      console.error(`Failed to fetch verse timings: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const audioFile = data.audio_files?.[0];
    if (!audioFile || !audioFile.verse_timings) {
      return null;
    }

    const result = {
      audioUrl: audioFile.audio_url,
      timings: audioFile.verse_timings.map(vt => ({
        verseKey: vt.verse_key,
        timestampFrom: vt.timestamp_from,
        timestampTo: vt.timestamp_to
      }))
    };

    timingCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching verse timings:', error);
    return null;
  }
}

/**
 * Gets cached verse timings if available.
 */
export function getCachedTimings(recitationId, chapterNumber) {
  return timingCache.get(`${recitationId}:${chapterNumber}`) || null;
}

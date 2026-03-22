/**
 * Simple fuzzy search: scores items by substring match quality.
 * Returns items sorted by relevance (best match first).
 *
 * @param {string} query - The search query
 * @param {Array<Object>} items - Items to search
 * @param {Array<string>} fields - Field names to search against
 * @returns {Array<Object>} Filtered and sorted items
 */
export function fuzzySearch(query, items, fields) {
  if (!query || !query.trim()) return items;

  const normalizedQuery = query.toLowerCase().trim();

  const scored = items.map(item => {
    let bestScore = 0;

    for (const field of fields) {
      const value = item[field];
      if (!value) continue;

      const normalizedValue = String(value).toLowerCase();
      const score = getMatchScore(normalizedQuery, normalizedValue);
      if (score > bestScore) bestScore = score;
    }

    return { item, score: bestScore };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.item);
}

/**
 * Scores how well the query matches the value.
 * Higher = better match.
 */
function getMatchScore(query, value) {
  if (value === query) return 100;
  if (value.startsWith(query)) return 80;

  const index = value.indexOf(query);
  if (index >= 0) return 60 - index;

  // Check if all query chars appear in order (fuzzy)
  let qi = 0;
  for (let vi = 0; vi < value.length && qi < query.length; vi++) {
    if (value[vi] === query[qi]) qi++;
  }
  if (qi === query.length) return 20;

  return 0;
}

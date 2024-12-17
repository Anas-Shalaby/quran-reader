export const searchSurahs = (surahs, query) => {
  if (!query) return [];

  return surahs.flatMap(surah => 
    Object.entries(surah.verse)
      .filter(([key, verse]) => 
        key.startsWith('verse_') && 
        verse.toLowerCase().includes(query.toLowerCase())
      )
      .map(([key, verse]) => ({
        surahNumber: surah.index,
        surahName: surah.name,
        verseNumber: key.replace('verse_', ''),
        verseText: verse
      }))
  );
};

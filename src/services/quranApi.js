import { Language, quran } from '@quranjs/api';
import axios from 'axios';
import { Quran, TafseerEnum, TranslationEnum } from 'islam.js';

const BASE_URL = 'https://api.quran.com/api/v4';

export const fetchSurahs = async () => {
  try {
    const response = await quran.v4.chapters.findAll({
        fetchFn : (url) => axios.get(url).then(res => res.data)
    });
    return response;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw error;
  }
};

export const fetchSurahVerses = async (surahNumber) => {
  try {
    const response = await axios.get(`${BASE_URL}/quran/verses/uthmani`,{
        params: {
            chapter_number: surahNumber
        }
    });
    return response.data.verses;
  } catch (error) {
    console.error(`Error fetching verses for Surah ${surahNumber}:`, error);
    throw error;
  }
};

export const fetchTafasir = async (surahNumber, surahs) => {
  try {
    const quranInstance = new Quran();
    const currentSurah = surahs.find(s => s.id === parseInt(surahNumber));
    const versesCount = currentSurah ? currentSurah.versesCount : 7; // Fallback to 7 if not found

    const tafasirPromises = [];

    // Fetch tafasir for each verse in the surah
    for (let verseNumber = 1; verseNumber <= versesCount; verseNumber++) {
      const tafasirPromise = quranInstance.getVerseWithTranslationAndTafseer(
        parseInt(surahNumber), 
        verseNumber, 
        TranslationEnum.English, 
        TafseerEnum.TafseerAlSaddiArabic
      );
      tafasirPromises.push(tafasirPromise);
    }

    const tafasirResults = await Promise.all(tafasirPromises);
    return tafasirResults;
  } catch (error) {
    console.error(`Error fetching tafasir for Surah ${surahNumber}:`, error);
    throw error;
  }
};

export const searchQuran = async (query, page = 1, limit = 10, languageCode = 'en') => {
  try {
    // Normalize the query by trimming and removing extra spaces
    const normalizedQuery = query.trim().replace(/\s+/g, ' ');

    // If query is empty, return empty results
    if (!normalizedQuery) {
      return { 
        results: [], 
        totalResults: 0, 
        currentPage: page, 
        totalPages: 0 
      };
    }

    // Fetch surahs to get surah names
    const surahs = await fetchSurahs();

    // Perform search with the full query first
    const fullQueryResponse = await quran.v4.search.search(normalizedQuery, { 
      language: Language.ENGLISH, 
      page: page,
      limit: limit 
    });

    // If full query search returns results, use those
    if (fullQueryResponse?.results && fullQueryResponse.results.length > 0) {
      // Enrich results with surah names
      const enrichedResults = fullQueryResponse.results.map(result => {
        const surahNumber = result.verseKey.split(':')[0];
        const surah = surahs.find(s => s.id === parseInt(surahNumber));
        return {
          ...result,
          surah_name: surah ? surah.nameArabic : '',
          surah_translation: surah ? surah.translatedName.name : ''
        };
      });

      return {
        results: enrichedResults,
        totalResults: fullQueryResponse.total || enrichedResults.length,
        currentPage: page,
        totalPages: Math.ceil((fullQueryResponse.total || enrichedResults.length) / limit)
      };
    }

    // If no results, fall back to multi-word search
    const searchWords = normalizedQuery.split(' ');

    // Search for each word
    const searchResults = await Promise.all(searchWords.map(async (word) => {
      const response = await quran.v4.search.search(word, { 
        language: Language.ENGLISH, 
        page: page,
        limit: limit 
      });
      return response?.results || [];
    }));

    // Flatten and deduplicate results
    const uniqueResults = Array.from(new Set(
      searchResults.flat().map(r => JSON.stringify(r))
    )).map(r => JSON.parse(r));

    // More comprehensive filtering
    const filteredResults = uniqueResults.filter(result => {
      // Check if ALL search words are present
      return searchWords.every(word => {
        const lowercaseWord = word.toLowerCase();
        return (
          result.text.toLowerCase().includes(lowercaseWord) ||
          result.verse_key.toLowerCase().includes(lowercaseWord) ||
          // Add more search fields if needed
          (result.translation && result.translation.toLowerCase().includes(lowercaseWord))
        );
      });
    });

    // Enrich results with surah names
    const enrichedResults = filteredResults.map(result => {
      const surahNumber = result.verse_key.split(':')[0];
      const surah = surahs.find(s => s.id === parseInt(surahNumber));
      return {
        ...result,
        surah_name: surah ? surah.nameArabic : '',
        surah_translation: surah ? surah.translatedName.name : ''
      };
    });

    // Artificial delay to improve perceived performance
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      results: enrichedResults,
      totalResults: enrichedResults.length,
      currentPage: page,
      totalPages: Math.ceil(enrichedResults.length / limit)
    };
  } catch (error) {
    console.error('Error searching Quran:', error);
    return { 
      results: [], 
      totalResults: 0, 
      currentPage: page, 
      totalPages: 0 
    }; 
  }
};

export const getAudioRecitation = async (surahNumber, reciterId = 7) => {
  try {
    const response = await axios.get(`${BASE_URL}/chapter_recitations/${surahNumber}`, {
      params: { reciter_id: reciterId }
    });
    return response.data.audio_file;
  } catch (error) {
    console.error(`Error fetching audio for Surah ${surahNumber}:`, error);
    throw error;
  }
};
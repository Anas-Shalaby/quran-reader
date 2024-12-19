import React, { useState, useEffect } from 'react';
import { searchQuran } from '../services/quranApi';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);

  const handleSearch = async (e, currentPage = 1) => {
    e?.preventDefault();
    
    // Trim and validate query
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setResults([]);
      setTotalResults(0);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setIsSearchTriggered(true);

    try {
      const searchData = await searchQuran(trimmedQuery, currentPage);
      
      // Ensure results are set correctly
      const searchResults = searchData.results || [];
      setResults(searchResults); 
      setTotalResults(searchData.totalResults || 0);
      setCurrentPage(currentPage);
      setTotalPages(searchData.totalPages || 1);

      // If no results, show a more informative message
      if (searchResults.length === 0) {
        setError('لم يتم العثور على نتائج مطابقة. حاول بكلمات مختلفة.');
      }
    } catch (err) {
      setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.');
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    handleSearch(null, newPage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  if (loading) return <LoadingSpinner message="جارٍ البحث..." fullScreen />;

  return (
    <div className="space-y-6 pb-24 dark:bg-dark-50 dark:text-gray-100 min-h-screen mt-10">
      {/* Search Input */}
      <div className="sticky top-0 z-10 bg-white dark:bg-dark-100 shadow-sm rounded-lg">
        <div className="flex items-center bg-gray-100 dark:bg-dark-200 rounded-lg p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text"
            placeholder="ابحث في القرآن..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsSearchTriggered(false);
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            className="w-full bg-transparent focus:outline-none text-right dark:bg-dark-200 dark:text-gray-100"
          />
          <button 
            onClick={handleSearch}
            className="bg-green-500 dark:bg-green-700 text-white p-2 rounded-lg mr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Results Summary */}
      {!loading && isSearchTriggered && query && (
        <div className="text-center text-gray-600 dark:text-gray-300 py-2">
          {totalResults > 0 
            ? `تم العثور على ${totalResults} نتيجة`
            : 'لم يتم العثور على نتائج'}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-500 dark:text-red-400 py-4">
          {error}
        </div>
      )}

      {/* Search Results */}
      <div className="container mx-auto px-4 space-y-4">
        {results.map((result, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-dark-100 rounded-xl shadow-md p-4"
          >
            <div className="flex justify-between items-end mb-2">
              <p className="text-green-800 dark:text-green-300 font-bold text-sm">
                {result.verse_key}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                {result.surah_name} • {result.surah_translation}
              </p>
            </div>
            <p 
              className="text-right text-gray-700 dark:text-gray-300" 
              style={{ fontFamily: 'Amiri Quran, serif' }}
            >
              {result.text}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 bg-green-500 dark:bg-green-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <span className="text-gray-700 dark:text-gray-300">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 bg-green-500 dark:bg-green-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
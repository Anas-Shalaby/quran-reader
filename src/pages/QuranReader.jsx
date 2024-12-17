import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurahs } from '../hooks/useSurahs';
import { searchSurahs } from '../utils/searchSurahs';
import SearchBar from '../components/SearchBar';
import { FaSpinner } from 'react-icons/fa';

const QuranReader = () => {
  const navigate = useNavigate();
  const { surahs, isLoading, error } = useSurahs();
  const [searchResults, setSearchResults] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);

  useEffect(() => {
    if (surahs && surahs.length > 0) {
      setDisplayItems(surahs);
    }
  }, [surahs]);

  const handleSearch = (query) => {
    if (!query) {
      setDisplayItems(surahs);
      setSearchResults([]);
      return;
    }

    const results = searchSurahs(surahs, query);
    setSearchResults(results);
    setDisplayItems(results);
  };

  const handleItemSelect = (item) => {
    const isSurah = 'number' in item;
    const surahNumber = isSurah ? item.number : item.surahNumber;
    navigate(`/surah/${surahNumber}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-modern-bg">
        <div className="flex flex-col items-center">
          <FaSpinner className="text-6xl text-modern-accent animate-spin mb-4" />
          <p className="text-xl text-modern-primary">Loading Surahs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-modern-bg text-red-500">
        <p className="text-xl">Error loading surahs: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-modern-bg flex flex-col p-6">
      <div className="mb-6">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search Surahs or Verses" 
        />
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayItems.map((item) => {
            const isSurah = 'number' in item;
            return (
              <div 
                key={isSurah ? item.number : `${item.surahNumber}-${item.verseNumber}`}
                className="bg-white p-4 rounded-modern shadow-modern cursor-pointer hover:bg-modern-highlight transition-colors"
                onClick={() => handleItemSelect(item)}
              >
                <div className="flex justify-between items-center">
                  {isSurah ? (
                    <span className="font-bold text-modern-primary">
                      {item.number}. {item.name}
                    </span>
                  ) : (
                    <>
                      <span className="font-bold text-modern-primary text-sm">
                        Surah {item.surahNumber}: {item.surahName}
                      </span>
                      <span className="text-xs text-modern-secondary">
                        Verse {item.verseNumber}
                      </span>
                    </>
                  )}
                </div>
                {!isSurah && (
                  <p className="text-modern-secondary text-xs mt-2 line-clamp-2">
                    {item.verseText}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuranReader;

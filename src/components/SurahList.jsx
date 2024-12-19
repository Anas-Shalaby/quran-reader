import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBookmark } from 'react-icons/fa';
import { useQuranProgress } from '../contexts/QuranProgressContext';

const SurahList = ({ surahs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { bookmarks, addBookmark, removeBookmark } = useQuranProgress();

  const filteredSurahs = surahs.filter(surah => 
    surah.nameArabic.includes(searchTerm) || 
    surah.translatedName.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if a surah is bookmarked
  const isSurahBookmarked = (surahNumber) => {
    return bookmarks.some(bookmark => bookmark.surahNumber === surahNumber);
  };

  // Toggle bookmark for a surah
  const toggleSurahBookmark = (surahNumber, event) => {
    event.preventDefault(); // Prevent navigating to surah page
    
    if (isSurahBookmarked(surahNumber)) {
      // Remove all bookmarks for this surah
      removeBookmark(surahNumber);
    } else {
      // Add a bookmark for the first verse of the surah
      addBookmark(surahNumber, 1);
    }
  };
  return (
    <div className="space-y-6 min-h-screen dark:bg-dark-50 dark:text-gray-100 mb-10 mt-20">
      {/* Search Input */}
      <div className="sticky top-0 z-10 bg-white dark:bg-dark-100 shadow-sm rounded-lg">
        <div className="flex items-center bg-gray-100 dark:bg-dark-200 rounded-lg p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text"
            placeholder="ابحث عن سورة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-right dark:bg-dark-200 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Surah Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurahs.map((surah) => (
          <div 
            key={surah.id} 
            className="relative group"
          >
            <Link 
              to={`/quran-pages/${surah.pages[0]}`} 
              className="block"
            >
              <div className="bg-white dark:bg-dark-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 ml-3 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-300 ">{surah.id}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {surah.nameArabic}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {surah.translatedName.name} - {surah.versesCount} اية
                    </p>
                  </div>
                </div>
                <div className="text-gray-400 dark:text-gray-600">
                  {surah.revelationPlace === "makkah" ? 'مكية' : 'مدنية'}
                </div>
              </div>
            </Link>
            <Link 
              to={`/surah/${surah.id}`} 
              className="text-green-600 hover:text-green-800 ml-2"
            >
              انظر التفسير  
            </Link>
        
          </div>
        ))}
      </div>

      {filteredSurahs.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <p>لم يتم العثور على سور مطابقة</p>
        </div>
      )}
    </div>
  );
};

export default SurahList;
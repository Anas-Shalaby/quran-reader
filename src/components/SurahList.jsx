import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SurahList = ({ surahs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSurahs = surahs.filter(surah => 
    surah.nameArabic.includes(searchTerm) || 
    surah.translatedName.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 min-h-screen dark:bg-dark-50 dark:text-gray-100 mb-10">
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
          <Link 
            key={surah.id} 
            to={`/surah/${surah.id}`} 
            className="group"
          >
            <div className="bg-white dark:bg-dark-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 flex justify-between items-center">
              <div className="flex-grow text-right">
                <h2 className="text-lg font-bold text-green-800 dark:text-green-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {surah.nameArabic}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {surah.translatedName.name}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full w-10 h-10 flex items-center justify-center">
                {surah.id}
              </div>
            </div>
          </Link>
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
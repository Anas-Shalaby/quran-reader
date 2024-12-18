import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchSurahVerses, fetchTafasir } from '../services/quranApi';
import LoadingSpinner from '../components/LoadingSpinner';
import BookmarkButton from '../components/BookmarkButton';

const SurahDetail = ({ surahs }) => {
  const navigate = useNavigate();
  const { surahNumber } = useParams();
  const [verses, setVerses] = useState([]);
  const [tafasir, setTafasir] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTafasir, setShowTafasir] = useState({});
  const [hoveredVerse, setHoveredVerse] = useState(null);
  const currentSurah = surahs.find(s => s.id === parseInt(surahNumber));

  useEffect(() => {
    const loadSurahDetails = async () => {
      try {
        const versesData = await fetchSurahVerses(surahNumber);
        const tafasirData = await fetchTafasir(surahNumber, surahs);
        
        setVerses(versesData);
        setTafasir(tafasirData);
        
        const initialShowTafasir = versesData.reduce((acc, verse) => {
          acc[verse.id] = false;
          return acc;
        }, {});
        setShowTafasir(initialShowTafasir);
        
        
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading surah details:', error);
        setLoading(false);
      }
    };

    loadSurahDetails();
  }, [surahNumber, surahs]);

  const toggleTafsir = (verseId) => {
    setShowTafasir(prev => ({
      ...prev,
      [verseId]: !prev[verseId]
    }));
  };

  if (loading) return <LoadingSpinner message="جارٍ تحميل السورة..." fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-50 pb-16">
      {/* Surah Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-700 dark:from-dark-100 dark:to-dark-200 text-white py-6 px-4 relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 dark:bg-white/10 rounded-full p-2 hover:bg-white/30 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 dark:text-gray-100">{currentSurah?.nameArabic}</h1>
          <div className="flex justify-center space-x-4 text-lg dark:text-gray-300">
            <span>{currentSurah?.translatedName?.name}</span>
            <span>•</span>
            <span>عدد الآيات: {currentSurah?.versesCount}</span>
          </div>
        </div>
      </div>

      {/* Verses Container */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {verses.map((verse, index) => (
          <div 
            key={verse.id} 
            className="bg-white dark:bg-dark-100 rounded-xl shadow-md p-4 transition-all duration-300 group"
            onMouseEnter={() => setHoveredVerse(verse.id)}
            onMouseLeave={() => setHoveredVerse(null)}
            onClick={() => tafasir[index] && toggleTafsir(verse.id)}
          >
            {/* Verse Text */}
            <div 
              className={`
                text-right text-2xl leading-loose mb-4 
                dark:text-gray-100
                ${tafasir[index] ? 'cursor-pointer' : ''}
              `}
              style={{ 
                fontFamily: 'Amiri Quran, serif', 
                direction: 'rtl' 
              }}
            >
              {verse.text_uthmani}
              <span 
                className="text-sm text-gray-500 dark:text-gray-400 mr-2 select-none"
              >
                ({verse.verse_key.split(':')[1]})
              </span>
            </div>

            {/* Tooltip */}
            {hoveredVerse === verse.id && tafasir[index] && (
              <div className="absolute left-4 top-0 mt-2 z-10 pointer-events-none">
                <div className="bg-black text-white text-xs rounded-lg py-1 px-2 shadow-lg">
                  اضغط للحصول على التفسير
                </div>
              </div>
            )}

            {/* Tafsir Section */}
            {tafasir[index] && showTafasir[verse.id] && (
              <div className="bg-green-50 dark:bg-dark-200 p-4 rounded-lg animate-fade-in relative mt-4">
                <div className="absolute top-2 right-2 text-green-800 dark:text-green-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg mt-3 font-semibold text-green-800 dark:text-green-300 mb-2">
                  التفسير
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-right">
                  {tafasir[index].tafseer}
                </p>
              </div>
            )}
            <BookmarkButton 
              surahNumber={parseInt(surahNumber)} 
              verseNumber={verse.id} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurahDetail;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { fetchSurahs } from '../services/quranApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const QuranPagesReader = ({ hideNavbar = false }) => {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState([]);
  const [currentSurah, setCurrentSurah] = useState(null);
  const [pageImages, setPageImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayImages, setDisplayImages] = useState([]);
  const galleryRef = useRef(null);

  // Custom navigation arrows for RTL layout
  const CustomLeftNav = ({ onClickPrevious }) => (
    <button 
      onClick={onClickPrevious} 
      className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
                 bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/75 dark:hover:bg-gray-700/75 
                 rounded-full p-2 transition-all duration-300 ease-in-out"
      style={{ 
        position: 'absolute', 
        left: '10px', 
        top: '50%', 
        transform: 'translateY(-50%)',
        zIndex: 10 
      }}
    >
      <ChevronRightIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
    </button>
  );

  const CustomRightNav = ({ onClickNext }) => (
    <button 
      onClick={onClickNext} 
      className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
                 bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/75 dark:hover:bg-gray-700/75 
                 rounded-full p-2 transition-all duration-300 ease-in-out"
      style={{ 
        position: 'absolute', 
        right: '10px', 
        top: '50%', 
        transform: 'translateY(-50%)',
        zIndex: 10 
      }}
    >
      <ChevronLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
    </button>
  );

  useEffect(() => {
    const loadSurahData = async () => {
      try {
        const fetchedSurahs = await fetchSurahs();
        setSurahs(fetchedSurahs);

        const selectedSurah = fetchedSurahs.find(s => s.pages[0] === parseInt(surahNumber));
        setCurrentSurah(selectedSurah)
        
        if (!selectedSurah) {
          throw new Error(`Surah ${surahNumber} not found`);
        }

        // Determine the start and end pages for the entire surah
        const startPage = selectedSurah.pages[0];
        const endPage = selectedSurah.pages[selectedSurah.pages.length - 1];

        // Load all pages for this surah
        const surahImages = [];
        for (let page = startPage; page <= endPage; page++) {
          surahImages.push({
            original: `/quran-images/${page}.png`,
            originalAlt: `${selectedSurah.nameArabic} - Page ${page}`,
            pageNumber: page
          });
        }

        setPageImages(surahImages);
        setLoading(false);
      } catch (error) {
        console.error('Error loading surah pages:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    loadSurahData();
  }, [surahNumber]);

  // Prepare double page view for large screens
  const prepareDoublePageView = useCallback(() => {
    if (pageImages.length < 2) return pageImages;

    const doublePageImages = [];
    for (let i = 0; i < pageImages.length; i += 2) {
      if (i + 1 < pageImages.length) {
        // Create a combined image for two pages side by side
        doublePageImages.push({
          original: pageImages[i].original,
          originalAlt: `${pageImages[i].originalAlt} - ${pageImages[i+1].originalAlt}`,
          pageNumber: `${pageImages[i].pageNumber}-${pageImages[i+1].pageNumber}`,
          additionalPage: pageImages[i+1]
        });
      } else {
        // If odd number of pages, add the last page as is
        doublePageImages.push(pageImages[i]);
      }
    }
    return doublePageImages;
  }, [pageImages]);

  // Effect to update display images based on screen size
  useEffect(() => {
    const handleResize = () => {
      setDisplayImages(
        window.innerWidth >= 640 ? prepareDoublePageView() : pageImages
      );
    };

    // Initial setup
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [pageImages, prepareDoublePageView]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-[#F4F6F7] dark:bg-dark-50 min-h-screen flex flex-col">
      <div className="container mx-auto max-w-5xl flex-grow">
        <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-dark-100">
          

          {/* Image Gallery Container */}
          <div className="relative">
            {displayImages.length > 0 ? (
              <div className="w-full sm:w-full md:w-full lg:w-full mx-auto relative">
                <ImageGallery 
                  ref={galleryRef}
                  items={displayImages}
                  showThumbnails={false}
                  showFullscreenButton={false}
                  useBrowserFullscreen={true}
                  showBullets={false}
                  showPlayButton={false}
                  showIndex={false}
                  showNav={false}
                  lazyLoad={true}
                  isRTL={true}
                  startIndex={0}
                  renderItem={(item) => (
                    <>
                      {/* Mobile-specific overlay */}
                      <div className="block sm:hidden relative">
                        {/* Page number in bottom center */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/70 px-3 py-1 rounded-md">
                          <p className="text-sm font-bold text-[#2C3E50]">
                            صفحة {item.pageNumber || 'N/A'}
                          </p>
                        </div>

                        {/* Mobile View */}
                        <div className="block sm:hidden relative w-screen h-[calc(100vh-3rem)] overflow-hidden">
                          {/* Page number in bottom center */}
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/70 px-3 py-1 rounded-md">
                            <p className="text-sm font-bold text-[#2C3E50]">
                              صفحة {item.pageNumber || 'N/A'}
                            </p>
                          </div>

                          <img 
                            src={item.original} 
                            alt={item.originalAlt} 
                            className="absolute inset-0 bg-white w-full h-full object-contain"
                            style={{ 
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            }}
                          />
                        </div>
                      </div>

                      {/* Large Screen View */}
                      <div className="hidden sm:block relative group">
                        {/* Minimalist Navigation Buttons */}
                        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-between">
                          {/* Previous Page Button - Now on Right (RTL) */}
                          <button 
                            onClick={() => {
                              // Ensure moving to the previous page (going left in RTL)
                              const currentIndex = galleryRef.current?.getCurrentIndex() || 0;
                              const totalSlides = displayImages.length;
                              if (currentIndex < totalSlides - 1) {
                                galleryRef.current?.slideNext();
                              }
                              
                            }}
                            className="pointer-events-auto -mr-6 p-2 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-dark-100 opacity-0 group-hover:opacity-100"
                          >
                            <ChevronLeftIcon className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                          </button>

                          {/* Next Page Button - Now on Left (RTL) */}
                          <button 
                            onClick={() => {
                              // Ensure moving to the next page (going right in RTL)
                              const currentIndex = galleryRef.current?.getCurrentIndex() || 0;
                              if (currentIndex > 0) {
                                galleryRef.current?.slidePrev();
                              }
                            }}
                            className="pointer-events-auto -ml-6 p-2 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-dark-100 opacity-0 group-hover:opacity-100"
                          >
                            <ChevronRightIcon className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                          </button>
                        </div>

                        {/* Page Number */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                          <div className="bg-white dark:bg-dark-300 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-full shadow-md text-sm">
                            صفحة {item.pageNumber || 'N/A'}
                          </div>
                        </div>

                        {/* Image container */}
                        <div className="bg-white dark:bg-white rounded-xl overflow-hidden shadow-lg flex">
                          <img 
                            src={item.original} 
                            alt={item.originalAlt} 
                            className="w-1/2 h-full object-contain"
                            style={{ 
                              maxWidth: '50%', 
                              maxHeight: '100%', 
                              objectFit: 'contain' 
                            }}
                          />
                          {item.additionalPage && (
                            <img 
                              src={item.additionalPage.original} 
                              alt={item.additionalPage.originalAlt} 
                              className="w-1/2 h-full object-contain"
                              style={{ 
                                maxWidth: '50%', 
                                maxHeight: '100%', 
                                objectFit: 'contain' 
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  renderLeftNav={(onClickPrevious) => (
                    <CustomLeftNav 
                      onClickPrevious={() => {
                        // In RTL, left arrow (ChevronRightIcon) goes to next page
                        galleryRef.current?.slideNext();
                      }} 
                    />
                  )}
                  renderRightNav={(onClickNext) => (
                    <CustomRightNav 
                      onClickNext={() => {
                        // In RTL, right arrow (ChevronLeftIcon) goes to previous page
                        galleryRef.current?.slidePrev();
                      }} 
                    />
                  )}
                />
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-100 p-6 rounded-lg">
                No pages available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuranPagesReader;
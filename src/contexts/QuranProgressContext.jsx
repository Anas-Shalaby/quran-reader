import React, { createContext, useState, useContext, useEffect } from 'react';

const QuranProgressContext = createContext();

export const QuranProgressProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);

  // Load bookmarks from local storage on mount
  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('quran_bookmarks') || '[]');
    setBookmarks(storedBookmarks);
  }, []);

  // Save bookmarks to local storage
  const addBookmark = (surahNumber, verseNumber) => {
    const newBookmark = { surahNumber, verseNumber };
    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    localStorage.setItem('quran_bookmarks', JSON.stringify(updatedBookmarks));
  };

  // Remove a specific bookmark
  const removeBookmark = (surahNumber, verseNumber) => {
    const updatedBookmarks = bookmarks.filter(
      bookmark => 
        bookmark.surahNumber !== surahNumber || 
        bookmark.verseNumber !== verseNumber
    );
    setBookmarks(updatedBookmarks);
    localStorage.setItem('quran_bookmarks', JSON.stringify(updatedBookmarks));
  };

  // Get last read location
  const getLastBookmark = () => {
    return bookmarks[bookmarks.length - 1] || null;
  };

  return (
    <QuranProgressContext.Provider value={{
      bookmarks,
      addBookmark,
      removeBookmark,
      getLastBookmark
    }}>
      {children}
    </QuranProgressContext.Provider>
  );
};

// Custom hook for using the context
export const useQuranProgress = () => {
  const context = useContext(QuranProgressContext);
  if (!context) {
    throw new Error('useQuranProgress must be used within a QuranProgressProvider');
  }
  return context;
};
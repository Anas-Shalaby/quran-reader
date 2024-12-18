// src/components/BookmarkButton.jsx
import React from 'react';
import { FaBookmark } from 'react-icons/fa';
import { useQuranProgress } from '../contexts/QuranProgressContext';

const BookmarkButton = ({ surahNumber, verseNumber }) => {
  const { bookmarks, addBookmark, removeBookmark } = useQuranProgress();

  const isBookmarked = bookmarks.some(
    bookmark => 
      bookmark.surahNumber === surahNumber && 
      bookmark.verseNumber === verseNumber
  );

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      removeBookmark(surahNumber, verseNumber);
    } else {
      addBookmark(surahNumber, verseNumber);
    }
  };

  return (
    <button 
      onClick={handleBookmarkToggle}
      className={`
        p-2 rounded-full transition-colors 
        ${isBookmarked 
          ? 'text-yellow-500 bg-yellow-100' 
          : 'text-gray-500 hover:text-yellow-500'}
      `}
    >
      <FaBookmark className="w-5 h-5" />
    </button>
  );
};

export default BookmarkButton;
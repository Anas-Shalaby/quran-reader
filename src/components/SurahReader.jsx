import React from 'react';
import { FaTimes } from 'react-icons/fa';

const SurahReader = ({ surah, onClose }) => {
  if (!surah) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 bg-white z-10 p-4 border-b border-modern-highlight flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-modern-primary">
            {surah.name}
          </h2>
          <p className="text-modern-secondary text-sm">
            Surah {surah.number}
          </p>
        </div>
        <button 
          onClick={onClose} 
          className="text-modern-secondary hover:text-modern-primary transition-colors"
        >
          <FaTimes className="text-2xl" />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4">
        {Object.keys(surah.verse)
          .filter(key => key.startsWith('verse_'))
          .map((key, index) => (
            <div 
              key={key} 
              className="bg-modern-highlight p-4 rounded-modern"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-modern-secondary">
                  Verse {index + 1}
                </span>
              </div>
              <p className="text-modern-primary text-lg leading-relaxed">
                {surah.verse[key]}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SurahReader;
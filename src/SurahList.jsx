import React from 'react';

const SurahList = ({ surahs, onSelectSurah }) => {
  return (
    <div className="surah-container">
      <h1>Quran Surahs</h1>
      <div className="surah-grid">
        {surahs.map((surah) => (
          <div 
            key={surah.number} 
            className="surah-item" 
            onClick={() => onSelectSurah(surah)}
          >
            <h3>{surah.name}</h3>
            <p>Surah {surah.number}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurahList;

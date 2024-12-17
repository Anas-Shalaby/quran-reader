import React from 'react';

const SurahReader = ({ surah, searchResults }) => {
  // Render search results if available
  if (searchResults && searchResults.length > 0) {
    return (
      <div className="search-results">
        <h2>Search Results</h2>
        {searchResults.map((result, index) => (
          <div key={index} className="search-result-item">
            <p>Surah {result.surahNumber}: {result.surahName}</p>
            <p>Verse {result.verseNumber}: {result.verseText}</p>
          </div>
        ))}
      </div>
    );
  }

  // Render selected surah
  if (!surah) return <div>Select a Surah to read</div>;

  return (
    <div className="surah-reader">
      <h2>{surah.name} (Surah {surah.number})</h2>
      <div className="verses">
        {Object.keys(surah.verse)
          .filter(key => key.startsWith('verse_'))
          .map((key) => (
            <div key={key} className="verse">
              <p>{surah.verse[key]}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SurahReader;

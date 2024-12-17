import React, { useState } from 'react';
import { searchQuran } from '../services/quranApi';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const searchResults = await searchQuran(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="mb-6">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Quran..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button 
          type="submit" 
          className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div>
        {results.map((result) => (
          <div key={result.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <p>{result.text}</p>
            <small className="text-gray-600">
              {result.surah_name} - Verse {result.verse_number}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
import { useState, useEffect } from 'react';

export const useSurahs = () => {
  const [surahs, setSurahs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const surahModules = import.meta.glob('../../quran/surah_*.json');
        const loadedSurahs = [];

        for (const path in surahModules) {
          const surahNumber = path.match(/surah_(\d+)\.json/)[1];
          const module = await surahModules[path]();
          loadedSurahs.push({
            ...module.default,
            number: surahNumber
          });
        }

        // Sort surahs by number
        loadedSurahs.sort((a, b) => parseInt(a.number) - parseInt(b.number));
        setSurahs(loadedSurahs);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    loadSurahs();
  }, []);

  return { surahs, isLoading, error };
};

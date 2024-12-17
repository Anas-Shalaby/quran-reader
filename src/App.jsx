import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import HijriCalendarPage from './pages/HijriCalendar';

import { fetchSurahs } from './services/quranApi';
import SurahList from './components/SurahList';
import SurahDetail from './pages/SurahDetail';
import SearchPage from './pages/SearchPage';
import HadithPage from './pages/HadithPage';

const queryClient = new QueryClient();

function NavBar() {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  const toggleDarkMode = useCallback(() => {
    const newMode = !isDarkMode;
    const html = document.documentElement;

    if (newMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    setIsDarkMode(newMode);
  }, [isDarkMode]);

  const navItems = [
    { path: '/', label: 'الرئيسية', icon: 'home' },
    { path: '/search', label: 'البحث', icon: 'search' },
    { path: '/hijri-calendar', label: 'التقويم الهجري', icon: 'calendar' },
    { path: '/hadiths', label: 'الأحاديث', icon: 'book' }

  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-100 shadow-2xl z-50">
      <div className="max-w-md mx-auto flex justify-around py-3">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`
              flex flex-col items-center justify-center 
              p-2 rounded-lg transition-all duration-300
              ${location.pathname === item.path 
                ? 'text-green-600 scale-110' 
                : 'text-gray-500 dark:text-gray-300 hover:text-green-600'}
            `}
          >
            {item.icon === 'home' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            )}
            {item.icon === 'search' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
             {item.icon === 'calendar' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            {item.icon === 'book' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          )}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}

        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="flex flex-col items-center justify-center p-2 rounded-lg"
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m3.343-5.657L5.636 5.636m12.728 12.728L18.364 18.364M12 7a5 5 0 110 10 5 5 0 010-10z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}

function App() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial theme setup
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const html = document.documentElement;

    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    const loadSurahs = async () => {
      try {
        const surahData = await fetchSurahs();
        setSurahs(surahData);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    loadSurahs();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-400 to-green-600 dark:bg-dark-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white dark:border-gray-300 mx-auto mb-4"></div>
        <h2 className="text-white dark:text-gray-200 text-2xl font-bold">قارئ القرآن</h2>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-red-100 dark:bg-dark-100">
      <div className="text-center bg-white dark:bg-dark-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl text-red-600 dark:text-red-400 mb-4">خطأ في التحميل</h2>
        <p className="text-gray-700 dark:text-gray-300">{error.message}</p>
      </div>
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-dark-50 pb-16">
          <header className="bg-gradient-to-r from-green-500 to-green-700 dark:from-dark-100 dark:to-dark-200 text-white py-6 shadow-md">
            <div className="container mx-auto text-center">
              <h1 className="text-3xl font-bold">قارئ القرآن</h1>
            </div>
          </header>
          
          <main className="container mx-auto px-4 pt-6">
            <Routes>
              <Route 
                path="/" 
                element={<SurahList surahs={surahs} />} 
              />
              <Route 
                path="/surah/:surahNumber" 
                element={<SurahDetail surahs={surahs} />} 
              />
              <Route 
                path="/search" 
                element={<SearchPage />} 
              />
              <Route path="/hijri-calendar" element={<HijriCalendarPage />} />
              <Route path="/hadiths" element={<HadithPage />} />

            </Routes>
          </main>

          <NavBar />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { FaMoon, FaSun, FaChartBar } from 'react-icons/fa';
import HijriCalendarPage from './pages/HijriCalendar';
import QuranPagesReader from './pages/QuranPagesReader';
import { fetchSurahs } from './services/quranApi';
import SurahList from './components/SurahList';
import SurahDetail from './pages/SurahDetail';
import SearchPage from './pages/SearchPage';
import HadithPage from './pages/HadithPage';
import PrayerTimesPage from './pages/PrayerTimesPage';
import { QuranProgressProvider } from './contexts/QuranProgressContext';
import { AuthProvider, useAuth } from './components/Auth/AuthProvider';
import PrivateRoute from './components/Auth/PrivateRoute';
import SignUp from './components/Auth/SignUp';
import MemorizationDashboard from './components/Dashboard/MemorizationDashboard';
import PlanSubscription from './components/Plans/PlanSubscription';
import Login from './components/Auth/Login';
import NavBar from './components/Navigation';
const queryClient = new QueryClient();


function App() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTopbarVisible, setIsTopbarVisible] = useState(true);

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

  const handlePageClick = () => {
    // Only toggle topbar on mobile screens
    if (window.innerWidth <= 768 ) {
      setIsTopbarVisible(isTopbarVisible => !isTopbarVisible);
      
    }
  };
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
       <QuranProgressProvider>
       <AuthProvider >
      <Router>
        <div onClick={handlePageClick} className="min-h-screen">
            <NavBar />
          
          <div className="min-h-screen bg-gray-50 dark:bg-dark-50 pb-16">
            <header className="top-header bg-gradient-to-r from-green-500 to-green-700 dark:from-dark-100 dark:to-dark-200 text-white py-6 shadow-md">
              <div className="container mx-auto text-center">
                <h1 className="text-3xl font-bold">قارئ القرآن</h1>
              </div>
            </header>
            
            <main className="container mx-auto h-[100vh]">
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
                <Route path="/prayer-times" element={<PrayerTimesPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/quran-pages/:surahNumber"  element={<QuranPagesReader />} />

                <Route 
              path="/select-plan" 
              element={
                // <PrivateRoute>
                  <PlanSubscription />
                // </PrivateRoute>
              } 
            />
                <Route 
                  path="/dashboard" 
                  element={
                    // <PrivateRoute>
                      <MemorizationDashboard />
                    // </PrivateR/</main>oute>
                  } 
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
      </AuthProvider>
      </QuranProgressProvider>
    </QueryClientProvider>
  );
}

export default App;
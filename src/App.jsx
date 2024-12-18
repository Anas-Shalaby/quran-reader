import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { FaMoon, FaSun, FaChartBar } from 'react-icons/fa';
import HijriCalendarPage from './pages/HijriCalendar';

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
const queryClient = new QueryClient();

function NavBar() {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const navItems = [
    // { name: 'لوحة المتابعة', path: '/dashboard', icon: '📊' },
    // { name: 'اشتراك الخطة', path: '/select-plan', icon: '📝' },
    { name: 'القرآن الكريم', path: '/', icon: '📖' },
    { name: 'الأحاديث', path: '/hadiths', icon: '📜' },
    { name: 'البحث', path: '/search', icon: '🔍' },
    { name: 'التقويم الهجري', path: '/hijri-calendar', icon: '📅' },
    { name: 'مواقيت الصلاة', path: '/prayer-times', icon: '🕌' }
  ];

  return (
    <nav className="bg-white dark:bg-dark-200 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
             <Link to={'/'}>
             تطبيق تحفيظ القرآن</Link>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex ml-10 flex-grow justify-center items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-100 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <span className="ml-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Actions and Dark Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-dark-100 text-gray-800 dark:text-white"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            {user ? (
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                تسجيل الخروج
              </button>
            ) : (
              <div className="hidden md:flex space-x-2">
                {/* <Link
                  to="/login"
                  className="bg-green-500 m-3 dark:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-500 m-3 dark:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  إنشاء حساب
                </Link> */}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Navbar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-200 shadow-lg md:hidden z-50">
          <div className="flex justify-around items-center py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
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
       <QuranProgressProvider>
       <AuthProvider >
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
              <Route path="/prayer-times" element={<PrayerTimesPage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />

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

          <NavBar />
        </div>
      </Router>
      </AuthProvider>
      </QuranProgressProvider>
    </QueryClientProvider>
  );
}

export default App;

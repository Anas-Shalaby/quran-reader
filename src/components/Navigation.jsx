import { Link } from "react-router-dom";
import { useAuth } from "./Auth/AuthProvider";
import { useEffect, useState } from "react";

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
        <div className="app-topbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
  
  export default NavBar;
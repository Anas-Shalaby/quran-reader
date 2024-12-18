import React, { useState, useEffect } from 'react';
import { fetchPrayerTimes, getCurrentPrayerTime } from '../services/prayerTimesApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaRegMoon, FaSun, FaMosque } from 'react-icons/fa';

// Default location (Cairo, Egypt)
const DEFAULT_LOCATION = {
  latitude: 30.0444,
  longitude: 31.2357
};

const PrayerIcon = {
  Fajr: FaRegMoon,
  Sunrise: FaSun,
  Dhuhr: FaMosque,
  Asr: FaMosque,
  Maghrib: FaSun,
  Isha: FaRegMoon
};

const PrayerTimesPage = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const getPrayerTimes = async () => {
      try {
        // Format date as DD-MM-YYYY
        const today = new Date();
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

        // Try to get user's geolocation
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              setLocation(newLocation);
              await fetchAndSetPrayerTimes(formattedDate, newLocation);
            },
            () => {
              // Fallback to default location if geolocation fails
              fetchAndSetPrayerTimes(formattedDate, DEFAULT_LOCATION);
            }
          );
        } else {
          // Fallback to default location if geolocation not supported
          await fetchAndSetPrayerTimes(formattedDate, DEFAULT_LOCATION);
        }
      } catch (err) {
        setError('Unable to fetch prayer times');
        setIsLoading(false);
      }
    };

    const fetchAndSetPrayerTimes = async (date, locationToUse) => {
      try {
        const times =  fetchPrayerTimes(
          date,
          locationToUse.latitude,
          locationToUse.longitude
        );

        setPrayerTimes(times);
        setCurrentPrayer(getCurrentPrayerTime(times));
        setIsLoading(false);
      } catch (err) {
        setError('Unable to fetch prayer times');
        setIsLoading(false);
      }
    };

    getPrayerTimes();
    
    // Update current time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Refresh prayer times every hour
    const prayerInterval = setInterval(getPrayerTimes, 3600000);
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(prayerInterval);
    };
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4 dark:text-red-300">{error}</div>;

  const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <div className="container mx-auto p-4  ">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">مواقيت الصلاة</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {currentTime.toLocaleDateString('ar-EG', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-xl font-semibold text-green-600 dark:text-green-400 mt-2">
            {currentTime.toLocaleTimeString('ar-EG', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {prayerOrder.map((prayerName) => {
            const Icon = PrayerIcon[prayerName];
            const isCurrentPrayer = currentPrayer === prayerName;
            
            return (
              <div 
                key={prayerName}
                className={`
                  p-4 rounded-lg shadow-md transition-all duration-300 
                  ${isCurrentPrayer 
                    ? 'bg-green-100 border-2 border-green-500 dark:bg-green-900 dark:border-green-700' 
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`
                      text-lg font-semibold 
                      ${isCurrentPrayer 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-gray-700 dark:text-gray-200'}
                    `}>
                      {prayerName === 'Sunrise' ? 'الشروق' : 
                       prayerName === 'Fajr' ? 'الفجر' : 
                       prayerName === 'Dhuhr' ? 'الظهر' : 
                       prayerName === 'Asr' ? 'العصر' : 
                       prayerName === 'Maghrib' ? 'المغرب' : 
                       'العشاء'}
                    </h2>
                    <p className={`
                      text-sm 
                      ${isCurrentPrayer 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-gray-500 dark:text-gray-400'}
                    `}>
                      {prayerTimes[prayerName.toLowerCase()]}
                    </p>
                  </div>
                  <Icon 
                    className={`
                      w-8 h-8 
                      ${isCurrentPrayer 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-gray-400 dark:text-gray-500'}
                    `} 
                  />
                </div>
                {isCurrentPrayer && (
                  <div className="mt-2 text-center">
                    <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                      الوقت الحالي
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6 text-gray-600 dark:text-gray-300">
          <p>الموقع: {location === DEFAULT_LOCATION ? 'القاهرة، مصر (افتراضي)' : ' القاهرة'}</p>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesPage;
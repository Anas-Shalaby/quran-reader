import React, { useState, useEffect } from 'react';
import { HijriCalendar } from 'islam.js';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

// Arabic month names for Hijri calendar
const ARABIC_HIJRI_MONTHS = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

// Default location (Cairo, Egypt) as a fallback
const DEFAULT_LOCATION = {
  latitude: 30.0444,
  longitude: 31.2357
}
const HijriCalendarPage = () => {
  const [hijriDate, setHijriDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHijriDate = async () => {
    try {
      // Format the current date as DD-MM-YYYY for the API
      const formattedDate = currentDate.toLocaleDateString('en-GB').replace(/\//g, '-');
      
      const response = await axios.get(`https://api.aladhan.com/v1/gToH/${formattedDate}`);
      
      const hijriData = response.data.data.hijri;
      
      setHijriDate({
        day: hijriData.day,
        month: {
          ar: hijriData.month.ar,
          en: hijriData.month.en
        },
        year: hijriData.year,
        weekdayName: hijriData.weekday.ar
      });
      
      setIsLoading(false);
    } catch (err) {
      console.error('Hijri date fetch error:', err);
      setError('تعذر جلب التاريخ الهجري');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHijriDate();
  }, []);
  

  // Error handling with Arabic text
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">عذراً! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  // Localized date formatting in Arabic
  const formatGregorianDate = (date) => {
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 mt-20">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-100 rounded-xl shadow-md p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2 text-right">
              التاريخ الميلادي
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-right">
              {formatGregorianDate(currentDate)}
            </p>
          </div>

          {hijriDate && (
            <div>
              <h2 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2 text-right">
                التاريخ الهجري
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-right">
                {hijriDate.day} {hijriDate.month.ar} {hijriDate.year}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-right">
                {hijriDate.weekdayName}
              </p>
            </div>
          )}

          {location && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
              الموقع: {location.latitude.toFixed(2)}°N، {location.longitude.toFixed(2)}°E
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HijriCalendarPage;
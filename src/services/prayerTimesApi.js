import axios from 'axios';
import { PrayerTimes, Coordinates, CalculationMethod } from 'adhan';

// IP Geolocation API
const IP_GEOLOCATION_API = 'https://ipapi.co/json/';

export const fetchPrayerTimes = (dateString, latitude, longitude) => {
  try {
    // Parse the date string
    const [day, month, year] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed

    // Create coordinates
    const coordinates = new Coordinates(latitude, longitude);
    
    // Use Egypt calculation method (corrected)
    const params = CalculationMethod.Egyptian();
    
    // Create prayer times for the given date and location
    const prayerTimes = new PrayerTimes(coordinates, date, params);
    
    // Format times to match previous implementation
    return {
      fajr: formatTime(prayerTimes.fajr),
      sunrise: formatTime(prayerTimes.sunrise),
      dhuhr: formatTime(prayerTimes.dhuhr),
      asr: formatTime(prayerTimes.asr),
      maghrib: formatTime(prayerTimes.maghrib),
      isha: formatTime(prayerTimes.isha)
    };
  } catch (error) {
    console.error('Error calculating prayer times:', error);
    throw error;
  }
};

// Helper function to format time
const formatTime = (time) => {
  if (!time) return '';
  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false
  });
  return formattedTime;
};

export const getCurrentPrayerTime = (prayerTimes) => {
  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

  const prayerTimeMap = {
    'Fajr': prayerTimes.fajr,
    'Sunrise': prayerTimes.sunrise,
    'Dhuhr': prayerTimes.dhuhr,
    'Asr': prayerTimes.asr,
    'Maghrib': prayerTimes.maghrib,
    'Isha': prayerTimes.isha
  };

  for (const [prayerName, prayerTime] of Object.entries(prayerTimeMap)) {
    if (currentTime <= prayerTime) {
      return prayerName;
    }
  }

  // If current time is after all prayers, return the last prayer (Isha)
  return 'Isha';
};

export const getLocationByIP = async () => {
  try {
    const response = await axios.get(IP_GEOLOCATION_API);
    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      city: response.data.city,
      country: response.data.country_name
    };
  } catch (error) {
    console.error('Error fetching location by IP:', error);
    return null;
  }
};
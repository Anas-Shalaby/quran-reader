import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import MemorizationService from '../../services/memorizationService';
import NotificationService from '../../services/notificationService';
import toast from 'react-hot-toast';
import { FaQuran, FaCheckCircle, FaTimesCircle, FaChartLine } from 'react-icons/fa';
import Confetti from 'react-confetti';
import DailyTasksBoard from './DailyTasksBoard';
import { getSurahName } from '../../services/memorizationService';

const ProgressCard = ({ title, value, icon, color }) => (
  <div className={`bg-white dark:bg-dark-200 shadow-md rounded-lg p-6 flex items-center ${color}`}>
    <div className="mr-4 text-3xl">{icon}</div>
    <div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-white">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  </div>
);

const MemorizationDashboard = () => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState({
    completedVerses: 0,
    lastSurah: '',
    lastAyah: 0,
    lastMemorizedLocation: {
      surah: '',
      ayah: 0
    }
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyVerses, setDailyVerses] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const fetchProgressAndNotifications = useCallback(async () => {
    if (!user) {
      setError('المستخدم غير مسجل');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const progressReport = await MemorizationService.generateProgressReport(user.uid);
      const pendingNotifications = await NotificationService.getPendingNotifications(user.uid);
      
      setUserProgress({
        completedVerses: progressReport.totalCompletedVerses || 0,
        lastSurah: progressReport.lastMemorizedLocation?.surah || '',
        lastAyah: progressReport.lastMemorizedLocation?.ayah || 0,
        lastMemorizedLocation: progressReport.lastMemorizedLocation || {
          surah: '',
          ayah: 0
        }
      });
      setNotifications(pendingNotifications || []);
    } catch (fetchError) {
      console.error('Dashboard fetch error', fetchError);
      setError('حدث خطأ أثناء جلب البيانات');
      toast.error('تعذر تحميل بيانات التقدم', {
        style: {
          direction: 'rtl',
          background: '#ff4b4b',
          color: '#fff'
        }
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgressAndNotifications();

    const handleDashboardUpdate = (event) => {
      const { lastSurah, lastAyah, completedVerses } = event.detail;
      setUserProgress(prev => ({
        ...prev,
        lastSurah,
        lastAyah,
        completedVerses
      }));
    };

    window.addEventListener('dashboard-update', handleDashboardUpdate);

    return () => {
      window.removeEventListener('dashboard-update', handleDashboardUpdate);
    };
  }, [fetchProgressAndNotifications]);

  const handleLogProgress = async () => {
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً', {
        style: {
          direction: 'rtl',
          background: '#ff4b4b',
          color: '#fff'
        }
      });
      return;
    }

    if (dailyVerses <= 0) {
      toast.error('الرجاء إدخال عدد الآيات الصحيح', {
        style: {
          direction: 'rtl',
          background: '#ff4b4b',
          color: '#fff'
        }
      });
      return;
    }

    try {
      const progressData = {
        completedVerses: dailyVerses,
        dailyGoalMet: true,
        lastSurah: userProgress.lastMemorizedLocation?.surah || '',
        lastAyah: userProgress.lastMemorizedLocation?.ayah || ''
      };

      const updatedProgress = await MemorizationService.logDailyProgress(user.uid, progressData);
      
      // Trigger confetti for achievement
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      // Refresh progress
      await fetchProgressAndNotifications();

      // Reset daily verses input
      setDailyVerses(0);

      toast.success('تم تسجيل التقدم بنجاح', {
        style: {
          direction: 'rtl',
          background: '#4bb543',
          color: '#fff'
        },
        icon: '🎉'
      });
    } catch (error) {
      console.error('Progress logging error', error);
      toast.error('تعذر تسجيل التقدم', {
        style: {
          direction: 'rtl',
          background: '#ff4b4b',
          color: '#fff'
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100">
        <div className="text-center">
          <h2 className="text-2xl text-red-600 mb-4">{error}</h2>
          <button 
            onClick={fetchProgressAndNotifications}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const progressCards = [
    {
      title: 'آخر سورة محفوظة',
      value: userProgress.lastSurah ? getSurahName(userProgress.lastSurah) : 'لم يتم الحفظ بعد',
      icon: <FaQuran />,
      color: 'text-green-500'
    },
    {
      title: 'آخر آية محفوظة',
      value: userProgress.lastAyah > 0 ? `الآية ${userProgress.lastAyah}` : 'لم يتم الحفظ بعد',
      icon: <FaChartLine />,
      color: 'text-blue-500'
    },
    {
      title: 'الآيات المحفوظة',
      value: `${userProgress.completedVerses} آية`,
      icon: <FaCheckCircle />,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="container mx-auto p-6 text-right">
        <div className='mb-10'>
          <DailyTasksBoard />
        </div>
      {showConfetti && <Confetti />}
      
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        لوحة متابعة حفظ القرآن
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {progressCards.map((card, index) => (
          <ProgressCard 
            key={index}
            title={card.title} 
            value={card.value} 
            icon={card.icon} 
            color={card.color} 
          />
        ))}
      </div>

      <div className="bg-white dark:bg-dark-200 shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">
          تسجيل التقدم اليومي
        </h2>
        <div className="flex items-center space-x-4">
          <input 
            type="number" 
            placeholder="عدد الآيات المحفوظة اليوم" 
            value={dailyVerses}
            onChange={(e) => setDailyVerses(parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded mb-4 dark:bg-dark-100 dark:text-white"
          />
          <button
            onClick={handleLogProgress}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600 transition-colors"
          >
            تسجيل
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-200 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">
          التنبيهات
        </h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">
            لا توجد تنبيهات حالياً
          </p>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className="mb-4 p-4 bg-gray-100 dark:bg-dark-100 rounded flex items-center justify-between"
            >
              <div>
                <p className="dark:text-white">{notification.message}</p>
                <small className="text-gray-500 dark:text-gray-300">
                  {notification.createdAt?.toDate()?.toLocaleString()}
                </small>
              </div>
              <button 
                onClick={() => {/* Handle notification action */}}
                className="text-blue-500 hover:text-blue-700"
              >
                عرض التفاصيل
              </button>
            </div>
          ))
        )}
      </div>
      
    </div>
  );
};

export default MemorizationDashboard;
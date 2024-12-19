import React, { useState, useEffect } from 'react';
import { FaQuran, FaBook, FaCheckCircle, FaRegCheckCircle } from 'react-icons/fa';
import { useAuth } from '../Auth/AuthProvider';
import MemorizationService from '../../services/memorizationService';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';

const DailyTasksBoard = () => {
  const { user } = useAuth();
  const [dailyTasks, setDailyTasks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchDailyTasks = async () => {
      if (!user) {
        setError('المستخدم غير مسجل');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const tasks = await MemorizationService.fetchDailyTasks(user.uid);
        setDailyTasks(tasks);
      } catch (fetchError) {
        console.error('Error fetching daily tasks', fetchError);
        setError('تعذر تحميل المهام اليومية');
        toast.error('حدث خطأ أثناء جلب المهام', {
          style: {
            direction: 'rtl',
            background: '#ff4b4b',
            color: '#fff'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDailyTasks();
  }, [user]);

  const handleTaskCompletion = async (taskId) => {
    if (!dailyTasks) return;

    const task = dailyTasks[taskId];
    
    try {
      // Log progress for the specific task
      await MemorizationService.logDailyProgress(user.uid, {
        completedVerses: task.verseCount,
        dailyGoalMet: true,
        taskType: taskId,
        surah: task.surah,
        startAyah: task.startAyah,
        endAyah: task.endAyah,
      });

      // Update tasks state
      setDailyTasks(prev => ({
        ...prev,
        [taskId]: { ...prev[taskId], completed: true }
      }));

      // Show celebration
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      toast.success(`أحسنت! لقد أكملت مهمة ${task.title}`, {
        style: {
          direction: 'rtl',
          background: '#4bb543',
          color: '#fff'
        },
        icon: '🎉'
      });
    } catch (error) {
      console.error('Error logging task completion', error);
      toast.error('حدث خطأ أثناء تسجيل الإنجاز', {
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
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-lg text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  console.log(dailyTasks)
  return (
    <div className="bg-white dark:bg-dark-200 shadow-lg rounded-lg p-6">
      {showConfetti && <Confetti />}
      
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        مهام اليوم
      </h2>

      <div className="space-y-4">
        {Object.entries(dailyTasks || {}).map(([taskId, task]) => (
          <div 
            key={taskId}
            className={`
              flex items-center justify-between p-4 rounded-lg transition-all duration-300
              ${task.completed 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-gray-100 dark:bg-dark-100 hover:bg-gray-200 dark:hover:bg-dark-50'}
            `}
          >
            <div className="flex items-center space-x-4">
              <div className={`text-3xl ${task.completed ? 'text-green-600' : 'text-gray-500 dark:text-gray-300'}`}>
                {task.icon}
              </div>
              <div>
                <h3 className={`
                  text-lg font-semibold 
                  ${task.completed ? 'text-green-800 dark:text-green-300' : 'text-gray-800 dark:text-white'}
                `}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {task.description}
                </p>
              </div>
            </div>
            <button 
              onClick={() => handleTaskCompletion(taskId)}
              disabled={task.completed}
              className={`
                p-2 rounded-full transition-all duration-300
                ${task.completed 
                  ? 'text-green-600 cursor-not-allowed' 
                  : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-dark-50'}
              `}
            >
              {task.completed ? <FaCheckCircle size={24} /> : <FaRegCheckCircle size={24} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyTasksBoard;
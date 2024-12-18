import { db, auth } from './firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  increment,
  arrayUnion
} from 'firebase/firestore';

const SURAH_NAMES = {
  1: 'الفاتحة',
  2: 'البقرة',
  3: 'آل عمران',
  4: 'النساء',
  5: 'المائدة',
  6: 'الأنعام',
  7: 'الأعراف',
  8: 'الأنفال',
  9: 'التوبة',
  10: 'يونس',
  11: 'هود',
  12: 'يوسف',
  13: 'الرعد',
  14: 'إبراهيم',
  15: 'الحجر',
  16: 'النحل',
  17: 'الإسراء',
  18: 'الكهف',
  19: 'مريم',
  20: 'طه',
  21: 'الأنبياء',
  22: 'الحج',
  23: 'المؤمنون',
  24: 'النور',
  25: 'الفرقان',
  26: 'الشعراء',
  27: 'النمل',
  28: 'القصص',
  29: 'العنكبوت',
  30: 'الروم',
  31: 'لقمان',
  32: 'السجدة',
  33: 'الأحزاب',
  34: 'سبأ',
  35: 'فاطر',
  36: 'يس',
  37: 'الصافات',
  38: 'ص',
  39: 'الزمر',
  40: 'غافر',
  41: 'فصلت',
  42: 'الشورى',
  43: 'الزخرف',
  44: 'الدخان',
  45: 'الجاثية',
  46: 'الأحقاف',
  47: 'محمد',
  48: 'الفتح',
  49: 'الحجرات',
  50: 'ق',
  51: 'الذاريات',
  52: 'الطور',
  53: 'النجم',
  54: 'القمر',
  55: 'الرحمن',
  56: 'الواقعة',
  57: 'الحديد',
  58: 'المجادلة',
  59: 'الحشر',
  60: 'الممتحنة',
  61: 'الصف',
  62: 'الجمعة',
  63: 'المنافقون',
  64: 'التغابن',
  65: 'الطلاق',
  66: 'التحريم',
  67: 'الملك',
  68: 'القلم',
  69: 'الحاقة',
  70: 'المعارج',
  71: 'نوح',
  72: 'الجن',
  73: 'المزمل',
  74: 'المدثر',
  75: 'القيامة',
  76: 'الإنسان',
  77: 'المرسلات',
  78: 'النبأ',
  79: 'النازعات',
  80: 'عبس',
  81: 'التكوير',
  82: 'الانفطار',
  83: 'المطففين',
  84: 'الانشقاق',
  85: 'البروج',
  86: 'الطارق',
  87: 'الأعلى',
  88: 'الغاشية',
  89: 'الفجر',
  90: 'البلد',
  91: 'الشمس',
  92: 'الليل',
  93: 'الضحى',
  94: 'الشرح',
  95: 'التين',
  96: 'العلق',
  97: 'القدر',
  98: 'البينة',
  99: 'الزلزلة',
  100: 'العاديات',
  101: 'القارعة',
  102: 'التكاثر',
  103: 'العصر',
  104: 'الهمزة',
  105: 'الفيل',
  106: 'قريش',
  107: 'الماعون',
  108: 'الكوثر',
  109: 'الكافرون',
  110: 'النصر',
  111: 'المسد',
  112: 'الإخلاص',
  113: 'الفلق',
  114: 'الناس'
};

class MemorizationService {
  // Create a new memorization plan for a user
  async createUserPlan(userId, planId) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        planId,
        startDate: new Date().toISOString(),
        progress: {
          completedVerses: 0,
          lastSurah: 1,
          lastAyah: 0,
          lastUpdated: new Date()
        },
        failures: {},
        notificationsEnabled: true
      }, { merge: true });

      return userRef;
    } catch (error) {
      console.error('Error creating user plan:', error);
      throw error;
    }
  }

  // Safely update user progress
  async logDailyProgress(userId, progressData) {
    try {
      const userRef = doc(db, 'users', userId);
      
      // Ensure all fields are defined and have default values
      const safeProgressData = {
        completedVerses: progressData.completedVerses || 0,
        dailyGoalMet: progressData.dailyGoalMet || false,
        surah: progressData.surah || progressData.lastSurah || '',
        lastAyah: progressData.endAyah || progressData.lastAyah || 0,
        startAyah: progressData.startAyah || 0,
        timestamp: new Date()
      };

      // Prepare the update object with nested progress tracking
      const updateObject = {
        'progress.completedVerses': increment(safeProgressData.completedVerses),
        'progress.dailyGoalMet': safeProgressData.dailyGoalMet,
        'progress.lastSurah': safeProgressData.surah,
        'progress.lastAyah': safeProgressData.lastAyah,
        'progress.lastMemorizedLocation': {
          surah: safeProgressData.surah,
          ayah: safeProgressData.lastAyah
        },
        'progress.lastUpdated': safeProgressData.timestamp,
        'progress.completedTasks': arrayUnion({
          type: progressData.taskType || 'memorization',
          verses: safeProgressData.completedVerses,
          surah: safeProgressData.surah,
          date: safeProgressData.timestamp,
          dailyGoalMet: safeProgressData.dailyGoalMet
        })
      };

      // Update progress tracking
      await updateDoc(userRef, updateObject);

      // Trigger a real-time update for the dashboard
      const dashboardUpdateEvent = new CustomEvent('dashboard-update', { 
        detail: {
          lastSurah: safeProgressData.surah,
          lastAyah: safeProgressData.lastAyah,
          completedVerses: safeProgressData.completedVerses,
          lastMemorizedLocation: {
            surah: safeProgressData.surah,
            ayah: safeProgressData.lastAyah
          }
        }
      });
      window.dispatchEvent(dashboardUpdateEvent);

      return safeProgressData;
    } catch (error) {
      console.error('Error logging daily progress:', error);
      throw error;
    }
  }

  // Log a failure for a specific date
  async logFailure(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        [`failures.${today}`]: true
      });
    } catch (error) {
      console.error('Error logging failure:', error);
      throw error;
    }
  }

  // Track and adjust plan based on failures
  async trackFailures(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data();
      
      if (!userData) {
        throw new Error('User not found');
      }

      const planRef = doc(db, 'plans', userData.planId);
      const planSnapshot = await getDoc(planRef);
      const planData = planSnapshot.data();

      if (!planData) {
        throw new Error('Plan not found');
      }

      // Count failures in the last week
      const failures = userData.failures || {};
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const weekFailures = Object.keys(failures).filter(
        date => new Date(date) >= oneWeekAgo
      ).length;

      // Adjust plan if failures exceed tolerance
      if (weekFailures > planData.failureTolerance) {
        await this.adjustMemorizationPlan(userId, userData.planId);
      }
    } catch (error) {
      console.error('Error tracking failures:', error);
      throw error;
    }
  }

  // Dynamically adjust memorization plan
  async adjustMemorizationPlan(userId, planId) {
    try {
      const userRef = doc(db, 'users', userId);
      const planRef = doc(db, 'plans', planId);

      // Reduce daily verses or adjust difficulty
      const planSnapshot = await getDoc(planRef);
      const currentPlan = planSnapshot.data();

      // Example adjustment: reduce daily verses by 20%
      const adjustedDailySchedule = currentPlan.dailySchedule.map(day => ({
        ...day,
        endAyah: Math.floor(day.endAyah * 0.8)
      }));

      // Update plan with reduced verses
      await updateDoc(planRef, {
        dailySchedule: adjustedDailySchedule,
        lastAdjusted: serverTimestamp()
      });

      // Notify user about plan adjustment
      await updateDoc(userRef, {
        planAdjustmentNotice: 'Your memorization plan has been adjusted to help you succeed.'
      });
    } catch (error) {
      console.error('Error adjusting memorization plan:', error);
      throw error;
    }
  }

  // Generate progress report with robust error handling
  async generateProgressReport(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      if (!userData) {
        throw new Error('User not found');
      }

      // If no progress exists, initialize it
      if (!userData.progress) {
        await updateDoc(userRef, {
          progress: {
            completedVerses: 0,
            lastSurah: '',
            lastAyah: 0,
            lastMemorizedLocation: {
              surah: '',
              ayah: 0
            },
            dailyGoalMet: false,
            completedTasks: []
          }
        });

        // Refetch the updated document
        const updatedDoc = await getDoc(userRef);
        const updatedUserData = updatedDoc.data();

        return {
          totalCompletedVerses: 0,
          lastMemorizedLocation: {
            surah: '',
            ayah: 0
          },
          failureRate: 0
        };
      }

      // Calculate failure rate (placeholder logic, adjust as needed)
      const completedTasks = userData.progress.completedTasks || [];
      const failedTasks = completedTasks.filter(task => !task.dailyGoalMet).length;
      const failureRate = completedTasks.length > 0 
        ? (failedTasks / completedTasks.length) * 100 
        : 0;

      return {
        totalCompletedVerses: userData.progress.completedVerses || 0,
        lastMemorizedLocation: {
          surah: userData.progress.lastSurah || '',
          ayah: userData.progress.lastAyah || 0
        },
        failureRate: failureRate
      };
    } catch (error) {
      console.error('Error generating progress report:', error);
      throw error;
    }
  }

  // Calculate failure rate
  calculateFailureRate(failures = []) {
    if (!failures || failures.length === 0) return 0;
    
    const totalAttempts = failures.length;
    const failedAttempts = failures.filter(f => !f.success).length;
    
    return (failedAttempts / totalAttempts) * 100;
  }

  // Fetch daily tasks for the user
  async fetchDailyTasks(userId) {
    try {
      // First, get the user's current plan
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();

      if (!userData || !userData.planId) {
        throw new Error('No active plan found');
      }

      // Fetch the plan details
      const planDoc = await getDoc(doc(db, 'plans', userData.planId));
      const planData = planDoc.data();

      if (!planData || !planData.dailySchedule) {
        throw new Error('No daily schedule found for this plan');
      }

      // Determine the current day based on start date
      let startDate;
      if (userData.subscribedAt) {
        // Try parsing different date formats
        startDate = typeof userData.subscribedAt === 'string' 
          ? new Date(userData.subscribedAt) 
          : userData.subscribedAt.toDate();
      } else if (userData.startDate) {
        // Fallback to startDate if subscribedAt is not available
        startDate = typeof userData.startDate === 'string' 
          ? new Date(userData.startDate) 
          : userData.startDate.toDate();
      } else {
        // If no date is found, use current date
        startDate = new Date();
      }

      // Validate startDate
      if (isNaN(startDate.getTime())) {
        console.error('Invalid start date', userData);
        throw new Error('Invalid subscription date');
      }

      const today = new Date();
      const daysSinceStart = Math.max(1, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1);

      // Get today's task
      const todayTask = planData.dailySchedule.find(
        day => day.day === `day${daysSinceStart}` || 
               day.day === daysSinceStart.toString() ||
               parseInt(day.day) === daysSinceStart
      );

      if (!todayTask) {
        console.warn(`No task found for day ${daysSinceStart}`, planData.dailySchedule);
        throw new Error('No task found for today');
      }

      // Transform the task into a more user-friendly format
      const surahName = SURAH_NAMES[todayTask.startSurah] || `سورة رقم ${todayTask.startSurah}`;

      return {
        memorization: {
          id: 'memorization',
          icon: '📖',
          title: 'حفظ آيات جديدة',
          description: `احفظ آيات من سورة ${surahName} من آية ${todayTask.startAyah} إلى ${todayTask.endAyah}`,
          completed: false,
          verseCount: todayTask.endAyah - todayTask.startAyah + 1,
          surah: surahName,
          startAyah: todayTask.startAyah,
          endAyah: todayTask.endAyah
        },
        revision: {
          id: 'revision',
          icon: '🔁',
          title: 'مراجعة المحفوظ',
          description: 'راجع الآيات التي حفظتها في الأيام الماضية',
          completed: false,
          verseCount: 10 // Default revision verses
        }
      };
    } catch (error) {
      console.error('Error fetching daily tasks:', error);
      
      // Return a default task set if fetching fails
      return {
        memorization: {
          id: 'memorization',
          icon: '📖',
          title: 'حفظ آيات جديدة',
          description: 'لم يتم العثور على مهمة اليوم',
          completed: false,
          verseCount: 0,
          surah: '',
          startAyah: 0,
          endAyah: 0
        },
        revision: {
          id: 'revision',
          icon: '🔁',
          title: 'مراجعة المحفوظ',
          description: 'لم يتم العثور على مهمة المراجعة',
          completed: false,
          verseCount: 0
        }
      };
    }
  }
}

export default new MemorizationService();

export const getSurahName = (surahNumber) => SURAH_NAMES[surahNumber] || `سورة رقم ${surahNumber}`;
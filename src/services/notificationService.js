// src/services/notificationService.js
import { db, auth } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';

class NotificationService {
  // Send a reminder notification to a user
  async sendReminder(userId, reminderDetails) {
    const notificationRef = await addDoc(collection(db, 'notifications'), {
      userId,
      type: 'memorization_reminder',
      ...reminderDetails,
      createdAt: new Date(),
      status: 'pending'
    });

    return notificationRef.id;
  }

  // Update user's notification preferences
  async updateNotificationPreferences(userId, preferences) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      notificationsEnabled: preferences.enabled,
      notificationChannels: preferences.channels || ['email', 'push']
    });
  }

  // Fetch pending notifications for a user
  async getPendingNotifications(userId) {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('status', '==', 'pending')
    );

    const notificationSnapshot = await getDocs(notificationsQuery);
    return notificationSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  // Mark a notification as read/processed
  async markNotificationAsRead(notificationId) {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      status: 'read',
      readAt: new Date()
    });
  }

  // Send daily progress reminder
  async sendDailyProgressReminder(userId) {
    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();

    if (userData.notificationsEnabled) {
      await this.sendReminder(userId, {
        title: 'Daily Quran Memorization Reminder',
        message: `You haven't logged your progress today. Let's continue your memorization journey!`,
        priority: 'high'
      });
    }
  }

  // Send motivational messages based on progress
  async sendMotivationalMessage(userId) {
    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();

    let message = '';
    if (userData.progress.completedVerses < 50) {
      message = 'Keep going! Every verse you memorize brings you closer to your goal.';
    } else if (userData.progress.completedVerses < 200) {
      message = 'Wow! You\'re making great progress. Stay consistent!';
    } else {
      message = 'You\'re an inspiration! Your dedication to memorizing the Quran is remarkable.';
    }

    await this.sendReminder(userId, {
      title: 'Motivational Message',
      message,
      type: 'motivation'
    });
  }
}

export default new NotificationService();
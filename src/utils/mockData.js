import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Dynamically resolve the path to service account key
const serviceAccountPath = path.resolve(__dirname, '../services/serviceAccountKey.json');

// Check if service account file exists
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Service account key not found. Please download from Firebase Console.');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK
const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

const mockPlans = {
  "planA": {
    "name": "Comprehensive Beginner Plan",
    "totalVerses": 6236,
    "dailySchedule": [
      { 
        "day": 1, 
        "startSurah": 1, 
        "startAyah": 1, 
        "endSurah": 2, 
        "endAyah": 5 
      },
      { 
        "day": 2, 
        "startSurah": 2, 
        "startAyah": 6, 
        "endSurah": 2, 
        "endAyah": 20 
      }
    ],
    "failureTolerance": 3,
    "notifications": true,
    "difficulty": "beginner",
    "createdAt": new Date()
  },
  "planB": {
    "name": "Intermediate Memorization Plan",
    "totalVerses": 6236,
    "dailySchedule": [
      { 
        "day": 1, 
        "startSurah": 30, 
        "startAyah": 1, 
        "endSurah": 30, 
        "endAyah": 10 
      },
      { 
        "day": 2, 
        "startSurah": 30, 
        "startAyah": 11, 
        "endSurah": 30, 
        "endAyah": 20 
      }
    ],
    "failureTolerance": 2,
    "notifications": true,
    "difficulty": "intermediate",
    "createdAt": new Date()
  }
};

const mockUsers = {
  "user1": {
    "name": "Ahmed Mohammed",
    "email": "ahmed@example.com",
    "planId": "planA",
    "startDate": "2024-01-01",
    "progress": {
      "completedVerses": 40,
      "lastSurah": 2,
      "lastAyah": 40
    },
    "failures": {
      "2024-01-03": true,
      "2024-01-05": true
    },
    "notificationsEnabled": true,
    "createdAt": new Date()
  },
  "user2": {
    "name": "Fatima Ali",
    "email": "fatima@example.com", 
    "planId": "planB",
    "startDate": "2024-02-15",
    "progress": {
      "completedVerses": 20,
      "lastSurah": 30,
      "lastAyah": 15
    },
    "failures": {
      "2024-02-20": true
    },
    "notificationsEnabled": true,
    "createdAt": new Date()
  }
};

async function uploadMockData() {
  try {
    // Batch write for better performance
    const batch = db.batch();

    // Upload Plans
    const plansRef = db.collection('plans');
    Object.entries(mockPlans).forEach(([planId, planData]) => {
      const docRef = plansRef.doc(planId);
      batch.set(docRef, planData);
    });

    // Upload Users
    const usersRef = db.collection('users');
    Object.entries(mockUsers).forEach(([userId, userData]) => {
      const docRef = usersRef.doc(userId);
      batch.set(docRef, userData);
    });

    // Commit the batch
    await batch.commit();
    console.log('Mock data upload complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error uploading mock data:', error);
    process.exit(1);
  }
}

// Run the upload immediately when the script is executed
uploadMockData();
// src/components/Auth/AuthProvider.jsx
import React, { createContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, db } from '../../services/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState(null);

  // Check if user has a subscribed plan
  const checkUserPlan = async (user) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.planId) {
          setUserPlan(userData.planId);
          return userData.planId;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error checking user plan:', error);
      return null;
    }
  };

  // Modify existing authentication methods to include plan check
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const plan = await checkUserPlan(user);
      if (!plan) {
        // Redirect to plan selection if no plan is subscribed
        return { user, needsPlanSelection: true };
      }
      
      return { user, needsPlanSelection: false };
    } catch (error) {
      console.error('Sign In Error', error);
      throw error;
    }
  };

  const signUp = async (email, password, additionalInfo = {}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
        ...additionalInfo
      });

      return { user, needsPlanSelection: true };
    } catch (error) {
      console.error('Sign Up Error', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserPlan(null);
      // Optional: Redirect to login page or home page
      // navigate('/login');
    } catch (error) {
      console.error('Logout Error', error);
    }
  };

  // Existing code for authentication state changes...
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const plan = await checkUserPlan(currentUser);
        setUserPlan(plan);
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userPlan,
    loading,
    signUp,
    signIn,
    logout,
    // signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
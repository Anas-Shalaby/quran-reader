import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../Auth/AuthProvider';
import { db } from '../../services/firebaseConfig';

const plans = [
  {
    id: 'plan_a',
    name: 'الخطة الأساسية',
    price: 'مجاني',
    features: [
      'تحفيظ آية يومية',
      'إرشادات أساسية في التجويد',
      'تتبع التقدم',
      'دعم مجتمعي'
    ],
    description: 'مثالي للمبتدئين في رحلة تحفيظ القرآن'
  },
  {
    id: 'plan_b',
    name: 'الخطة المتقدمة',
    price: '9.99 دولار / شهريًا',
    features: [
      'برنامج شامل للتحفيظ',
      'تدريب شخصي على التجويد',
      'تحليلات متقدمة للتقدم',
      'جلسات إرشادية فردية',
      'موارد تدريب غير محدودة'
    ],
    description: 'سرّع رحلة تحفيظ القرآن مع إرشاد الخبراء'
  }
];

const PlanSubscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelection = async (planId) => {
    if (!user) {
      setError('الرجاء تسجيل الدخول أولاً');
      return;
    }

    try {
      // Update user's plan in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        planId: planId,
        subscribedAt: new Date()
      });

      // Show success toast
      toast.success('تم اشتراكك في الخطة بنجاح!', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          direction: 'rtl'
        },
        duration: 3000,
        position: 'top-center'
      });

      // Small delay to show toast before navigating
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      console.error('خطأ في اشتراك الخطة:', err);
      toast.error('فشل الاشتراك في الخطة. يرجى المحاولة مرة أخرى', {
        style: {
          borderRadius: '10px',
          background: '#ff4b4b',
          color: '#fff',
          direction: 'rtl'
        },
        duration: 3000,
        position: 'top-center'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Toast Notifications */}
      <Toaster />

      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            اختر خطة تحفيظ القرآن الخاصة بك
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            اختر الخطة التي تناسب مستواك وأهدافك في تحفيظ كتاب الله
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-center mb-6" role="alert">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`
                bg-white dark:bg-dark-200 rounded-2xl shadow-xl p-8 
                transform transition-all duration-300 cursor-pointer
                ${selectedPlan === plan.id 
                  ? 'scale-105 border-4 border-green-500 dark:border-green-600' 
                  : 'hover:scale-105 hover:shadow-2xl'}
                text-right
              `}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
                  {plan.price}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li 
                    key={index} 
                    className="flex items-center justify-end text-gray-700 dark:text-gray-200"
                  >
                    <span className="ml-2">{feature}</span>
                    <svg 
                      className="w-5 h-5 text-green-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelection(plan.id)}
                className={`
                  w-full py-3 rounded-lg text-white font-bold transition-colors duration-300
                  ${selectedPlan === plan.id 
                    ? 'bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800' 
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}
                `}
                disabled={selectedPlan !== plan.id}
              >
                {selectedPlan === plan.id ? 'اختيار الخطة' : 'اختر الخطة'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanSubscription;
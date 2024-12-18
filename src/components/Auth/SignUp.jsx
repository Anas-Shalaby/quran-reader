import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    try {
      const { user, needsPlanSelection } = await signUp(email, password);
      
      if (needsPlanSelection) {
        navigate('/select-plan');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-100 py-4 px-2 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            إنشاء حساب جديد
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            انضم إلى رحلة تحفيظ القرآن الكريم
          </p>
        </div>
        <form 
          className="space-y-4 bg-white dark:bg-dark-200 p-4 sm:p-8 rounded-xl shadow-md"
          onSubmit={handleSubmit}
          dir="rtl"
        >
          {error && (
            <div className="text-red-500 text-center mb-2 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <div>
              <label htmlFor="email" className="sr-only">البريد الإلكتروني</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-dark-200 dark:text-white"
                placeholder="البريد الإلكتروني"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">كلمة المرور</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-dark-200 dark:text-white"
                placeholder="كلمة المرور"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">تأكيد كلمة المرور</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-dark-200 dark:text-white"
                placeholder="تأكيد كلمة المرور"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-800 transition-colors"
            >
              إنشاء حساب
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              لديك حساب بالفعل؟{' '}
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="text-xs sm:text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
              >
                تسجيل الدخول
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
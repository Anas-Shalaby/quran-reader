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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            إنشاء حساب جديد
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            انضم إلى رحلة تحفيظ القرآن الكريم
          </p>
        </div>
        <form 
          className="mt-8 space-y-6 bg-white dark:bg-dark-200 p-8 rounded-xl shadow-md"
          onSubmit={handleSubmit}
          dir="rtl"
        >
          {error && (
            <div className="text-red-500 text-center mb-4">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">البريد الإلكتروني</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-dark-200"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-dark-200"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-dark-200"
                placeholder="تأكيد كلمة المرور"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-800"
            >
              إنشاء حساب
            </button>
          </div>

          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              لديك حساب بالفعل؟{' '}
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
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
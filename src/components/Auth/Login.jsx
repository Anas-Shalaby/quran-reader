import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { user, needsPlanSelection } = await signIn(email, password);
      
      if (needsPlanSelection) {
        navigate('/select-plan');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('خطأ في تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-100 py-4 px-2 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            تسجيل الدخول
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            أهلاً بك مجدداً في تطبيق تحفيظ القرآن
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
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-800 transition-colors"
            >
              تسجيل الدخول
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              ليس لديك حساب؟{' '}
              <button 
                type="button"
                onClick={() => navigate('/signup')}
                className="text-xs sm:text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
              >
                إنشاء حساب
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
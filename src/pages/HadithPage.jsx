// Import React and Hooks
import React, { useState, useEffect } from 'react';

// Import External Libraries
import { Hadith, HadithBook, HadithLangEnum } from 'islam.js';

// Import Icons
import { 
  FaCopy, 
  FaShareAlt, 
  FaTwitter, 
  FaWhatsapp, 
  FaTelegram, 
  FaFacebook 
} from 'react-icons/fa';

// Import Components
import LoadingSpinner from '../components/LoadingSpinner';

// Main Component
const HadithPage = () => {
  // State Management
  const [hadith, setHadith] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Lifecycle Methods
  useEffect(() => {
    fetchRandomBukhariHadith();
  }, []);

  // Fetch Methods
  const fetchRandomBukhariHadith = async () => {
    setIsLoading(true);
    try {
      const hadiths = new Hadith();
      
      // Get a random section from Bukhari
      const randomSection = Math.floor(Math.random() * 100) + 1;
      
      const section = await hadiths.getSection(
        HadithBook.Bukhari, 
        randomSection, 
        HadithLangEnum.Arabic
      );

      // Select a random hadith from the section
      const randomHadithIndex = Math.floor(Math.random() * section.hadiths.length);
      const randomHadith = section.hadiths[randomHadithIndex];

      setHadith({
        text: randomHadith.text,
        narrator: randomHadith.narrator,
        book: 'صحيح البخاري',
        section: section.name
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching hadith:', error);
      setIsLoading(false);
    }
  };

  // Interaction Methods
  const copyHadith = () => {
    if (hadith) {
      const hadithText = `${hadith.text}\nالكتاب: ${hadith.book}`;
      navigator.clipboard.writeText(hadithText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Social Media Sharing Methods
  const getSocialMediaShareLinks = () => {
    const shareText = `حديث نبوي شريف:\n\n"${hadith.text}"\nالكتاب: ${hadith.book}`;
    const encodedText = encodeURIComponent(shareText);

    return {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
      telegram: `https://t.me/share/url?url=&text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=&quote=${encodedText}`
    };
  };

  const openSocialMediaShare = (platform) => {
    const links = getSocialMediaShareLinks();
    window.open(links[platform], '_blank');
  };

  const ShareModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">
            مشاركة الحديث
          </h2>
          <button 
            onClick={() => setShowShareModal(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Social Media Share Buttons with more detailed styling */}
          <SocialMediaShareButton 
            platform="تويتر" 
            icon={FaTwitter} 
            bgColor="blue" 
            textColor="text-blue-600"
            onClick={() => openSocialMediaShare('twitter')} 
          />
          <SocialMediaShareButton 
            platform="واتساب" 
            icon={FaWhatsapp} 
            bgColor="green" 
            textColor="text-green-600"
            onClick={() => openSocialMediaShare('whatsapp')} 
          />
          <SocialMediaShareButton 
            platform="تيليجرام" 
            icon={FaTelegram} 
            bgColor="blue" 
            textColor="text-blue-400"
            onClick={() => openSocialMediaShare('telegram')} 
          />
          <SocialMediaShareButton 
            platform="فيسبوك" 
            icon={FaFacebook} 
            bgColor="indigo" 
            textColor="text-indigo-600"
            onClick={() => openSocialMediaShare('facebook')} 
          />
        </div>
      </div>
    </div>
  );
  

  // Modify SocialMediaShareButton for responsiveness
const SocialMediaShareButton = ({ platform, icon: Icon, bgColor, textColor, onClick }) => (
    <button 
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center 
        p-3 sm:p-4 space-y-2 
        bg-${bgColor}-50 dark:bg-${bgColor}-900 
        rounded-xl shadow-md 
        hover:bg-${bgColor}-100 dark:hover:bg-${bgColor}-800 
        transition-all duration-300 
        transform hover:-translate-y-1
      `}
    >
      <Icon className={`text-2xl sm:text-3xl ${textColor} dark:text-white`} />
      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
        {platform}
      </span>
    </button>
  );

  // Main Render
  // Main Render
return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white dark:bg-dark-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* Decorative Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-700 p-4 sm:p-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
            أحاديث شريفة
          </h1>
          <p className="text-sm sm:text-base text-white/80 mt-2">
            استمتع بحكمة من أحاديث الرسول ﷺ
          </p>
        </div>
  
        {/* Hadith Content Area */}
        <div className="p-4 sm:p-6 space-y-6">
          {hadith && (
            <div className="bg-gray-50 dark:bg-dark-100 rounded-2xl p-4 sm:p-6 shadow-inner">
              {/* Hadith Text */}
              <blockquote className="relative text-right text-base sm:text-xl text-gray-800 dark:text-gray-200 leading-relaxed">
                <span className="absolute top-0 right-0 text-4xl sm:text-6xl text-green-200 dark:text-green-800 opacity-50">"</span>
                {hadith.text}
                <span className="absolute bottom-0 left-0 text-4xl sm:text-6xl text-green-200 dark:text-green-800 opacity-50">"</span>
              </blockquote>
  
              {/* Hadith Details */}
              <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  {/* Interaction Buttons */}
                  <div className="flex space-x-4 w-full sm:w-auto justify-center sm:justify-start">
                    <button 
                      onClick={copyHadith}
                      className={`
                        p-3 rounded-full transition-all duration-300
                        ${copied 
                          ? 'bg-green-500 text-white scale-110' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300'}
                      `}
                      title="نسخ الحديث"
                    >
                      <FaCopy className="w-5 h-5" />
                    </button>
  
                    <button 
                      onClick={() => setShowShareModal(true)}
                      className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 transition-all"
                      title="مشاركة الحديث"
                    >
                      <FaShareAlt className="w-5 h-5" />
                    </button>
                  </div>
  
                  {/* Hadith Source */}
                  <div className="text-center sm:text-left w-full sm:w-auto">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-bold">الكتاب:</span> {hadith.book}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
  
          {/* New Hadith Button */}
          <div className="text-center">
            <button 
              onClick={fetchRandomBukhariHadith}
              className="
                bg-green-500 text-white 
                px-4 sm:px-6 py-2 sm:py-3 rounded-full 
                hover:bg-green-600 
                transition-all duration-300 
                flex items-center justify-center 
                space-x-2 
                mx-auto 
                shadow-md 
                hover:shadow-lg
                text-sm sm:text-base
              "
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>حديث جديد</span>
            </button>
          </div>
        </div>
      </div>
  
      {/* Share Modal - Also Responsive */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-md transform transition-all">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300">
                مشاركة الحديث
              </h2>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Social Media Share Buttons */}
              <SocialMediaShareButton 
                platform="تويتر" 
                icon={FaTwitter} 
                bgColor="blue" 
                textColor="text-blue-600"
                onClick={() => openSocialMediaShare('twitter')} 
              />
              <SocialMediaShareButton 
                platform="واتساب" 
                icon={FaWhatsapp} 
                bgColor="green" 
                textColor="text-green-600"
                onClick={() => openSocialMediaShare('whatsapp')} 
              />
              <SocialMediaShareButton 
                platform="تيليجرام" 
                icon={FaTelegram} 
                bgColor="blue" 
                textColor="text-blue-400"
                onClick={() => openSocialMediaShare('telegram')} 
              />
              <SocialMediaShareButton 
                platform="فيسبوك" 
                icon={FaFacebook} 
                bgColor="indigo" 
                textColor="text-indigo-600"
                onClick={() => openSocialMediaShare('facebook')} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HadithPage;
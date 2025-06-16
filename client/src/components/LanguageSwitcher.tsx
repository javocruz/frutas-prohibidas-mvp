import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

export const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded ${
          language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('es')}
        className={`px-3 py-1 rounded ${
          language === 'es' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        ES
      </button>
    </div>
  );
};

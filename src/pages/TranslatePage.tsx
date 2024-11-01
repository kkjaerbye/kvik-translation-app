import React, { useState, useEffect } from 'react';
import TranslationCard from '../components/TranslationCard';
import { translateText } from '../services/translationService';
import { saveTranslation } from '../services/storageService';
import { languages } from '../constants/languages';

function TranslatePage() {
  const [inputText, setInputText] = useState('');
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeySet, setApiKeySet] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState(languages.map(lang => lang.code));
  const [hasTranslated, setHasTranslated] = useState(false);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_DEEPL_API_KEY;
    if (!apiKey) {
      setApiKeySet(false);
      setError('DeepL API key is not set. Please set a valid API key in your .env file.');
    }
  }, []);

  const handleTranslate = async () => {
    if (!inputText) return;
    if (!apiKeySet) {
      setError('DeepL API key is not set. Please set a valid API key in your .env file.');
      return;
    }

    setIsLoading(true);
    setError(null);
    const newTranslations: { [key: string]: string } = {};

    for (const lang of languages.filter(lang => selectedLanguages.includes(lang.code))) {
      try {
        const translatedText = await translateText(inputText, lang.name);
        newTranslations[lang.code] = translatedText;
      } catch (error) {
        console.error(`Error translating to ${lang.name}:`, error);
        newTranslations[lang.code] = 'Translation error';
        if (error instanceof Error) {
          setError(`Failed to translate: ${error.message}`);
        } else {
          setError(`Failed to translate to ${lang.name}. Please try again.`);
        }
        break;
      }
    }

    setTranslations(newTranslations);
    setIsLoading(false);
    setHasTranslated(true);

    // Save translations to local storage
    if (Object.keys(newTranslations).length > 0) {
      saveTranslation({
        originalText: inputText,
        translations: newTranslations,
        timestamp: new Date().toISOString()
      });
    }
  };

  const toggleLanguage = (code: string) => {
    setSelectedLanguages(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const toggleAllLanguages = () => {
    setSelectedLanguages(prev => 
      prev.length === languages.length ? [] : languages.map(lang => lang.code)
    );
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Multi-Language Translator</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Translate text into multiple languages instantly</p>
        </div>
        <div className="mt-8">
          <div className="mt-1 relative rounded-md shadow-sm">
            <textarea
              rows={4}
              className="form-textarea block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md transition duration-150 ease-in-out p-3 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter text to translate"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={toggleAllLanguages}
                className={`px-4 py-2 rounded-md text-sm font-medium shadow-sm ${
                  selectedLanguages.length === languages.length
                    ? 'bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                    : 'bg-white text-black dark:bg-gray-700 dark:text-white border border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-600'
                } transition-colors duration-200`}
              >
                All
              </button>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => toggleLanguage(lang.code)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedLanguages.includes(lang.code)
                      ? 'bg-gray-800 dark:bg-white text-white dark:text-black'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } transition-colors duration-200`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={handleTranslate}
              disabled={isLoading || !apiKeySet || selectedLanguages.length === 0 || inputText.trim() === ''}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                (isLoading || !apiKeySet || selectedLanguages.length === 0 || inputText.trim() === '') ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Translating...' : 'Translate'}
            </button>
          </div>
          {error && (
            <div className="mt-3 text-red-600 dark:text-red-400">
              {error}
              {!apiKeySet && (
                <p className="mt-2 text-sm">
                  To set up your API key:
                  <ol className="list-decimal list-inside mt-1">
                    <li>Create a .env file in the root of your project if it doesn't exist.</li>
                    <li>Add the following line to the .env file: VITE_DEEPL_API_KEY=your_actual_api_key_here</li>
                    <li>Replace 'your_actual_api_key_here' with your DeepL API key.</li>
                    <li>Restart the development server.</li>
                  </ol>
                </p>
              )}
            </div>
          )}
        </div>
        {hasTranslated && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {languages.filter(lang => selectedLanguages.includes(lang.code)).map((lang) => (
              <TranslationCard
                key={lang.code}
                language={lang.name}
                translatedText={translations[lang.code] || ''}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TranslatePage;
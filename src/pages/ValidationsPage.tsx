import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Translation } from '../types/translation';
import { getTranslations, updateTranslation, deleteTranslation } from '../services/storageService';
import TranslationItem from '../components/TranslationItem';
import TranslationFilters from '../components/TranslationFilters';

const ValidationsPage: React.FC = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<string>('all');
  const [editingTranslation, setEditingTranslation] = useState<{
    timestamp: number;
    language: string;
    text: string;
  } | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setTranslations(getTranslations());
  }, []);

  const highlightedId = searchParams.get('id');
  const highlightedLang = searchParams.get('lang');

  const handleStatusChange = (timestamp: number, language: string, status: 'approved' | 'rejected') => {
    const updatedTranslations = translations.map(translation => {
      if (translation.timestamp === timestamp) {
        return {
          ...translation,
          translations: {
            ...translation.translations,
            [language]: {
              ...translation.translations[language],
              status
            }
          }
        };
      }
      return translation;
    });
    setTranslations(updateTranslation(updatedTranslations));
  };

  const handleDelete = (timestamp: number) => {
    setTranslations(deleteTranslation(timestamp));
  };

  const handleEdit = (timestamp: number, language: string, text: string) => {
    setEditingTranslation({ timestamp, language, text });
  };

  const handleSaveEdit = () => {
    if (!editingTranslation) return;

    const updatedTranslations = translations.map(translation => {
      if (translation.timestamp === editingTranslation.timestamp) {
        return {
          ...translation,
          translations: {
            ...translation.translations,
            [editingTranslation.language]: {
              ...translation.translations[editingTranslation.language],
              text: editingTranslation.text
            }
          }
        };
      }
      return translation;
    });

    setTranslations(updateTranslation(updatedTranslations));
    setEditingTranslation(null);
  };

  const handleAddComment = (timestamp: number, language: string, commentText: string) => {
    const updatedTranslations = translations.map(translation => {
      if (translation.timestamp === timestamp) {
        return {
          ...translation,
          translations: {
            ...translation.translations,
            [language]: {
              ...translation.translations[language],
              comment: {
                text: commentText,
                timestamp: Date.now()
              }
            }
          }
        };
      }
      return translation;
    });

    setTranslations(updateTranslation(updatedTranslations));
  };

  const filteredTranslations = translations.filter(translation => {
    const matchesLanguage = selectedLanguages.length === 0 || 
      Object.keys(translation.translations).some(lang => selectedLanguages.includes(lang));

    let matchesTime = true;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    switch (timeRange) {
      case 'today':
        matchesTime = now - translation.timestamp < oneDay;
        break;
      case 'week':
        matchesTime = now - translation.timestamp < 7 * oneDay;
        break;
      case 'month':
        matchesTime = now - translation.timestamp < 30 * oneDay;
        break;
    }

    return matchesLanguage && matchesTime;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Translations Validation</h1>
            <Link
              to="/"
              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Back to Translate
            </Link>
          </div>

          <TranslationFilters
            timeRange={timeRange}
            selectedLanguages={selectedLanguages}
            onTimeRangeChange={setTimeRange}
            onLanguagesChange={setSelectedLanguages}
          />

          <ul className="space-y-6">
            {filteredTranslations.map((translation) => (
              <TranslationItem
                key={translation.timestamp}
                translation={translation}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onAddComment={handleAddComment}
                editingTranslation={editingTranslation}
                onSaveEdit={handleSaveEdit}
                isHighlighted={
                  highlightedId === translation.timestamp.toString() &&
                  (!highlightedLang || Object.keys(translation.translations).includes(highlightedLang))
                }
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValidationsPage;
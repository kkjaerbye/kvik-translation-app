export interface Translation {
  originalText: string;
  translations: {
    [key: string]: {
      text: string;
      status?: 'pending' | 'approved' | 'rejected';
      comment?: string;
      commentTimestamp?: number;
    };
  };
  timestamp: number;
}

const STORAGE_KEY = 'translations';

export const saveTranslation = (translation: {
  originalText: string;
  translations: { [key: string]: string };
  timestamp: string;
}): Translation[] => {
  const translations = getTranslations();
  const formattedTranslation: Translation = {
    originalText: translation.originalText,
    translations: Object.entries(translation.translations).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: { text: value, status: 'pending' }
    }), {}),
    timestamp: new Date(translation.timestamp).getTime()
  };
  translations.unshift(formattedTranslation);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(translations));
  return translations;
};

export const getTranslations = (): Translation[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const updateTranslation = (translations: Translation[]): Translation[] => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(translations));
  return translations;
};

export const deleteTranslation = (timestamp: number): Translation[] => {
  const translations = getTranslations();
  const updatedTranslations = translations.filter(t => t.timestamp !== timestamp);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTranslations));
  return updatedTranslations;
};
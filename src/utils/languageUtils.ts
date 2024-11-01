export const getLanguageFlag = (langCode: string): string => {
  const flags: { [key: string]: string } = {
    'da': '🇩🇰', // Denmark
    'sv': '🇸🇪', // Sweden
    'no': '🇳🇴', // Norway
    'fi': '🇫🇮', // Finland
    'de': '🇩🇪', // Germany
    'nl': '🇳🇱', // Netherlands
    'fr-BE': '🇧🇪', // Belgium (French)
    'nl-BE': '🇧🇪', // Belgium (Dutch)
    'es': '🇪🇸', // Spain
  };
  return flags[langCode] || '';
};
import axios from 'axios';

const API_URL = 'https://api.deepl.com/v2/translate';
const API_KEY = import.meta.env.VITE_DEEPL_API_KEY;

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error('DeepL API key is not set. Please set a valid API key in your .env file.');
  }

  const languageCodeMap: { [key: string]: string } = {
    'Danish': 'DA',
    'Swedish': 'SV',
    'Norwegian': 'NB',
    'Finnish': 'FI',
    'German': 'DE',
    'Dutch': 'NL',
    'Belgian French': 'FR',
    'Belgian Dutch': 'NL',
    'Spanish': 'ES',
  };

  const targetLangCode = languageCodeMap[targetLanguage];
  if (!targetLangCode) {
    throw new Error(`Unsupported language: ${targetLanguage}`);
  }

  try {
    const response = await axios.post(
      API_URL,
      new URLSearchParams({
        auth_key: API_KEY,
        text: text,
        target_lang: targetLangCode
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000 // 10 seconds timeout
      }
    );

    if (response.data && response.data.translations && response.data.translations[0]) {
      return response.data.translations[0].text;
    } else {
      throw new Error('Unexpected response structure from DeepL API');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API error:', error.response.status, error.response.data);
        throw new Error(`DeepL API error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response received from DeepL API. Please check your internet connection and try again.');
      } else {
        console.error('Error setting up the request:', error.message);
        throw new Error(`Error setting up the request: ${error.message}`);
      }
    } else {
      console.error('Unexpected error:', error);
      throw new Error(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};
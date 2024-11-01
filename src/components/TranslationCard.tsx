import React, { useState } from 'react';
import { Copy } from 'lucide-react';

interface TranslationCardProps {
  language: string;
  translatedText: string;
}

const TranslationCard: React.FC<TranslationCardProps> = ({ language, translatedText }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
  };

  return (
    <div 
      className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCopy}
    >
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out z-10">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </button>
        </div>
      )}
      <div className={`px-4 py-5 sm:p-6 ${isHovered ? 'opacity-75' : ''}`}>
        <h3 className="text-lg leading-6 font-medium text-gray-900">{language}</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p className="whitespace-pre-wrap">{translatedText || 'Translation will appear here'}</p>
        </div>
      </div>
    </div>
  );
};

export default TranslationCard;
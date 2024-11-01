import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { getLanguageFlag } from '../utils/languageUtils';

interface ValidationFiltersProps {
  languages: { code: string; name: string; }[];
  selectedLanguages: string[];
  timeRange: string;
  onLanguageChange: (code: string) => void;
  onTimeRangeChange: (range: string) => void;
  onToggleAllLanguages: () => void;
}

const ValidationFilters: React.FC<ValidationFiltersProps> = ({
  languages,
  selectedLanguages,
  timeRange,
  onLanguageChange,
  onTimeRangeChange,
  onToggleAllLanguages
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const timeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target as Node)) {
        setIsTimeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFiltersCount = (timeRange !== 'all' ? 1 : 0) + 
    (selectedLanguages.length !== languages.length ? 1 : 0);

  const timeRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
  ];

  const getTimeRangeLabel = (value: string) => {
    return timeRangeOptions.find(option => option.value === value)?.label || 'All Time';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 border border-gray-100">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-sm hover:bg-gray-50 transition-colors duration-200 group"
      >
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
          <span className="font-medium text-gray-700">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-black text-white">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[200px]" ref={timeDropdownRef}>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Time Range
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white hover:border-gray-300 transition-all duration-200 flex justify-between items-center"
                >
                  <span className="truncate">{getTimeRangeLabel(timeRange)}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                </button>

                {isTimeDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                    <div className="max-h-48 overflow-y-auto py-1">
                      {timeRangeOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onTimeRangeChange(option.value);
                            setIsTimeDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-1.5 text-sm text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between ${
                            timeRange === option.value
                              ? 'text-black font-medium'
                              : 'text-gray-600'
                          }`}
                        >
                          {option.label}
                          {timeRange === option.value && (
                            <span className="h-1.5 w-1.5 bg-black rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-[200px]" ref={languageDropdownRef}>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Languages
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white hover:border-gray-300 transition-all duration-200 flex justify-between items-center"
                >
                  <span className="truncate">
                    {selectedLanguages.length === languages.length
                      ? 'All Languages'
                      : selectedLanguages.length === 0
                      ? 'Select Languages'
                      : `${selectedLanguages.length} Selected`}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                </button>

                {isLanguageDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleAllLanguages();
                        }}
                        className="w-full px-3 py-1.5 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors duration-200 text-left flex items-center justify-between"
                      >
                        <span>
                          {selectedLanguages.length === languages.length ? 'Deselect All' : 'Select All'}
                        </span>
                        {selectedLanguages.length > 0 && selectedLanguages.length < languages.length && (
                          <X className="h-3.5 w-3.5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={(e) => {
                            e.stopPropagation();
                            onLanguageChange(lang.code);
                          }}
                          className={`w-full px-3 py-1.5 text-sm text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between ${
                            selectedLanguages.includes(lang.code)
                              ? 'text-black font-medium'
                              : 'text-gray-600'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{getLanguageFlag(lang.code)}</span>
                            <span>{lang.name}</span>
                          </span>
                          {selectedLanguages.includes(lang.code) && (
                            <span className="h-1.5 w-1.5 bg-black rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationFilters;
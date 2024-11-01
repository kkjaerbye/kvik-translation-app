import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import KvikLogo from './KvikLogo';
import { useTheme } from '../hooks/useTheme';

const Navigation = () => {
  const { theme, toggleTheme } = useTheme();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-black text-white dark:bg-white dark:text-black'
        : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
    }`;

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <KvikLogo className="h-8 w-auto text-black dark:text-white" />
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <NavLink to="/" className={navLinkClasses} end>
                Translate
              </NavLink>
              <NavLink to="/validations" className={navLinkClasses}>
                Validations
              </NavLink>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
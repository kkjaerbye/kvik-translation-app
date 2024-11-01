import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import TranslatePage from './pages/TranslatePage';
import ValidationsPage from './pages/ValidationsPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Navigation />
      <Routes>
        <Route path="/" element={<TranslatePage />} />
        <Route path="/validations" element={<ValidationsPage />} />
      </Routes>
    </div>
  );
}

export default App;
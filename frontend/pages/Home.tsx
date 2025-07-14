import React from 'react';
import UrlInput from '../components/UrlInput';
import ResultsTable from '../components/ResultsTable';
import BulkActions from '../components/BulkActions';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen p-4 md:p-10 bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-all">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 md:p-10 mb-8 text-center border border-indigo-200 dark:border-gray-700 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-white mb-2">🔍 URL Crawler</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Instantly analyze any website, extract internal and external links, and see its HTML metadata.
        </p>
      </div>

      {/* URL Input Form */}
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 mb-6 border border-indigo-100 dark:border-gray-700">
        <UrlInput />
      </div>

      {/* Bulk Actions */}
      <div className="mb-6">
        <BulkActions />
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 border border-indigo-100 dark:border-gray-700">
        <ResultsTable />
      </div>
    </div>
  );
};

export default Home;

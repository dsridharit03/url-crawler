import React from 'react';
import UrlInput from '../components/UrlInput';
import ResultsTable from '../components/ResultsTable';
import BulkActions from '../components/BulkActions';
import { ReactComponent as Logo } from '../public/vite.svg'; // Adjust path if needed

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-all duration-500">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 md:p-12 mb-10 text-center border border-indigo-200/50 dark:border-gray-700/50 transition-transform duration-300 hover:scale-[1.02]">
          <div className="flex justify-center mb-6">
            <Logo className="w-16 h-16 text-indigo-600 dark:text-indigo-400 animate-pulse" aria-hidden="true" />
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-4">
            URL Crawler
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover insights from any website with our powerful URL analysis tool. Extract links, metadata, and more in seconds!
          </p>
        </div>

        {/* URL Input Form */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 mb-8 border border-indigo-100/50 dark:border-gray-700/50">
          <UrlInput />
        </div>

        {/* Bulk Actions */}
        <div className="mb-8 flex justify-center">
          <BulkActions />
        </div>

        {/* Results Table */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border border-indigo-100/50 dark:border-gray-700/50">
          <ResultsTable />
        </div>
      </div>
    </div>
  );
};

export default Home;
import React, { useState } from 'react';
  import { postUrl } from './utils/api';
  import ResultsTable from './components/ResultsTable';

  const App: React.FC = () => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
      try {
        await postUrl(url);
        setError('');
      } catch (err) {
        setError('Failed to start crawl');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <h1 className="text-5xl font-extrabold text-green-700 mb-10 tracking-tight text-center hover:text-green-800 transition-all duration-300">
          URL Crawler
        </h1>
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4">
            <input
              type="text"
              placeholder="Enter URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="p-4 border-4 border-blue-500 rounded-xl w-full focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 bg-white shadow-md hover:shadow-lg"
              aria-label="Enter URL to analyze"
            />
            <button
              onClick={handleAnalyze}
              className="p-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl shadow-md hover:from-blue-700 hover:to-blue-500 disabled:from-gray-400 disabled:to-gray-300 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
              aria-label="Analyze URL"
            >
              Analyze
            </button>
          </div>
          {error && (
            <p className="text-red-600 mt-4 font-semibold bg-red-100 p-4 rounded-xl shadow-md hover:bg-red-200 transition-all duration-300" role="alert">
              {error}
            </p>
          )}
        </div>
        <ResultsTable />
      </div>
    );
  };

  export default App;
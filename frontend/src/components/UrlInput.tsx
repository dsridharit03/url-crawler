import React, { useState } from 'react';
import { postUrl } from '../utils/api';
import { CrawlResult } from '../types';

const UrlInput: React.FC = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.match(/^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }
    setIsLoading(true);
    try {
      const response: CrawlResult = await postUrl(url);
      setUrl('');
      setError('');
    } catch (err) {
      setError('Failed to submit URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2"
        aria-label="URL submission form"
      >
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL (e.g., https://example.com)"
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          aria-label="Enter URL to analyze"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          disabled={isLoading}
          aria-label="Analyze URL"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
      {error && (
        <p className="text-red-500 mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default UrlInput;
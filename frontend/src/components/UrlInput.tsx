import React, { useState } from 'react';
import { postUrl } from '../utils/api';
import { UrlResult } from '../utils';

const UrlInput: React.FC = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with URL:', url);
    
    if (!url.match(/^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/)) {
      console.log('Invalid URL format:', url);
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setIsLoading(true);
    console.log('Sending POST request for URL:', url);
    try {
      const response: UrlResult = await postUrl(url);
      console.log('postUrl success:', response);
      setUrl('');
      setError('');
    } catch (err) {
      console.error('postUrl failed:', err);
      setError('Failed to submit URL. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('Form submission completed, isLoading:', false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => {
            console.log('Input changed:', e.target.value);
            setUrl(e.target.value);
            setError('');
          }}
          placeholder="Enter URL (e.g., https://example.com)"
          className="flex-grow p-2 border rounded"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default UrlInput;
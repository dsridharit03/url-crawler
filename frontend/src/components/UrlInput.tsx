import React, { useState } from 'react';
import { postUrl } from '../utils/api';

interface UrlInputProps {
  onAnalyze: () => void; // Callback to refresh results
}

const UrlInput: React.FC<UrlInputProps> = ({ onAnalyze }) => {
  const [url, setUrl] = useState('');

  const handleAnalyze = async () => {
    if (!url) {
      alert('Please enter a valid URL');
      return;
    }
    try {
      alert(`Analyzing URL: ${url}`);
      await postUrl(url);
      setUrl('');
      onAnalyze(); // Trigger results refresh
    } catch (error) {
      console.error('Error analyzing URL:', error);
      alert(`Failed to analyze URL: ${error.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL (e.g., https://example.com)"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAnalyze}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Analyze
        </button>
      </div>
    </div>
  );
};

export default UrlInput;
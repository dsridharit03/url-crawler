import React, { useState } from 'react';
import { postUrl } from '../utils/api';

const UrlInput: React.FC = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postUrl(url);
      setUrl('');
      setError('');
    } catch (err) {
      setError('Failed to submit URL');
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="p-2 border rounded w-full"
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Analyze</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default UrlInput;
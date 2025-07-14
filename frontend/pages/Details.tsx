import React from 'react';
import { useParams } from 'react-router-dom';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Placeholder for detailed view logic
  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-white to-slate-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-xl rounded-xl p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold mb-4">🔎 Page Details</h2>
        <p className="text-lg">Here you can display more details for URL entry ID: <span className="font-mono text-blue-600 dark:text-blue-400">{id}</span></p>
        {/* Add more UI here: charts, insights, metadata, etc. */}
      </div>
    </div>
  );
};

export default Details;

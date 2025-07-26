import React from 'react';
import { useParams } from 'react-router-dom';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-6 bg-gray-100 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">URL Details</h1>
      <p>Details for result ID: {id}</p>
      {/* Add details view with chart.js for broken links */}
    </div>
  );
};

export default Details;
import React from 'react';
import UrlInput from '../components/UrlInput';
import ResultsTable from '../components/ResultsTable';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">URL Crawler</h1>
      <UrlInput />
      <ResultsTable />
    </div>
  );
};

export default Home;
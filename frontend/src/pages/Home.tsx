import React, { useState } from 'react';
import UrlInput from '../components/UrlInput';
import ResultsTable from '../components/ResultsTable';

const Home: React.FC = () => {
  const [refresh, setRefresh] = useState(false);

  const handleAnalyze = () => {
    setRefresh(true);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">URL Crawler</h1>
      <UrlInput onAnalyze={handleAnalyze} />
      <ResultsTable refresh={refresh} onRefreshComplete={() => setRefresh(false)} />
    </div>
  );
};

export default Home;
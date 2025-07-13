import React from 'react';
import UrlInput from '../components/UrlInput';
import ResultsTable from '../components/ResultsTable';
import BulkActions from '../components/BulkActions';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold p-4">URL Crawler</h1>
      <UrlInput />
      <BulkActions />
      <ResultsTable />
    </div>
  );
};

export default Home;
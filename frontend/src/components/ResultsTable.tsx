import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getResults } from '../utils/api';
import { UrlResult } from '../types';

const ResultsTable: React.FC = () => {
  const [results, setResults] = useState<UrlResult[]>([]);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<keyof UrlResult>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      const data = await getResults();
      setResults(data);
    };
    fetchResults();
    const interval = setInterval(fetchResults, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (field: keyof UrlResult) => {
    setSortField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredResults = results
    .filter((r) => r.url.includes(search) || r.title.includes(search))
    .sort((a, b) => {
      const aVal = a[sortField] as any;
      const bVal = b[sortField] as any;
      return sortOrder === 'asc' ? aVal > bVal ? 1 : -1 : aVal < bVal ? 1 : -1;
    });

  const paginatedResults = filteredResults.slice((page - 1) * 10, page * 10);

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded mb-4 w-full"
      />
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th onClick={() => handleSort('title')} className="border p-2 cursor-pointer">Title</th>
            <th onClick={() => handleSort('html_version')} className="border p-2 cursor-pointer">HTML Version</th>
            <th onClick={() => handleSort('internal_links')} className="border p-2 cursor-pointer">Internal Links</th>
            <th onClick={() => handleSort('external_links')} className="border p-2 cursor-pointer">External Links</th>
            <th onClick={() => handleSort('status')} className="border p-2 cursor-pointer">Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedResults.map((result) => (
            <tr key={result.id}>
              <td className="border p-2"><Link to={`/details/${result.id}`}>{result.title}</Link></td>
              <td className="border p-2">{result.html_version}</td>
              <td className="border p-2">{result.internal_links}</td>
              <td className="border p-2">{result.external_links}</td>
              <td className="border p-2">{result.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button onClick={() => setPage(page - 1)} disabled={page === 1} className="p-2 bg-gray-300 rounded">Previous</button>
        <button onClick={() => setPage(page + 1)} disabled={page * 10 >= filteredResults.length} className="p-2 bg-gray-300 rounded">Next</button>
      </div>
    </div>
  );
};

export default ResultsTable;
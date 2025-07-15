import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getResults, postUrl, deleteResult } from '../utils/api';
import { UrlResult } from '../types';
import BulkActions from './BulkActions';

const ResultsTable: React.FC = () => {
  const [results, setResults] = useState<UrlResult[]>([]);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<keyof UrlResult>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [htmlFilter, setHtmlFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getResults();
        console.log('Fetched results:', data);
        setResults(data || []);
        setError('');
      } catch (err) {
        setError('Failed to fetch results');
      }
    };
    fetchResults();
    const interval = setInterval(fetchResults, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (field: keyof UrlResult) => {
    setSortField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRerun = async () => {
    const selectedResults = results.filter((r) => selectedIds.includes(r.id));
    try {
      for (const result of selectedResults) {
        await postUrl(result.url);
      }
      const data = await getResults();
      setResults(data);
      setSelectedIds([]);
    } catch (err) {
      setError('Failed to re-run selected URLs');
    }
  };

  const handleDelete = async () => {
    try {
      for (const id of selectedIds) {
        await deleteResult(id);
      }
      const data = await getResults();
      setResults(data);
      setSelectedIds([]);
    } catch (err) {
      setError('Failed to delete selected URLs');
    }
  };

  const filteredResults = results
    .reduce((acc, curr) => {
      const existing = acc.find((r) => r.url === curr.url);
      if (!existing || existing.id < curr.id) {
        return [...acc.filter((r) => r.url !== curr.url), curr];
      }
      return acc;
    }, [] as UrlResult[])
    .filter(
      (r) =>
        r.status !== 'queued' &&
        (!htmlFilter || r.html_version === htmlFilter) &&
        (!statusFilter || r.status === statusFilter) &&
        (!search ||
          (r.url || '').toLowerCase().includes(search.toLowerCase()) ||
          (r.title || '').toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const aVal = sortField === 'broken_links' ? (a.broken_links?.length ?? 0) : (a[sortField] ?? '');
      const bVal = sortField === 'broken_links' ? (b.broken_links?.length ?? 0) : (b[sortField] ?? '');
      if (aVal === bVal) return 0;
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

  const paginatedResults = filteredResults.slice((page - 1) * 10, page * 10);

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white rounded-xl shadow-2xl">
      <h1 className="text-4xl font-extrabold text-purple-700 mb-8 tracking-tight hover:text-purple-800 transition-all duration-300">
        URL Crawler Results
      </h1>
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-8 gap-4">
        <input
          type="text"
          placeholder="Search by URL or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-4 border-4 border-blue-500 rounded-xl w-full sm:w-1/3 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 bg-white shadow-md hover:shadow-lg"
          aria-label="Search results"
        />
        <select
          value={htmlFilter}
          onChange={(e) => setHtmlFilter(e.target.value)}
          className="p-4 border-4 border-blue-500 rounded-xl w-full sm:w-1/4 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 bg-white shadow-md hover:shadow-lg"
          aria-label="Filter by HTML version"
        >
          <option value="">All HTML Versions</option>
          <option value="HTML5">HTML5</option>
          <option value="Other">Other</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-4 border-4 border-blue-500 rounded-xl w-full sm:w-1/4 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 bg-white shadow-md hover:shadow-lg"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="done">Done</option>
          <option value="error">Error</option>
        </select>
      </div>
      {error && (
        <p className="text-red-600 mb-6 font-semibold bg-red-100 p-4 rounded-xl shadow-md hover:bg-red-200 transition-all duration-300" role="alert">
          {error}
        </p>
      )}
      <BulkActions
        onRerun={handleRerun}
        onDelete={handleDelete}
        disabled={selectedIds.length === 0}
        className="mb-8"
      />
      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="w-full rounded-xl" role="grid">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => setSelectedIds(e.target.checked ? filteredResults.map((r) => r.id) : [])}
                  className="rounded text-blue-600 focus:ring-blue-300"
                  aria-label="Select all results"
                />
              </th>
              <th
                onClick={() => handleSort('title')}
                className="cursor-pointer hover:bg-blue-700 transition-all duration-200"
                role="columnheader"
                aria-sort={sortField === 'title' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Title
              </th>
              <th
                onClick={() => handleSort('html_version')}
                className="cursor-pointer hover:bg-blue-700 transition-all duration-200"
                role="columnheader"
                aria-sort={sortField === 'html_version' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                HTML Version
              </th>
              <th
                onClick={() => handleSort('h1_count')}
                className="cursor-pointer hover:bg-blue-700 transition-all duration-200"
                role="columnheader"
                aria-sort={sortField === 'h1_count' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                H1 Count
              </th>
              <th
                onClick={() => handleSort('h2_count')}
                className="cursor-pointer hover:bg-blue-700 transition-all duration-200"
                role="columnheader"
                aria-sort={sortField === 'h2_count' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                H2 Count
              </th>
              <th
                onClick={() => handleSort('h3_count')}
                className="cursor-pointer hover:bg-blue-700 transition-all duration-200"
                role="columnheader"
                aria-sort={sortField === 'h3_count' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                H3 Count
              </th>
              <th
                onClick={() => handleSort('h4_count')}
                className="cursor-pointer hover:bg-blue-700 transition-all duration-200"
                role="columnheader"
                aria-sort={sortField === 'h4_count' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                H4 Count
              </th>
              <th
                onClick={() => handleSort('h5_count')}
                className="cursor-pointer hover:bg-blue-700 transition-all duration-200"
                role="columnheader"
                aria-sort={sortField === 'h5_count' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                H5 Count
              </th>
              <th
                onClick={() => handleSort('h6_count')}
                className="cursor-pointer hover:bg-blue-700 transition-all duration-200"
                role="columnheader"
                aria-sort={sortField === 'h6_count' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                H6 Count
              </th>
              <th
                onClick={() => handleSort('internal_links')}
                className="cursor-pointer hover:bg-blue-700 transition-all duration-200"
                role="columnheader"
                aria-sort={sortField === 'internal_links' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Internal Links
              </th>
              <th
                onClick={() => handleSort('external_links')}
                className="cursor-pointer hover:bg-blue-700 transition-all duration-200"
                role="columnheader"
                aria-sort={sortField === 'external_links' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                External Links
              </th>
              <th
                onClick={() => handleSort('broken_links')}
                className="cursor-pointer hover:bg-blue-700 transition-all duration-200"
                role="columnheader"
                aria-sort={sortField === 'broken_links' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Broken Links
              </th>
              <th
                onClick={() => handleSort('status')}
                className="cursor-pointer hover:bg-blue-700 transition-all duration-200"
                role="columnheader"
                aria-sort={sortField === 'status' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedResults.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center text-gray-600 font-medium">
                  No results match the current filters.
                </td>
              </tr>
            ) : (
              paginatedResults.map((result, index) => (
                <tr
                  key={result.id}
                  className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:scale-105 transition-all duration-300`}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(result.id)}
                      onChange={() => handleSelect(result.id)}
                      className="rounded text-blue-600 focus:ring-blue-300"
                      aria-label={`Select result for ${result.title || 'No Title'}`}
                    />
                  </td>
                  <td>
                    <Link
                      to={`/details/${result.id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      {result.title || 'No Title'}
                    </Link>
                  </td>
                  <td>{result.html_version || 'Unknown'}</td>
                  <td>{result.h1_count ?? 0}</td>
                  <td>{result.h2_count ?? 0}</td>
                  <td>{result.h3_count ?? 0}</td>
                  <td>{result.h4_count ?? 0}</td>
                  <td>{result.h5_count ?? 0}</td>
                  <td>{result.h6_count ?? 0}</td>
                  <td>{result.internal_links ?? 0}</td>
                  <td>{result.external_links ?? 0}</td>
                  <td>{result.broken_links?.length ?? 0}</td>
                  <td>{result.status || 'unknown'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="p-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl shadow-md hover:from-blue-700 hover:to-blue-500 disabled:from-gray-400 disabled:to-gray-300 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="text-gray-800 font-medium" aria-live="polite">
          Page {page} of {Math.ceil(filteredResults.length / 10)}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * 10 >= filteredResults.length}
          className="p-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl shadow-md hover:from-blue-700 hover:to-blue-500 disabled:from-gray-400 disabled:to-gray-300 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ResultsTable;
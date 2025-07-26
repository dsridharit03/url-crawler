import React, { useState, useEffect } from 'react';
import { postUrl, getResults, deleteResult } from './utils/api';
import { UrlResult } from './utils/index';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<UrlResult[]>([]);
  const [search, setSearch] = useState('');
  const [htmlVersionFilter, setHtmlVersionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  // Fetch results on mount
  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const data = await getResults();
      setResults(data);
    } catch (error) {
      console.error('Error fetching results:', error);
      alert('Failed to fetch results');
    }
  };

  const handleAnalyze = async () => {
    if (!url) {
      alert('Please enter a valid URL');
      return;
    }
    try {
      alert(`Analyzing URL: ${url}`);
      await postUrl(url);
      await fetchResults();
      setUrl('');
    } catch (error) {
      console.error('Error analyzing URL:', error);
      alert(`Failed to analyze URL: ${error.message}`);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one URL');
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} URL(s)?`)) {
      try {
        await Promise.all(selectedIds.map(id => deleteResult(id)));
        await fetchResults();
        setSelectedIds([]);
      } catch (error) {
        console.error('Error deleting results:', error);
        alert('Failed to delete selected URLs');
      }
    }
  };

  const handleRerunSelected = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one URL');
      return;
    }
    try {
      const selectedResults = results.filter(r => selectedIds.includes(r.id));
      await Promise.all(selectedResults.map(r => postUrl(r.url)));
      await fetchResults();
      setSelectedIds([]);
      alert(`${selectedIds.length} URL(s) re-run successfully`);
    } catch (error) {
      console.error('Error re-running URLs:', error);
      alert('Failed to re-run selected URLs');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredResults.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredResults.map(r => r.id));
    }
  };

  // Filter results
  const filteredResults = results.filter(result => {
    const matchesSearch = result.url.toLowerCase().includes(search.toLowerCase()) ||
                         result.title.toLowerCase().includes(search.toLowerCase());
    const matchesVersion = !htmlVersionFilter || result.html_version === htmlVersionFilter;
    const matchesStatus = !statusFilter || result.status === statusFilter;
    return matchesSearch && matchesVersion && matchesStatus;
  });

  // Pagination
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  return (
    <div className="container mx-auto p-6 bg-gray-100 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">URL Crawler</h1>

      {/* URL Input Form */}
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

      {/* Results Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">URL Crawler Results</h2>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by URL or title..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
          <div className="flex gap-4">
            <select
              value={htmlVersionFilter}
              onChange={(e) => setHtmlVersionFilter(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All HTML Versions</option>
              <option value="HTML5">HTML5</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="done">Done</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRerunSelected}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Re-run Selected
            </button>
            <button
              onClick={handleDeleteSelected}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Delete Selected
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="p-3 border-b text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredResults.length && filteredResults.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-3 border-b text-left">Title</th>
                <th className="p-3 border-b text-left">HTML Version</th>
                <th className="p-3 border-b text-left">H1 Count</th>
                <th className="p-3 border-b text-left">H2 Count</th>
                <th className="p-3 border-b text-left">H3 Count</th>
                <th className="p-3 border-b text-left">H4 Count</th>
                <th className="p-3 border-b text-left">H5 Count</th>
                <th className="p-3 border-b text-left">H6 Count</th>
                <th className="p-3 border-b text-left">Internal Links</th>
                <th className="p-3 border-b text-left">External Links</th>
                <th className="p-3 border-b text-left">Broken Links</th>
                <th className="p-3 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border-b">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(result.id)}
                      onChange={() => {
                        setSelectedIds((prev) =>
                          prev.includes(result.id)
                            ? prev.filter((id) => id !== result.id)
                            : [...prev, result.id]
                        );
                      }}
                    />
                  </td>
                  <td className="p-3 border-b">{result.title}</td>
                  <td className="p-3 border-b">{result.html_version}</td>
                  <td className="p-3 border-b">{result.h1_count}</td>
                  <td className="p-3 border-b">{result.h2_count}</td>
                  <td className="p-3 border-b">{result.h3_count}</td>
                  <td className="p-3 border-b">{result.h4_count}</td>
                  <td className="p-3 border-b">{result.h5_count}</td>
                  <td className="p-3 border-b">{result.h6_count}</td>
                  <td className="p-3 border-b">{result.internal_links}</td>
                  <td className="p-3 border-b">{result.external_links}</td>
                  <td className="p-3 border-b">{result.broken_links?.length || 0}</td>
                  <td className="p-3 border-b text-green-600">{result.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-800">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
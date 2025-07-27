import React, { useState, useEffect } from 'react';
   import axios from 'axios';
   import { UrlResult } from '../types';
   import BulkActions from './BulkActions';
   import StatusIndicator from './StatusIndicator';

   const ResultsTable: React.FC = () => {
       const [results, setResults] = useState<UrlResult[]>([]);
       const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
       const [isDeleting, setIsDeleting] = useState(false);

        const API_BASE_URL = 'http://localhost:8082';
       //const API_BASE_URL = 'https://url-crawler.onrender.com';

       useEffect(() => {
           fetchResults();
       }, []);

       async function fetchResults() {
           try {
               const token = localStorage.getItem('token');
               if (!token) {
                   throw new Error('Please log in to fetch results');
               }
               const response = await axios.get(`${API_BASE_URL}/results`, {
                   headers: {
                       Authorization: `Bearer ${token}`,
                       'Content-Type': 'application/json',
                   },
               });
               setResults(response.data);
           } catch (error: any) {
               console.error('Error fetching results:', error);
               alert(`Error fetching results: ${error.response?.data?.error || error.message}`);
           }
       }

       async function deleteSelected() {
           if (selectedIds.size === 0) {
               alert('Please select at least one URL');
               return;
           }
           const urlText = selectedIds.size === 1 ? 'URL' : 'URLs';
           if (!confirm(`Are you sure you want to delete ${selectedIds.size} selected ${urlText}? This cannot be undone.`)) {
               return;
           }
           setIsDeleting(true);
           try {
               const token = localStorage.getItem('token');
               if (!token) {
                   throw new Error('Please log in to perform this action');
               }
               const ids = Array.from(selectedIds);
               console.log('Deleting IDs:', ids);
               let errors: string[] = [];
               let deletedCount = 0;
               for (const id of ids) {
                   try {
                       await axios.delete(`${API_BASE_URL}/results/${id}`, {
                           headers: {
                               Authorization: `Bearer ${token}`,
                               'Content-Type': 'application/json',
                           },
                       });
                       deletedCount++;
                   } catch (err: any) {
                       errors.push(err.response?.data?.error || `Failed to delete URL with ID ${id}`);
                   }
               }
               await fetchResults();
               setSelectedIds(new Set());
               if (errors.length > 0) {
                   alert(`Deleted ${deletedCount} ${urlText}. Errors: ${errors.join(', ')}`);
               } else {
                   alert(`Successfully deleted ${deletedCount} ${urlText}`);
               }
           } catch (error: any) {
               console.error('Error deleting URLs:', error);
               alert(`Error deleting URLs: ${error.response?.data?.error || error.message}`);
           } finally {
               setIsDeleting(false);
           }
       }

       const toggleSelectAll = () => {
           if (selectedIds.size === results.length) {
               setSelectedIds(new Set());
           } else {
               setSelectedIds(new Set(results.map((r) => r.id.toString())));
           }
       };

       const toggleSelect = (id: string) => {
           const newSelected = new Set(selectedIds);
           if (newSelected.has(id)) {
               newSelected.delete(id);
           } else {
               newSelected.add(id);
           }
           setSelectedIds(newSelected);
       };

       return (
           <div className="bg-white p-6 rounded-lg shadow-md">
               <h2 className="text-2xl font-semibold text-gray-800 mb-4">URL Crawler Results</h2>
               <BulkActions
                   selectedCount={selectedIds.size}
                   onDelete={deleteSelected}
                   isDeleting={isDeleting}
               />
               <div className="overflow-x-auto">
                   <table className="min-w-full bg-white border border-gray-300">
                       <thead>
                           <tr className="bg-gray-200 text-gray-800">
                               <th className="p-3 border-b text-left">
                                   <input
                                       type="checkbox"
                                       checked={selectedIds.size === results.length && results.length > 0}
                                       onChange={toggleSelectAll}
                                   />
                               </th>
                               <th className="p-3 border-b text-left">URL</th>
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
                           {results.map((result) => (
                               <tr key={result.id} className="hover:bg-gray-50 transition">
                                   <td className="p-3 border-b">
                                       <input
                                           type="checkbox"
                                           checked={selectedIds.has(result.id.toString())}
                                           onChange={() => toggleSelect(result.id.toString())}
                                       />
                                   </td>
                                   <td className="p-3 border-b truncate max-w-xs" title={result.url}>
                                       {result.url}
                                   </td>
                                   <td className="p-3 border-b truncate max-w-xs" title={result.title}>
                                       {result.title}
                                   </td>
                                   <td className="p-3 border-b">{result.html_version}</td>
                                   <td className="p-3 border-b">{result.h1_count}</td>
                                   <td className="p-3 border-b">{result.h2_count}</td>
                                   <td className="p-3 border-b">{result.h3_count}</td>
                                   <td className="p-3 border-b">{result.h4_count}</td>
                                   <td className="p-3 border-b">{result.h5_count}</td>
                                   <td className="p-3 border-b">{result.h6_count}</td>
                                   <td className="p-3 border-b">{result.internal_links}</td>
                                   <td className="p-3 border-b">{result.external_links}</td>
                                   <td className="p-3 border-b">{result.broken_links.length}</td>
                                   <td className="p-3 border-b">
                                       <StatusIndicator status={result.status} />
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           </div>
       );
   };

   export default ResultsTable;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getResults } from '../utils/api';
import { UrlResult } from '../types';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<UrlResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const results = await getResults();
        const data = results.find((r) => r.id === parseInt(id!));
        if (!data) {
          setError('Result not found');
          setResult(null);
          return;
        }
        setResult(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch details');
      }
    };
    fetchResult();
  }, [id]);

  if (error) {
    return (
      <div className="p-4" role="alert">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!result) {
    return <div className="p-4">Loading...</div>;
  }

  const chartData = {
    labels: ['Internal Links', 'External Links'],
    datasets: [
      {
        label: 'Links',
        data: [result.internal_links ?? 0, result.external_links ?? 0],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Link Distribution' },
    },
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{result.title || 'No Title'}</h1>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <dt className="font-semibold">URL:</dt>
          <dd>{result.url}</dd>
        </div>
        <div>
          <dt className="font-semibold">HTML Version:</dt>
          <dd>{result.html_version || 'Unknown'}</dd>
        </div>
        <div>
          <dt className="font-semibold">H1 Count:</dt>
          <dd>{result.h1_count ?? 0}</dd>
        </div>
        <div>
          <dt className="font-semibold">H2 Count:</dt>
          <dd>{result.h2_count ?? 0}</dd>
        </div>
        <div>
          <dt className="font-semibold">H3 Count:</dt>
          <dd>{result.h3_count ?? 0}</dd>
        </div>
        <div>
          <dt className="font-semibold">H4 Count:</dt>
          <dd>{result.h4_count ?? 0}</dd>
        </div>
        <div>
          <dt className="font-semibold">H5 Count:</dt>
          <dd>{result.h5_count ?? 0}</dd>
        </div>
        <div>
          <dt className="font-semibold">H6 Count:</dt>
          <dd>{result.h6_count ?? 0}</dd>
        </div>
        <div>
          <dt className="font-semibold">Internal Links:</dt>
          <dd>{result.internal_links ?? 0}</dd>
        </div>
        <div>
          <dt className="font-semibold">External Links:</dt>
          <dd>{result.external_links ?? 0}</dd>
        </div>
        <div>
          <dt className="font-semibold">Login Form:</dt>
          <dd>{result.has_login_form ? 'Yes' : 'No'}</dd>
        </div>
        <div>
          <dt className="font-semibold">Status:</dt>
          <dd>{result.status || 'unknown'}</dd>
        </div>
      </dl>

      <div className="my-6 w-full md:w-1/2 h-64">
        <Bar data={chartData} options={chartOptions} aria-label="Link distribution chart" />
      </div>

      <h2 className="text-xl mt-6 mb-2 font-semibold">Broken Links</h2>
      {result.broken_links && result.broken_links.length > 0 ? (
        <ul className="list-disc list-inside" aria-label="Broken links list">
          {result.broken_links.map((link, index) => (
            <li key={index}>
              <a href={link.url} className="text-blue-500 hover:underline">
                {link.url}
              </a> (Status: {link.status_code})
            </li>
          ))}
        </ul>
      ) : (
        <p>No broken links found.</p>
      )}
    </div>
  );
};

export default DetailsView;
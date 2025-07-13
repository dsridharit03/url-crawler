import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getResults } from '../utils/api';
import { UrlResult } from '../types';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const DetailsView: React.FC = () => {
  const { id } = useParams();
  const [result, setResult] = useState<UrlResult | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      const results = await getResults();
      const data = results.find((r) => r.id === parseInt(id!));
      setResult(data || null);
    };
    fetchResult();
  }, [id]);

  if (!result) return <div className="p-4">Loading...</div>;

  const chartData = {
    labels: ['Internal Links', 'External Links'],
    datasets: [
      {
        label: 'Links',
        data: [result.internal_links, result.external_links],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{result.title}</h1>
      <p><strong>URL:</strong> {result.url}</p>
      <p><strong>HTML Version:</strong> {result.html_version}</p>
      <p><strong>H1 Count:</strong> {result.h1_count}</p>
      <p><strong>H2 Count:</strong> {result.h2_count}</p>
      <p><strong>H3 Count:</strong> {result.h3_count}</p>
      <p><strong>Login Form:</strong> {result.has_login_form ? 'Yes' : 'No'}</p>

      <div className="my-6 w-full md:w-1/2">
        <Bar data={chartData} />
      </div>

      <h2 className="text-xl mt-6 mb-2 font-semibold">Broken Links</h2>
      {result.broken_links && result.broken_links.length > 0 ? (
        <ul className="list-disc list-inside">
          {result.broken_links.map((link, index) => (
            <li key={index}>
              {link.url} (Status: {link.status_code})
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

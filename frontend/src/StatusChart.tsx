import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function StatusChart({ results }) {
    const statusCounts = results.reduce(
        (acc, result) => {
            acc[result.status] = (acc[result.status] || 0) + 1;
            return acc;
        },
        { done: 0, queued: 0 }
    );

    const data = {
        labels: ['Done', 'Queued'],
        datasets: [
            {
                label: 'Crawl Status',
                data: [statusCounts.done, statusCounts.queued],
                backgroundColor: ['#36A2EB', '#FF6384'],
                borderColor: ['#ffffff', '#ffffff'],
                borderWidth: 1,
            },
        ],
    };

    return <Pie data={data} />;
}

export default StatusChart;
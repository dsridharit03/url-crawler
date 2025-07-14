import React from 'react';

interface StatusIndicatorProps {
  status: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const color = status === 'done' ? 'green' : status === 'running' ? 'yellow' : 'red';
  const label = status === 'done' ? 'Completed' : status === 'running' ? 'In Progress' : 'Error';

  return (
    <span
      className={`inline-block w-4 h-4 rounded-full bg-${color}-500 relative group`}
      role="status"
      aria-label={`Status: ${label}`}
    >
      <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-1 -top-8 left-1/2 transform -translate-x-1/2">
        {label}
      </span>
    </span>
  );
};

export default StatusIndicator;
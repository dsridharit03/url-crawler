import React from 'react';
import { UrlResult } from '../types';

const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
  const color = status === 'done' ? 'green' : status === 'running' ? 'yellow' : 'red';
  return <span className={`inline-block w-4 h-4 rounded-full bg-${color}-500`}></span>;
};

export default StatusIndicator;
import React from 'react';

const BulkActions: React.FC = () => {
  return (
    <div className="p-4">
      <button className="p-2 bg-blue-500 text-white rounded mr-2">Re-run Selected</button>
      <button className="p-2 bg-red-500 text-white rounded">Delete Selected</button>
    </div>
  );
};

export default BulkActions;
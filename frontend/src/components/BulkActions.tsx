import React from 'react';

interface BulkActionsProps {
  onRerun: () => void;
  onDelete: () => void;
  disabled: boolean;
}

const BulkActions: React.FC<BulkActionsProps> = ({ onRerun, onDelete, disabled }) => {
  const handleRerunClick = () => {
    if (window.confirm('Re-run analysis for selected URLs?')) {
      onRerun();
    }
  };

  const handleDeleteClick = () => {
    if (window.confirm('Delete selected URLs? This cannot be undone.')) {
      onDelete();
    }
  };

  return (
    <div className="flex space-x-3 mb-6">
      <button
        onClick={handleRerunClick}
        disabled={disabled}
        className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        aria-label="Re-run analysis for selected URLs"
      >
        Re-run Selected
      </button>
      <button
        onClick={handleDeleteClick}
        disabled={disabled}
        className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        aria-label="Delete selected URLs"
      >
        Delete Selected
      </button>
    </div>
  );
};

export default BulkActions;
import React from 'react';

interface BulkActionsProps {
  onRerun: () => void;
  onDelete: () => void;
  disabled: boolean;
  className?: string;
}

const BulkActions: React.FC<BulkActionsProps> = ({ onRerun, onDelete, disabled, className }) => {
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
    <div className={`flex space-x-4 ${className}`}>
      <button
        onClick={handleRerunClick}
        disabled={disabled}
        className="p-4 bg-gradient-to-r from-green-600 to-green-400 text-white rounded-xl shadow-md hover:from-green-700 hover:to-green-500 disabled:from-gray-400 disabled:to-gray-300 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300"
        aria-label="Re-run selected URLs"
      >
        Re-run Selected
      </button>
      <button
        onClick={handleDeleteClick}
        disabled={disabled}
        className="p-4 bg-gradient-to-r from-red-600 to-red-400 text-white rounded-xl shadow-md hover:from-red-700 hover:to-red-500 disabled:from-gray-400 disabled:to-gray-300 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-300"
        aria-label="Delete selected URLs"
      >
        Delete Selected
      </button>
    </div>
  );
};

export default BulkActions;
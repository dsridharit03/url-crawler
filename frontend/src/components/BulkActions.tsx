import React from 'react';

  interface BulkActionsProps {
    selectedCount: number;
    onDelete: () => void;
    isDeleting: boolean;
  }

  const BulkActions: React.FC<BulkActionsProps> = ({ selectedCount, onDelete, isDeleting }) => {
    return (
      <div className="flex justify-end mb-4">
        <button
          onClick={onDelete}
          disabled={isDeleting || selectedCount === 0}
          className={`bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center ${
            isDeleting || selectedCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>{isDeleting ? 'Deleting...' : 'Delete Selected'}</span>
          {isDeleting && <i className="fas fa-spinner fa-spin ml-2"></i>}
        </button>
      </div>
    );
  };

  export default BulkActions;
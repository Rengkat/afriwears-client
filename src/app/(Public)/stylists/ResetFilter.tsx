import React from "react";
import { FiSearch } from "react-icons/fi";

interface ResetFilterProps {
  setActiveFilter: (filter: string) => void;
  setSearchTerm: (term: string) => void;
  setPage: (page: number) => void;
}

const ResetFilter = ({ setActiveFilter, setSearchTerm, setPage }: ResetFilterProps) => {
  const handleReset = () => {
    setSearchTerm("");
    setActiveFilter("all");
    setPage(1); // Reset to first page
  };

  return (
    <div className="text-center py-16">
      <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
        <FiSearch className="w-full h-full" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No verified stylists found</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        We couldn't find any verified stylists matching your criteria. Try adjusting your search or
        filter criteria.
      </p>
      <button
        onClick={handleReset}
        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200">
        Reset all filters
      </button>
    </div>
  );
};

export default ResetFilter;

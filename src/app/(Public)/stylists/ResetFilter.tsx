import React from "react";
import { FiSearch } from "react-icons/fi";

const ResetFilter = ({ setActiveFilter, setSearchTerm }: any) => {
  return (
    <div className="text-center py-16">
      <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
        <FiSearch className="w-full h-full" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No stylists found</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Try adjusting your search or filter criteria to find what you're looking for.
      </p>
      <button
        onClick={() => {
          setSearchTerm("");
          setActiveFilter("all");
        }}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none">
        Reset filters
      </button>
    </div>
  );
};

export default ResetFilter;

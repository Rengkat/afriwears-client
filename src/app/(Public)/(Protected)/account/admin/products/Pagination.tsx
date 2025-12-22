import React from "react";

const Pagination = ({
  indexOfFirstProduct,
  filteredProducts,
  indexOfLastProduct,
  setCurrentPage,
  currentPage,
  totalPages,
  totalProducts,
}: any) => {
  return (
    <div className="bg-white px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{" "}
          <span className="font-medium">{indexOfLastProduct}</span> of{" "}
          <span className="font-medium">{totalProducts}</span> products
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border text-sm font-medium rounded-md ${
                currentPage === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}>
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

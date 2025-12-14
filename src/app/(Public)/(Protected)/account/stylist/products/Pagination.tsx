"use client";

const Pagination = ({ handlePrevPage, page, totalPages, handleNextPage, limit, total }: any) => {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
            page === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"
          }`}>
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
            page === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          }`}>
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-medium">{Math.min(page * limit, total)}</span> of{" "}
            <span className="font-medium">{total}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                page === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:bg-gray-50"
              }`}>
              <span className="sr-only">Previous</span>←
            </button>
            <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                page === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-400 hover:bg-gray-50"
              }`}>
              <span className="sr-only">Next</span>→
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

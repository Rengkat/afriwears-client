import React from "react";
import { FiChevronDown, FiChevronUp, FiFilter, FiX } from "react-icons/fi";

const FilterAndSort = ({
  setMobileFiltersOpen,
  sortOptions,
  setShowSortOptions,
  activeFilters,
  clearAllFilters,
  showSortOptions,
  setSortOption,
  sortOption,
}: any) => {
  return (
    <section aria-labelledby="filter-heading" className="border-b border-gray-200 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile filter toggle */}
        <button
          type="button"
          className="inline-flex items-center lg:hidden text-gray-700 hover:text-gray-900"
          onClick={() => setMobileFiltersOpen(true)}>
          <span className="font-medium">Filters</span>
          <FiFilter className="ml-2 h-5 w-5" />
        </button>

        {/* Active filters */}
        <div className="hidden sm:flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <span
              key={index}
              className="inline-flex items-center py-1 pl-3 pr-2 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              {filter}
              <button
                title="filter"
                type="button"
                className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-amber-600 hover:bg-amber-200 hover:text-amber-800">
                <FiX className="h-3 w-3" />
              </button>
            </span>
          ))}
          {activeFilters.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-amber-600 hover:text-amber-800 font-medium">
              Clear all
            </button>
          )}
        </div>

        {/* Sort options */}
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className="group inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
              onClick={() => setShowSortOptions(!showSortOptions)}>
              Sort: {sortOptions.find((opt) => opt.value === sortOption)?.label}
              {showSortOptions ? (
                <FiChevronUp className="flex-shrink-0 ml-1 h-5 w-5 text-gray-400" />
              ) : (
                <FiChevronDown className="flex-shrink-0 ml-1 h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Sort dropdown */}
          {showSortOptions && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortOption(option.value);
                      setShowSortOptions(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortOption === option.value
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FilterAndSort;

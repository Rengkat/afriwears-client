import React from "react";
import { FiChevronDown, FiChevronUp, FiFilter, FiX } from "react-icons/fi";

interface FilterAndSortProps {
  setMobileFiltersOpen: (open: boolean) => void;
  sortOptions: Array<{ value: string; label: string }>;
  setShowSortOptions: (show: boolean) => void;
  activeFilters: string[];
  clearAllFilters: () => void;
  showSortOptions: boolean;
  setSortOption: (option: string) => void;
  sortOption: string;
  removeFilter: (filterType: string, value: string) => void;
  selectedFilters: {
    category: string[];
    type: string[];
    price: string[];
  };
  filters: Array<{
    id: string;
    name: string;
    options: Array<{ value: string; label: string }>;
  }>;
}

const FilterAndSort: React.FC<FilterAndSortProps> = ({
  setMobileFiltersOpen,
  sortOptions,
  setShowSortOptions,
  activeFilters,
  clearAllFilters,
  showSortOptions,
  setSortOption,
  sortOption,
  removeFilter,
  selectedFilters,
  filters,
}) => {
  const handleRemoveFilter = (filterLabel: string) => {
    for (const filter of filters) {
      const option = filter.options.find((opt) => opt.label === filterLabel);
      if (
        option &&
        selectedFilters[filter.id as keyof typeof selectedFilters]?.includes(option.value)
      ) {
        removeFilter(filter.id, option.value);
        break;
      }
    }
  };

  return (
    <section aria-labelledby="filter-heading" className="border-b border-gray-200 py-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="inline-flex items-center lg:hidden text-gray-700 hover:text-gray-900"
          onClick={() => setMobileFiltersOpen(true)}>
          <span className="font-medium">Filters</span>
          <FiFilter className="ml-2 h-5 w-5" />
        </button>

        <div className="hidden sm:flex flex-wrap gap-2 items-center">
          {activeFilters.length > 0 && (
            <>
              <span className="text-sm text-gray-600">Active filters:</span>
              {activeFilters.map((filter, index) => (
                <span
                  key={index}
                  className="inline-flex items-center py-1 pl-3 pr-2 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  {filter}
                  <button
                    type="button"
                    onClick={() => handleRemoveFilter(filter)}
                    className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-amber-600 hover:bg-amber-200 hover:text-amber-800">
                    <FiX className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-xs text-amber-600 hover:text-amber-800 font-medium">
                Clear all
              </button>
            </>
          )}
        </div>

        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className="group inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
              onClick={() => setShowSortOptions(!showSortOptions)}>
              Sort: {sortOptions.find((opt) => opt.value === sortOption)?.label || "Featured"}
              {showSortOptions ? (
                <FiChevronUp className="flex-shrink-0 ml-1 h-5 w-5 text-gray-400" />
              ) : (
                <FiChevronDown className="flex-shrink-0 ml-1 h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

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

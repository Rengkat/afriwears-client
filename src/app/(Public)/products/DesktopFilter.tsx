import React from "react";

const DesktopFilter = ({
  filters,
  selectedFilters,
  clearAllFilters,
  toggleFilter,
  applyFilters,
  activeFilters,
}: any) => {
  return (
    <div className="hidden lg:block">
      <div className="divide-y divide-gray-200 space-y-10 pb-8">
        {filters.map((filter, filterIdx) => (
          <div key={filter.id} className={filterIdx === 0 ? null : "pt-10"}>
            <fieldset>
              <legend className="block text-sm font-medium text-gray-900">{filter.name}</legend>
              <div className="space-y-3 pt-4">
                {filter.options.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      id={`${filter.id}-${option.value}`}
                      name={`${filter.id}[]`}
                      type="checkbox"
                      checked={selectedFilters[filter.id].includes(option.value)}
                      onChange={() => toggleFilter(filter.id, option.value)}
                      className="h-4 w-4 border-gray-300 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <label
                      htmlFor={`${filter.id}-${option.value}`}
                      className="ml-3 text-sm text-gray-600">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
        ))}
        <button
          onClick={applyFilters}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md font-medium mt-6">
          Apply Filters
        </button>
        {activeFilters.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="w-full text-amber-600 hover:text-amber-800 font-medium mt-2">
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};

export default DesktopFilter;

import React from "react";
import { FiX } from "react-icons/fi";

const MobileFilterDialog = ({
  setMobileFiltersOpen,
  selectedFilters,
  filters,
  toggleFilter,
  applyFilters,
}: any) => {
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div
        className="fixed inset-0 bg-black bg-opacity-25"
        onClick={() => setMobileFiltersOpen(false)}
      />
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <button
              title="filter"
              type="button"
              className="-mr-2 w-10 h-10 bg-white p-2 rounded-md text-gray-400 hover:text-gray-500"
              onClick={() => setMobileFiltersOpen(false)}>
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4">
            {filters.map((filter) => (
              <div key={filter.id} className="border-t border-gray-200 pt-4 pb-4">
                <fieldset>
                  <legend className="block text-sm font-medium text-gray-900">{filter.name}</legend>
                  <div className="space-y-3 pt-4">
                    {filter.options.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={`${filter.id}-${option.value}-mobile`}
                          name={`${filter.id}[]`}
                          type="checkbox"
                          checked={selectedFilters[filter.id].includes(option.value)}
                          onChange={() => toggleFilter(filter.id, option.value)}
                          className="h-4 w-4 border-gray-300 rounded text-amber-600 focus:ring-amber-500"
                        />
                        <label
                          htmlFor={`${filter.id}-${option.value}-mobile`}
                          className="ml-3 text-sm text-gray-600">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={applyFilters}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md font-medium">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterDialog;

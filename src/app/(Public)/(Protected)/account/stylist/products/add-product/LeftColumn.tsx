import React from "react";
import { FiChevronDown } from "react-icons/fi";

interface LeftColumnProps {
  formData: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  categories: Array<{ value: string; label: string }>;
  types: any;
}

const LeftColumn = ({ formData, handleInputChange, categories, types }: LeftColumnProps) => {
  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
          required
          placeholder="Enter product name"
        />
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Price (₦) *
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          min="0"
          step="0.01"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
          required
          placeholder="0.00"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <div className="relative">
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 pr-8"
            required>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <FiChevronDown />
          </div>
        </div>
      </div>

      {/* Type */}
      {formData.category && (
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <div className="relative">
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 pr-8"
              required>
              <option value="">Select a type</option>
              {types[formData.category]?.map((type: string) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FiChevronDown />
            </div>
          </div>
        </div>
      )}

      {/* Stock */}
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
          Stock Quantity *
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={formData.stock}
          onChange={handleInputChange}
          min="0"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
          required
          placeholder="0"
        />
      </div>
    </div>
  );
};

export default LeftColumn;

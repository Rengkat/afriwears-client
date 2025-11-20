import React from "react";

const AdditionalDetails = ({ formData, handleInputChange }: any) => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="productDetails" className="block text-sm font-medium text-gray-700 mb-1">
          Product Details
        </label>
        <textarea
          id="productDetails"
          name="productDetails"
          value={formData.productDetails}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
          placeholder="Additional product specifications..."
        />
      </div>

      <div>
        <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-1">
          Materials
        </label>
        <input
          type="text"
          id="materials"
          name="materials"
          value={formData.materials}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
          placeholder="e.g., 100% Cotton, Silk blend"
        />
      </div>
    </div>
  );
};

export default AdditionalDetails;

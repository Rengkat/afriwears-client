import React from "react";

const Attributes = ({ formData, handleAttributeChange }: any) => {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Attributes (Optional)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="color" className="block text-xs font-medium text-gray-500 mb-1">
            Color
          </label>
          <input
            type="text"
            id="color"
            value={formData.attributes.color}
            onChange={(e) => handleAttributeChange("color", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
            placeholder="e.g. Red, Blue"
          />
        </div>

        <div>
          <label htmlFor="size" className="block text-xs font-medium text-gray-500 mb-1">
            Size
          </label>
          <input
            type="text"
            id="size"
            value={formData.attributes.size}
            onChange={(e) => handleAttributeChange("size", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
            placeholder="e.g. S, M, L"
          />
        </div>

        <div>
          <label htmlFor="material" className="block text-xs font-medium text-gray-500 mb-1">
            Material
          </label>
          <input
            type="text"
            id="material"
            value={formData.attributes.material}
            onChange={(e) => handleAttributeChange("material", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
            placeholder="e.g. Cotton, Silk"
          />
        </div>
      </div>
    </div>
  );
};

export default Attributes;

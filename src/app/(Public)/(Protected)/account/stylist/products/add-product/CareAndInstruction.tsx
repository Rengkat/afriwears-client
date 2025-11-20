import React from "react";

const CareAndInstruction = ({ formData, handleInputChange }: any) => {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="careInstructions" className="block text-sm font-medium text-gray-700 mb-1">
          Care Instructions
        </label>
        <textarea
          id="careInstructions"
          name="careInstructions"
          value={formData.careInstructions}
          onChange={handleInputChange}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
          placeholder="How to care for this product..."
        />
      </div>

      <div>
        <label htmlFor="deliveryInfo" className="block text-sm font-medium text-gray-700 mb-1">
          Delivery Information
        </label>
        <textarea
          id="deliveryInfo"
          name="deliveryInfo"
          value={formData.deliveryInfo}
          onChange={handleInputChange}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
          placeholder="Delivery timelines and information..."
        />
      </div>
    </div>
  );
};

export default CareAndInstruction;

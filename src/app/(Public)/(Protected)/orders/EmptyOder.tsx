import React from "react";
import { FiTruck } from "react-icons/fi";

const EmptyOder = ({ filter }: any) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
        <FiTruck className="w-full h-full" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {filter === "all" ? "No orders found" : `No ${filter} orders found`}
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {filter === "all"
          ? "Try adjusting your search or filter criteria"
          : "All your orders are in a different status."}
      </p>
    </div>
  );
};

export default EmptyOder;

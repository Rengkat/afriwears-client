import React from "react";

const CategoryNav = () => {
  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="flex items-center justify-between overflow-x-auto scrollbar-hide space-x-8">
        {["All", "Featured", "New Arrivals", "Bestsellers"].map((category) => (
          <button
            key={category}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              category === "All"
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}>
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;

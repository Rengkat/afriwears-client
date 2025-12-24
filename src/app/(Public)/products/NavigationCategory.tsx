import React, { useState } from "react";

interface NavigationCategoryProps {
  onCategoryChange?: (category: string) => void;
}

const NavigationCategory: React.FC<NavigationCategoryProps> = ({ onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    { id: "all", label: "All" },
    { id: "featured", label: "Featured" },
    { id: "new", label: "New Arrivals" },
    { id: "bestseller", label: "Best Sellers" },
  ];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category.toLowerCase());
    }
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="flex items-center justify-between overflow-x-auto scrollbar-hide space-x-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.label)}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeCategory === category.label
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}>
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationCategory;

"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import ProductCard from "@/components/ProductCard";
import ShopBanner from "./ShopBanner";
import { products } from "@/mockData";
import NavigationCategory from "./NavigationCategory";
import FilterAndSort from "./FilterAndSort";
import MobileFilterDialog from "./MobileFilterDialog";
import DesktopFilter from "./DesktopFilter";
import ProductGrid from "./ProductGrid";

// Mock data

const filters = [
  {
    id: "category",
    name: "Category",
    options: [
      { value: "men", label: "Men's Wear" },
      { value: "women", label: "Women's Wear" },
      { value: "unisex", label: "Unisex" },
      { value: "materials", label: "Materials" },
    ],
  },
  {
    id: "type",
    name: "Type",
    options: [
      { value: "native", label: "Native Wear" },
      { value: "corporate", label: "Corporate" },
      { value: "casual", label: "Casual" },
    ],
  },
  {
    id: "price",
    name: "Price Range",
    options: [
      { value: "0-30000", label: "Under ₦30,000" },
      { value: "30000-50000", label: "₦30,000 - ₦50,000" },
      { value: "50000-70000", label: "₦50,000 - ₦70,000" },
      { value: "70000+", label: "Over ₦70,000" },
    ],
  },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const ShopPage = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    type: [],
    price: [],
  });
  const [showSortOptions, setShowSortOptions] = useState(false);

  const toggleFilter = (filterType, value) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter((v) => v !== value);
      } else {
        newFilters[filterType] = [...newFilters[filterType], value];
      }
      return newFilters;
    });
  };

  const removeFilter = (filterType, value) => {
    toggleFilter(filterType, value);
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      category: [],
      type: [],
      price: [],
    });
  };

  const applyFilters = () => {
    const active = [];
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        const filter = filters.find((f) => f.id === key);
        values.forEach((value) => {
          const option = filter.options.find((opt) => opt.value === value);
          active.push(option.label);
        });
      }
    });
    setActiveFilters(active);
    setMobileFiltersOpen(false);
  };

  const sortProducts = (products) => {
    switch (sortOption) {
      case "newest":
        return [...products].sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
      case "price-low":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...products].sort((a, b) => b.price - a.price);
      case "rating":
        return [...products].sort((a, b) => b.rating - a.rating);
      default:
        return [...products].sort((a, b) =>
          a.isBestSeller === b.isBestSeller ? 0 : a.isBestSeller ? -1 : 1
        );
    }
  };

  const filterProducts = (products) => {
    return products.filter((product) => {
      // Category filter
      if (
        selectedFilters.category.length > 0 &&
        !selectedFilters.category.includes(product.category)
      ) {
        return false;
      }
      // Type filter
      if (selectedFilters.type.length > 0 && !selectedFilters.type.includes(product.type)) {
        return false;
      }
      // Price filter
      if (selectedFilters.price.length > 0) {
        const priceMatch = selectedFilters.price.some((range) => {
          const [min, max] = range.split("-").map(Number);
          if (range.endsWith("+")) {
            return product.price >= min;
          }
          return product.price >= min && product.price <= max;
        });
        if (!priceMatch) return false;
      }
      return true;
    });
  };

  const filteredProducts = filterProducts(products);
  const sortedProducts = sortProducts(filteredProducts);

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <ShopBanner />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Navigation */}
        <NavigationCategory />
        {/* Filters and Sorting */}
        <FilterAndSort
          setMobileFiltersOpen={setMobileFiltersOpen}
          sortOptions={sortOptions}
          setShowSortOptions={setShowSortOptions}
          activeFilters={activeFilters}
          clearAllFilters={clearAllFilters}
          showSortOptions={showSortOptions}
          setSortOption={setSortOption}
          sortOption={sortOption}
          removeFilter={removeFilter}
        />
        {/* Mobile filter dialog */}
        {mobileFiltersOpen && (
          <MobileFilterDialog
            setMobileFiltersOpen={setMobileFiltersOpen}
            selectedFilters={selectedFilters}
            filters={filters}
            toggleFilter={toggleFilter}
            applyFilters={applyFilters}
          />
        )}

        <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
          {/* Desktop Filters */}
          <DesktopFilter
            filters={filters}
            selectedFilters={selectedFilters}
            clearAllFilters={clearAllFilters}
            toggleFilter={toggleFilter}
            applyFilters={applyFilters}
            activeFilters={activeFilters}
          />
          {/* Product grid */}
          <ProductGrid
            sortedProducts={sortedProducts}
            clearAllFilters={clearAllFilters}
            filteredProducts={filteredProducts}
            activeFilters={activeFilters}
          />
        </div>
      </main>
    </div>
  );
};

export default ShopPage;

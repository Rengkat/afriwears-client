"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import ProductCard from "@/components/ProductCard";
import ShopBanner from "./ShopBanner";

// Mock data
const products = [
  {
    id: "f1",
    name: "Royal Kente Agbada Set",
    slug: "royal-kente-agbada",
    image: "/featured-1.jpg",
    price: 65000,
    originalPrice: 80000,
    stylist: "Royal Heritage Designs",
    colors: ["gold", "red", "black"],
    rating: 5.0,
    reviews: 342,
    isBestSeller: true,
    isNew: false,
    description: "Handwoven kente fabric with intricate embroidery details",
    category: "men",
    type: "native",
  },
  {
    id: "f2",
    name: "Premium Silk Adire Gown",
    slug: "premium-silk-adire",
    image: "/featured-2.jpg",
    price: 55000,
    originalPrice: 68000,
    stylist: "Amina Luxury",
    colors: ["indigo", "white", "gold"],
    rating: 4.9,
    reviews: 278,
    isBestSeller: true,
    isNew: true,
    description: "Luxury silk adire with hand-painted patterns and lace accents",
    category: "women",
    type: "native",
  },
  {
    id: "f3",
    name: "Modern Ankara 3-Piece",
    slug: "modern-ankara-3piece",
    image: "/featured-3.jpg",
    price: 48000,
    originalPrice: 55000,
    stylist: "Urban African Couture",
    colors: ["blue", "yellow", "green"],
    rating: 4.8,
    reviews: 195,
    isBestSeller: false,
    isNew: true,
    description: "Contemporary take on traditional Ankara with modern tailoring",
    category: "unisex",
    type: "casual",
  },
  {
    id: "f4",
    name: "Beaded Asooke Evening Dress",
    slug: "beaded-asooke-evening",
    image: "/featured-4.jpg",
    price: 72000,
    originalPrice: 85000,
    stylist: "Zainab Royalty",
    colors: ["cream", "gold", "burgundy"],
    rating: 5.0,
    reviews: 421,
    isBestSeller: true,
    isNew: false,
    description: "Hand-beaded asooke fabric with crystal embellishments",
    category: "women",
    type: "native",
  },
  {
    id: "f5",
    name: "African Print Office Suit",
    slug: "african-print-office-suit",
    image: "/featured-5.jpg",
    price: 38000,
    originalPrice: 45000,
    stylist: "Corporate Afrique",
    colors: ["navy", "gray", "black"],
    rating: 4.7,
    reviews: 156,
    isBestSeller: false,
    isNew: false,
    description: "Professional suit with African print accents",
    category: "unisex",
    type: "corporate",
  },
  {
    id: "f6",
    name: "Traditional Yoruba Agbada",
    slug: "yoruba-agbada",
    image: "/featured-6.jpg",
    price: 58000,
    originalPrice: null,
    stylist: "Heritage Weaves",
    colors: ["white", "blue", "gold"],
    rating: 4.9,
    reviews: 287,
    isBestSeller: true,
    isNew: false,
    description: "Authentic Yoruba agbada with intricate embroidery",
    category: "men",
    type: "native",
  },
];

const filters = [
  {
    id: "category",
    name: "Category",
    options: [
      { value: "men", label: "Men's Wear" },
      { value: "women", label: "Women's Wear" },
      { value: "unisex", label: "Unisex" },
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

        {/* Filters and Sorting */}
        <section aria-labelledby="filter-heading" className="border-b border-gray-200 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile filter toggle */}
            <button
              type="button"
              className="inline-flex items-center lg:hidden text-gray-700 hover:text-gray-900"
              onClick={() => setMobileFiltersOpen(true)}>
              <span className="font-medium">Filters</span>
              <FiFilter className="ml-2 h-5 w-5" />
            </button>

            {/* Active filters */}
            <div className="hidden sm:flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <span
                  key={index}
                  className="inline-flex items-center py-1 pl-3 pr-2 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  {filter}
                  <button
                    type="button"
                    className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-amber-600 hover:bg-amber-200 hover:text-amber-800">
                    <FiX className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {activeFilters.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-amber-600 hover:text-amber-800 font-medium">
                  Clear all
                </button>
              )}
            </div>

            {/* Sort options */}
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="group inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                  onClick={() => setShowSortOptions(!showSortOptions)}>
                  Sort: {sortOptions.find((opt) => opt.value === sortOption)?.label}
                  {showSortOptions ? (
                    <FiChevronUp className="flex-shrink-0 ml-1 h-5 w-5 text-gray-400" />
                  ) : (
                    <FiChevronDown className="flex-shrink-0 ml-1 h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Sort dropdown */}
              {showSortOptions && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortOption(option.value);
                          setShowSortOptions(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          sortOption === option.value
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Mobile filter dialog */}
        {mobileFiltersOpen && (
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
                        <legend className="block text-sm font-medium text-gray-900">
                          {filter.name}
                        </legend>
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
        )}

        <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <div className="divide-y divide-gray-200 space-y-10 pb-8">
              {filters.map((filter, filterIdx) => (
                <div key={filter.id} className={filterIdx === 0 ? null : "pt-10"}>
                  <fieldset>
                    <legend className="block text-sm font-medium text-gray-900">
                      {filter.name}
                    </legend>
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

          {/* Product grid */}
          <div className="lg:col-span-3">
            {/* Results count */}
            <div className="mb-6">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredProducts.length}</span>{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
                {activeFilters.length > 0 && (
                  <>
                    {" "}
                    filtered by: <span className="font-medium">{activeFilters.join(", ")}</span>
                  </>
                )}
              </p>
            </div>

            {/* Products */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-2 text-gray-500">
                  Try adjusting your filters or search to find what you're looking for.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            <nav className="flex items-center justify-between border-t border-gray-200 px-4 py-6 sm:px-0 mt-12">
              <div className="-mt-px flex w-0 flex-1">
                <button className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Previous
                </button>
              </div>
              <div className="hidden md:-mt-px md:flex">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                      page === 1
                        ? "border-amber-500 text-amber-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}>
                    {page}
                  </button>
                ))}
              </div>
              <div className="-mt-px flex w-0 flex-1 justify-end">
                <button className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Next
                </button>
              </div>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShopPage;

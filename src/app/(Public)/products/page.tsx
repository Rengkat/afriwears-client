"use client";
import { useState, useEffect } from "react";
import ShopBanner from "./ShopBanner";
import NavigationCategory from "./NavigationCategory";
import FilterAndSort from "./FilterAndSort";
import MobileFilterDialog from "./MobileFilterDialog";
import DesktopFilter from "./DesktopFilter";
import ProductGrid from "./ProductGrid";
import { useGetApprovedProductsQuery } from "@/redux/services/ProductApi";

// Define types
type FilterType = "category" | "type" | "price";

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  id: FilterType;
  name: string;
  options: FilterOption[];
}

interface SortOption {
  value: string;
  label: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  mainImage: string;
  subImages: string[];
  category: string;
  type: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  isBestSeller?: boolean;
  isNewProduct?: boolean;
  stock: number;
  sku?: string;
  slug: string;
  attributes: Record<string, any>;
  stylist: any;
  stylistName?: string;
  tags: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  isNew: boolean;
}

interface SelectedFilters {
  category: string[];
  type: string[];
  price: string[];
}

interface ApiResponse {
  success: boolean;
  products: any[];
  data?: {
    products: any[];
  };
}

const filters: Filter[] = [
  {
    id: "category",
    name: "Category",
    options: [
      { value: "men", label: "Men's Wear" },
      { value: "women", label: "Women's Wear" },
      { value: "unisex", label: "Unisex" },
      { value: "material", label: "Materials" },
    ],
  },
  {
    id: "type",
    name: "Type",
    options: [
      { value: "native", label: "Native Wear" },
      { value: "corporate", label: "Corporate" },
      { value: "casual", label: "Casual" },
      { value: "traditional", label: "Traditional" },
    ],
  },
  {
    id: "price",
    name: "Price Range",
    options: [
      { value: "0-30000", label: "Under ₦30,000" },
      { value: "30000-50000", label: "₦30,000 - ₦50,000" },
      { value: "50000-100000", label: "₦50,000 - ₦100,000" },
      { value: "100000-200000", label: "₦100,000 - ₦200,000" },
      { value: "200000+", label: "Over ₦200,000" },
    ],
  },
];

const sortOptions: SortOption[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "bestseller", label: "Best Sellers" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const ShopPage = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("featured");
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    category: [],
    type: [],
    price: [],
  });
  const [showSortOptions, setShowSortOptions] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);

  const { data, isLoading, error } = useGetApprovedProductsQuery({ page: 1, limit: 100 });

  useEffect(() => {
    if (data?.success && (data as ApiResponse).products) {
      const formattedProducts: Product[] = (data as ApiResponse).products.map((product: any) => ({
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        minPrice: product.minPrice,
        maxPrice: product.maxPrice,
        mainImage: product.mainImage,
        subImages: product.subImages || [],
        category: product.category,
        type: product.type,
        rating: product.rating,
        reviewCount: product.reviewCount,
        featured: product.featured,
        isBestSeller: product.isBestSeller,
        isNewProduct: product.isNewProduct,
        stock: product.stock,
        sku: product.sku,
        slug: product.slug,
        attributes: product.attributes || {},
        stylist: product.stylist,
        stylistName: product.stylistName,
        tags: product.tags || [],
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        // Virtual fields for sorting/filtering
        isNew:
          product.isNewProduct ||
          Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000,
      }));
      setProducts(formattedProducts);
    }
  }, [data]);

  const toggleFilter = (filterType: FilterType, value: string): void => {
    setSelectedFilters((prev: SelectedFilters) => {
      const newFilters = { ...prev };
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter((v: string) => v !== value);
      } else {
        newFilters[filterType] = [...newFilters[filterType], value];
      }
      return newFilters;
    });
  };

  const removeFilter = (filterType: FilterType, value: string): void => {
    const filter = filters.find((f: Filter) => f.id === filterType);
    const option = filter?.options.find((opt: FilterOption) => opt.value === value);

    if (option) {
      setActiveFilters((prev: string[]) =>
        prev.filter((filterLabel: string) => filterLabel !== option.label),
      );
    }

    setSelectedFilters((prev: SelectedFilters) => ({
      ...prev,
      [filterType]: prev[filterType].filter((v: string) => v !== value),
    }));
  };

  const clearAllFilters = (): void => {
    setSelectedFilters({
      category: [],
      type: [],
      price: [],
    });
    setActiveFilters([]);
  };

  const applyFilters = (): void => {
    const active: string[] = [];
    Object.entries(selectedFilters).forEach(([key, values]: [string, string[]]) => {
      if (values.length > 0) {
        const filter = filters.find((f: Filter) => f.id === (key as FilterType));
        if (filter) {
          values.forEach((value: string) => {
            const option = filter.options.find((opt: FilterOption) => opt.value === value);
            if (option) {
              active.push(option.label);
            }
          });
        }
      }
    });
    setActiveFilters(active);
    setMobileFiltersOpen(false);
  };

  const sortProducts = (productsToSort: Product[]): Product[] => {
    if (!productsToSort || productsToSort.length === 0) return [];

    const sorted = [...productsToSort];

    switch (sortOption) {
      case "newest":
        return sorted.sort(
          (a: Product, b: Product) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "price-low":
        return sorted.sort((a: Product, b: Product) => a.price - b.price);
      case "price-high":
        return sorted.sort((a: Product, b: Product) => b.price - a.price);
      case "rating":
        return sorted.sort((a: Product, b: Product) => b.rating - a.rating);
      case "bestseller":
        return sorted.sort((a: Product, b: Product) => {
          if (b.isBestSeller && !a.isBestSeller) return 1;
          if (a.isBestSeller && !b.isBestSeller) return -1;
          return 0;
        });
      case "featured":
        return sorted.sort((a: Product, b: Product) => {
          if (b.featured && !a.featured) return 1;
          if (a.featured && !b.featured) return -1;
          return 0;
        });
      default:
        return sorted;
    }
  };

  const filterProducts = (productsToFilter: Product[]): Product[] => {
    if (!productsToFilter || productsToFilter.length === 0) return [];

    return productsToFilter.filter((product: Product) => {
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
        let priceMatch = false;
        const productPrice = product.price || product.minPrice || 0;

        selectedFilters.price.forEach((range: string) => {
          if (range.endsWith("+")) {
            const min = parseInt(range);
            if (productPrice >= min) priceMatch = true;
          } else {
            const [min, max] = range.split("-").map(Number);
            if (productPrice >= min && productPrice <= max) priceMatch = true;
          }
        });
        if (!priceMatch) return false;
      }

      // Only show approved products
      if (product.status !== "approved") {
        return false;
      }

      return true;
    });
  };

  const filteredProducts: Product[] = filterProducts(products);
  const sortedProducts: Product[] = sortProducts(filteredProducts);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <ShopBanner />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <ShopBanner />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900">Error loading products</h3>
            <p className="mt-2 text-gray-500">Please try again later.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <ShopBanner />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NavigationCategory />

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
          selectedFilters={selectedFilters}
          filters={filters}
        />

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
          <DesktopFilter
            filters={filters}
            selectedFilters={selectedFilters}
            clearAllFilters={clearAllFilters}
            toggleFilter={toggleFilter}
            applyFilters={applyFilters}
            activeFilters={activeFilters}
          />

          <ProductGrid
            sortedProducts={sortedProducts}
            clearAllFilters={clearAllFilters}
            filteredProducts={filteredProducts}
            activeFilters={activeFilters}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default ShopPage;

import ProductCard from "@/components/ProductCard";
import React from "react";

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
  featured: boolean;
  isBestSeller: boolean;
  isNewProduct: boolean;
  stock: number;
  sku: string;
  slug: string;
  attributes: any;
  stylist: any;
  stylistName?: string;
  tags: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  isNew: boolean;
}

interface ProductGridProps {
  sortedProducts: Product[];
  clearAllFilters: () => void;
  filteredProducts: Product[];
  activeFilters: string[];
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  sortedProducts,
  clearAllFilters,
  filteredProducts,
  activeFilters,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="lg:col-span-3">
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg"></div>
              <div className="mt-4 space-y-2">
                <div className="bg-gray-200 h-4 rounded"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                <div className="bg-gray-200 h-6 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalProducts = filteredProducts.length;
  const totalStock = filteredProducts.reduce((sum, product) => sum + (product.stock || 0), 0);

  return (
    <div className="lg:col-span-3">
      {/* <div className="mb-6">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{totalProducts}</span>{" "}
          {totalProducts === 1 ? "product" : "products"}
          {activeFilters.length > 0 ? (
            <>
              {" "}
              filtered by: <span className="font-medium">{activeFilters.join(", ")}</span>
            </>
          ) : (
            <>
              {" "}
              in total stock of <span className="font-medium">{totalStock}</span> items
            </>
          )}
        </p>
      </div> */}

      {sortedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
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
          {[1].map((page) => (
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
  );
};

export default ProductGrid;

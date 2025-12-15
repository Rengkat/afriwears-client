"use client";

import { useGetProductsQuery } from "@/redux/services/ProductApi";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
  stylistId?: string;
}

const RelatedProducts = ({ category, currentProductId, stylistId }: RelatedProductsProps) => {
  const { data, isLoading } = useGetProductsQuery({
    category,
    limit: 4,
    featured: "true",
  });

  if (isLoading) {
    return <Loading />;
  }

  const products = data?.products?.filter((p: any) => p._id !== currentProductId) || [];

  if (products.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
        <a
          href={`/products?category=${category}`}
          className="text-amber-600 hover:text-amber-700 font-medium">
          View All
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Also from this stylist */}
      {stylistId && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">More from this Stylist</h2>
            <a
              href={`/stylists/${stylistId}/products`}
              className="text-amber-600 hover:text-amber-700 font-medium">
              View All
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* You would fetch stylist's products here */}
            {/* For now, showing same related products */}
            {products.slice(0, 4).map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;

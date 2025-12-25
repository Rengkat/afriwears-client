"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiShare2,
  FiHeart,
  FiChevronLeft,
  FiTruck,
  FiShield,
  FiShoppingCart,
} from "react-icons/fi";
import { BsStarFill, BsStarHalf, BsHeart, BsHeartFill } from "react-icons/bs";
import { useGetProductDetailQuery } from "@/redux/services/ProductApi";
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfor";
import ProductTabs from "@/components/ProductTabs";
import {
  useAddToCartMutation,
  useGetCartProductsQuery,
  useUpdateCartMutation,
} from "@/redux/services/CartApiSlice";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem } from "@/redux/features/cartSlice";
import { RootState } from "@/redux/Store";
import {
  useAddToWishlistMutation,
  useGetMyWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/redux/services/WishlistApiSlice";

const ProductPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const dispatch = useDispatch();
  const isUserLoggedIn = useSelector((store: RootState) => !!store.authSlice.user);
  console.log(isUserLoggedIn);
  const { data, isLoading, isError } = useGetProductDetailQuery(id);

  // Cart mutations
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [updateCartItem] = useUpdateCartMutation();
  const { data: cartData, refetch: refetchCart } = useGetCartProductsQuery();

  // Wishlist mutations
  const [addToWishlist, { isLoading: isAddingToWishlist }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] =
    useRemoveFromWishlistMutation();
  const { data: wishlistData, refetch: refetchWishlist } = useGetMyWishlistQuery();

  // Get cart state from Redux
  const cartState = useSelector((store: RootState) => store.cartSlice);

  const [selectedImage, setSelectedImage] = useState(0);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartItemId, setCartItemId] = useState(null);

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlistData?.wishlist && data?.product) {
      const isWishlisted = wishlistData.wishlist.items?.some(
        (item) => item.product?._id === data.product._id || item.product === data.product._id
      );
      setIsInWishlist(isWishlisted);
    }
  }, [wishlistData, data]);

  // Check if product is in cart
  useEffect(() => {
    // Check server cart first
    if (cartData?.cart && data?.product) {
      const cartItem = cartData.cart.items?.find(
        (item) => item.product?._id === data.product._id || item.product === data.product._id
      );
      if (cartItem) {
        setIsInCart(true);
        setCartItemId(cartItem._id);
        setQuantity(cartItem.quantity);

        if (cartItem.selectedSize) setSelectedSize(cartItem.selectedSize);
        if (cartItem.selectedColor) setSelectedColor(cartItem.selectedColor);
      } else {
        setIsInCart(false);
        setCartItemId(null);
      }
    } else {
      // Fallback to localStorage if no server cart
      const localCart = localStorage.getItem("cart");
      if (localCart && data?.product) {
        const parsedCart = JSON.parse(localCart);
        const localItem = parsedCart.items?.find(
          (item: any) => item.product?._id === data.product._id || item.product === data.product._id
        );
        if (localItem) {
          setIsInCart(true);
          setQuantity(localItem.quantity);

          // Sync with server if user is logged in
          if (cartData) {
            // Add item to server cart
            addToCart({
              productId: data.product._id,
              quantity: localItem.quantity,
            }).then(() => {
              refetchCart();
            });
          }
        }
      }
    }
  }, [cartData, data]);

  //add to cart handler
  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }

    try {
      const cartItemData = {
        productId: product._id,
        quantity,
      };

      // Get current cart from localStorage for immediate update
      const currentCart = JSON.parse(localStorage.getItem("cart") || '{"items":[]}');

      // Update local cart immediately
      const existingItemIndex = currentCart.items.findIndex(
        (item: any) => item.product?._id === product._id || item.product === product._id
      );

      if (existingItemIndex >= 0) {
        currentCart.items[existingItemIndex].quantity = quantity;
      } else {
        currentCart.items.push({
          _id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          product: product._id,
          quantity,
          price: product.price,
        });
      }

      currentCart.itemCount = currentCart.items.reduce(
        (total: number, item: any) => total + item.quantity,
        0
      );
      currentCart.lastUpdated = Date.now();

      // Save to localStorage immediately
      localStorage.setItem("cart", JSON.stringify(currentCart));

      // Update Redux store
      dispatch(
        addCartItem({
          _id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          product: product._id,
          quantity,
          price: product.price,
        })
      );

      // Call the API if user is logged in
      if (isUserLoggedIn) {
        // You need to check if user is logged in
        await addToCart(cartItemData).unwrap();
        await refetchCart();
      }

      toast.success(isInCart ? "Cart updated successfully!" : "Added to cart successfully!");
      setIsInCart(true);
    } catch (error: any) {
      console.error("Cart error:", error);
      toast.error(error?.data?.message || "Failed to add to cart");
    }
  };
  const handleBuyNow = async () => {
    // For Buy Now, require size selection
    if (isOutOfStock || !selectedSize) {
      toast.error(isOutOfStock ? "Product is out of stock" : "Please select a size");
      return;
    }

    try {
      const cartItemData = {
        productId: product._id,
        quantity,
        selectedSize,
        selectedColor, // optional for Buy Now
      };

      // OPTIMISTIC UPDATE for Buy Now
      dispatch(
        addCartItem({
          _id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          product: product._id,
          quantity,
          selectedSize,
          selectedColor,
          price: product.price,
          isBuyNow: true,
        })
      );

      // Add to cart first
      await addToCart(cartItemData).unwrap();

      // Refresh cart and go to checkout
      await refetchCart();
      router.push("/checkout");
    } catch (error: any) {
      console.error("Buy now error:", error);
      toast.error(error?.data?.message || "Failed to proceed to checkout");
    }
  };

  const handleWishlistToggle = async () => {
    if (isInWishlist) {
      // Remove from wishlist
      try {
        await removeFromWishlist(product._id).unwrap();
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
        await refetchWishlist();
      } catch (error) {
        console.error("Remove from wishlist error:", error);
        toast.error(error?.data?.message || "Failed to remove from wishlist");
      }
    } else {
      // Add to wishlist
      try {
        // await addToWishlist({ productId: product._id }).unwrap();
        console.log("productId:", product?._id);
        setIsInWishlist(true);
        toast.success("Added to wishlist!");
        await refetchWishlist();
      } catch (error) {
        console.error("Add to wishlist error:", error);
        toast.error(error?.data?.message || "Failed to add to wishlist");
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Stylista!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.product) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const product = data.product;
  const images = [product.mainImage, ...(product.subImages || [])].filter(Boolean);
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-amber-600 transition-colors">
              Products
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-amber-600 transition-colors capitalize">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Product Images */}
          <div className="lg:w-1/2">
            <ProductImages
              images={images}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              product={product}
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:w-1/2">
            {/* Back Button for Mobile */}
            <div className="lg:hidden mb-4">
              <Link
                href="/products"
                className="inline-flex items-center text-gray-600 hover:text-gray-900">
                <FiChevronLeft className="mr-2" />
                Back to Products
              </Link>
            </div>

            {/* Product Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    title="share"
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <FiShare2 size={20} />
                  </button>
                  <button
                    onClick={handleWishlistToggle}
                    disabled={isAddingToWishlist || isRemovingFromWishlist}
                    title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    className={`p-2 transition-colors ${
                      isInWishlist
                        ? "text-red-500 hover:text-red-600"
                        : "text-gray-400 hover:text-red-500"
                    } ${
                      isAddingToWishlist || isRemovingFromWishlist
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}>
                    {isAddingToWishlist || isRemovingFromWishlist ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                    ) : isInWishlist ? (
                      <BsHeartFill size={20} />
                    ) : (
                      <FiHeart size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Stylist Info */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500">By</span>
                <Link
                  href={`/stylists/${product.stylist?._id}`}
                  className="text-sm font-medium text-amber-600 hover:text-amber-700">
                  {product.stylist?.companyName || "Unknown Stylist"}
                </Link>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <BsStarFill
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(product.rating || 0) ? "text-amber-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {product.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <Link href="#reviews" className="text-sm text-gray-500 hover:text-amber-600">
                  ({product.reviewCount || product.reviews?.length || 0} reviews)
                </Link>
                {product.isBestSeller && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Best Seller
                  </span>
                )}
                {product.isNewProduct && (
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    New
                  </span>
                )}
                {product.featured && (
                  <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ₦{product.price?.toLocaleString()}
                  </span>
                  {product.minPrice &&
                    product.maxPrice &&
                    product.minPrice !== product.maxPrice && (
                      <>
                        <span className="text-sm text-gray-500">
                          (From ₦{product.minPrice?.toLocaleString()})
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded">
                          Custom Pricing
                        </span>
                      </>
                    )}
                </div>
                <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>
            </div>

            {/* Product Info Component */}
            <ProductInfo
              product={product}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              quantity={quantity}
              setQuantity={setQuantity}
              showMeasurements={showMeasurements}
              setShowMeasurements={setShowMeasurements}
            />

            {/* Stock Status */}
            <div className="mb-6">
              {isOutOfStock ? (
                <div className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg">
                  <span className="font-medium">Out of Stock</span>
                </div>
              ) : product.stock < 10 ? (
                <div className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-lg">
                  <span className="font-medium">Only {product.stock} left in stock</span>
                </div>
              ) : (
                <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                  <span className="font-medium">In Stock ({product.stock} available)</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isOutOfStock || isAddingToCart
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-700 text-white"
                }`}>
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : isInCart ? (
                  <>
                    <FiShoppingCart />
                    Update Cart ({quantity})
                  </>
                ) : (
                  <>
                    <FiShoppingCart />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock || !selectedSize}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                  isOutOfStock || !selectedSize
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-black text-white"
                }`}>
                {isOutOfStock ? "Unavailable" : "Buy Now"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <FiTruck className="text-gray-400" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiShield className="text-gray-400" />
                  <span className="text-sm text-gray-600">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">Returns Accepted</span>
                </div>
              </div>
            </div>

            {/* Stylist Card */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {product.stylist?.avatar && (
                  <Image
                    src={product.stylist.avatar}
                    alt={product.stylist.companyName}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">{product.stylist?.companyName}</h3>
                  <p className="text-sm text-gray-500">
                    {product.stylist?.location?.state || "Nigeria"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Specializes in: {product.stylist?.specialty?.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        {product.description && (
          <div className="mt-12">
            <ProductTabs product={product} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;

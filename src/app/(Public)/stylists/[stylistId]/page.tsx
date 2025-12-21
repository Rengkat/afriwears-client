"use client";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import {
  BsInstagram,
  BsTelephoneFill,
  BsPinterest,
  BsStarFill,
  BsStarHalf,
  BsChatDots,
  BsBag,
  BsImages,
} from "react-icons/bs";
import { FaTwitter, FaFacebookSquare, FaMapMarkerAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import {
  useGetStylistDetailQuery,
  useGetStylistProductsQuery,
} from "@/redux/services/StylistApiSlice";
import { formatCurrency } from "@/Utils/utils";
import { Skeleton } from "@mui/material";

interface SellerPageProps {
  params: Promise<{
    stylistId: string;
  }>;
}

const SellerPage = ({ params }: SellerPageProps) => {
  // Unwrap params with React.use() for Next.js 15
  const { stylistId } = use(params);

  // Fetch stylist data
  const {
    data: stylistData,
    isLoading: isLoadingStylist,
    isError: isStylistError,
  } = useGetStylistDetailQuery(stylistId, {
    skip: !stylistId,
  });

  // Fetch products by this stylist
  const { data: productsData, isLoading: isLoadingProducts } = useGetStylistProductsQuery(
    stylistId,
    {
      skip: !stylistId,
    }
  );

  const stylist = stylistData?.stylist;
  const products = productsData?.products || [];
  const totalProducts = productsData?.total || 0;
  const hasProducts = !isLoadingProducts && products.length > 0;
  const hasPortfolio = stylist?.portfolio && stylist.portfolio.length > 0;

  // Format specialties
  const specialties = Array.isArray(stylist?.specialty) ? stylist.specialty : [];

  // Format location
  const getLocationString = () => {
    if (!stylist?.location) return "Location not specified";

    const { address, lga, state } = stylist.location;
    const parts = [address, lga, state].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Location not specified";
  };

  // Social media URLs
  const socialMedia = stylist?.socialMedia || {};
  const twitterUrl = socialMedia.twitter
    ? socialMedia.twitter.startsWith("http")
      ? socialMedia.twitter
      : `https://twitter.com/${socialMedia.twitter}`
    : null;

  const facebookUrl = socialMedia.facebook
    ? socialMedia.facebook.startsWith("http")
      ? socialMedia.facebook
      : `https://facebook.com/${socialMedia.facebook}`
    : null;

  const instagramUrl = socialMedia.instagram
    ? socialMedia.instagram.startsWith("http")
      ? socialMedia.instagram
      : `https://instagram.com/${socialMedia.instagram}`
    : null;

  const pinterestUrl = socialMedia.pinterest
    ? socialMedia.pinterest.startsWith("http")
      ? socialMedia.pinterest
      : `https://pinterest.com/${socialMedia.pinterest}`
    : null;

  // Loading state
  if (isLoadingStylist) {
    return (
      <div className="bg-gray-50 min-h-screen pb-16">
        <div className="relative bg-gray-900 text-white h-64">
          <Skeleton className="absolute inset-0" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3 space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
            <div className="w-full lg:w-1/3 space-y-6">
              <Skeleton className="h-96 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isStylistError || !stylist) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Stylist Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the stylist profile you're looking for.
          </p>
          <Link
            href="/stylists"
            className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
            Browse Verified Stylists
          </Link>
        </div>
      </div>
    );
  }

  // Handle chat click (placeholder for now)
  const handleChatClick = () => {
    // TODO: Implement chat functionality
    // For now, show a message that chat is coming soon
    alert("Chat functionality is coming soon! You'll be able to message this stylist directly.");
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white h-64">
        {stylist.banner ? (
          <Image
            src={stylist.banner}
            alt={`${stylist.companyName} banner`}
            fill
            className="object-cover opacity-70"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
        )}
        <div className="relative z-10 h-full flex flex-col justify-end items-start p-8">
          <h1 className="text-3xl md:text-4xl font-bold">{stylist.companyName}</h1>
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => {
              if (i < Math.floor(stylist.rating || 0)) {
                return <BsStarFill key={i} className="text-amber-400 mr-1" />;
              }
              if (i === Math.floor(stylist.rating || 0) && (stylist.rating || 0) % 1 >= 0.5) {
                return <BsStarHalf key={i} className="text-amber-400 mr-1" />;
              }
              return <BsStarFill key={i} className="text-gray-400 mr-1" />;
            })}
            <span className="ml-2 text-amber-400">
              {stylist.rating?.toFixed(1) || "0.0"}
              {stylist.reviews > 0 && ` (${stylist.reviews} reviews)`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="flex flex-col lg:flex-row mt-24 gap-8">
          {/* Left Column */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  {stylist.avatar ? (
                    <div className="relative w-40 h-40">
                      <Image
                        src={stylist.avatar}
                        alt={stylist.companyName}
                        fill
                        className="rounded-full border-4 border-white shadow-md object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                      <span className="text-amber-600 text-2xl font-bold">
                        {stylist.companyName?.charAt(0) || "S"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{stylist.companyName}</h2>
                      {stylist.isCompanyVerified && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 mt-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Verified Company
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-amber-600 font-medium mb-3 mt-2">
                    {stylist.experience || "Not specified"} experience
                  </p>

                  <p className="text-gray-600 mb-4">
                    {stylist.description || "No description provided."}
                  </p>

                  {specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {specialties.map((specialty, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Products for Sale {totalProducts > 0 && `(${totalProducts})`}
                  </h3>
                  {totalProducts > 0 && (
                    <Link
                      href={`/stylists/${stylistId}/products`}
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                      View all products →
                    </Link>
                  )}
                </div>

                {isLoadingProducts ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                  </div>
                ) : hasProducts ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {products.slice(0, 8).map((product) => (
                        <Link
                          key={product._id}
                          href={`/products/${product._id}`}
                          className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative aspect-square bg-gray-100">
                            {product.mainImage ? (
                              <Image
                                src={product.mainImage}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-sm">No image</span>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-gray-900 truncate text-sm">
                              {product.name}
                            </h4>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-amber-600 font-bold">
                                {formatCurrency(product.price)}
                              </span>
                              {product.rating > 0 && (
                                <div className="flex items-center gap-1">
                                  <BsStarFill className="text-amber-400" size={12} />
                                  <span className="text-xs text-gray-600">
                                    {product.rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {totalProducts > 8 && (
                      <div className="text-center mt-6">
                        <Link
                          href={`/stylists/${stylistId}/products`}
                          className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 font-medium">
                          View all {totalProducts} products
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                      <BsBag className="text-amber-600 text-2xl" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Products Yet</h4>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      {stylist.companyName} hasn't added any products to their store yet. Check back
                      soon or contact them for custom orders.
                    </p>
                    <button
                      onClick={handleChatClick}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium">
                      <BsChatDots />
                      Message Stylist
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Work Samples (Portfolio) */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Work Samples {hasPortfolio && `(${stylist.portfolio.length})`}
                </h3>

                {hasPortfolio ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {stylist.portfolio.map((item, index) => (
                      <div key={index} className="group relative rounded-lg overflow-hidden h-48">
                        <Image
                          src={item.image || "/portfolio-placeholder.jpg"}
                          alt={`Work sample ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                        {item.category && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                            <span className="text-white text-sm font-medium">{item.category}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <BsImages className="text-blue-600 text-2xl" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Work Samples</h4>
                    <p className="text-gray-600 max-w-md mx-auto">
                      {stylist.companyName} hasn't uploaded any work samples to their portfolio yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
                  <button
                    onClick={handleChatClick}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                    <BsChatDots />
                    Chat
                  </button>
                </div>

                {stylist.phone && (
                  <a
                    href={`tel:${stylist.phone}`}
                    className="flex items-center justify-between w-full rounded-lg bg-gray-100 hover:bg-gray-200 font-medium text-gray-800 py-3 px-4 transition-colors mb-4">
                    <div className="flex items-center gap-3">
                      <BsTelephoneFill className="text-gray-600" />
                      <span>{stylist.phone}</span>
                    </div>
                    <span className="text-xs text-gray-500">Call</span>
                  </a>
                )}

                {stylist.email && (
                  <a
                    href={`mailto:${stylist.email}`}
                    className="flex items-center justify-between w-full rounded-lg bg-blue-50 hover:bg-blue-100 font-medium text-blue-700 py-3 px-4 transition-colors mb-6">
                    <div className="flex items-center gap-3">
                      <IoMdMail className="text-blue-600" />
                      <span>Send Email</span>
                    </div>
                    <span className="text-xs text-blue-500">Email</span>
                  </a>
                )}

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Location</h4>
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700">{getLocationString()}</p>
                      {stylist.location?.branches > 1 && (
                        <p className="text-sm text-gray-500 mt-1">
                          {stylist.location.branches} branch
                          {stylist.location.branches > 1 ? "es" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                {(twitterUrl || facebookUrl || instagramUrl || pinterestUrl) && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Connect</h4>
                    <div className="flex gap-4">
                      {twitterUrl && (
                        <a
                          href={twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-500 transition-colors">
                          <FaTwitter size={24} />
                        </a>
                      )}
                      {facebookUrl && (
                        <a
                          href={facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 transition-colors">
                          <FaFacebookSquare size={24} />
                        </a>
                      )}
                      {instagramUrl && (
                        <a
                          href={instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-700 transition-colors">
                          <BsInstagram size={24} />
                        </a>
                      )}
                      {pinterestUrl && (
                        <a
                          href={pinterestUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-700 transition-colors">
                          <BsPinterest size={24} />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {stylist.website && (
                  <div>
                    <a
                      href={stylist.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium group">
                      Visit website
                      <svg
                        className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Company Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{stylist.experience || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center">
                      <BsStarFill className="text-amber-400 mr-1" />
                      <span className="font-medium">{stylist.rating?.toFixed(1) || "0.0"}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reviews</span>
                    <span className="font-medium">{stylist.reviews || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Products</span>
                    <span className="font-medium">{totalProducts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Branches</span>
                    <span className="font-medium">{stylist.location?.branches || 1}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Verification</span>
                    <span className="font-medium capitalize">
                      {stylist.verificationStatus || "Not verified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            {stylist.services && stylist.services.length > 0 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {stylist.services.map((service, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;

"use client";
import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { useGetStylistsQuery } from "@/redux/services/StylistApiSlice";
import Hero from "./StylistsHero";
import StylistList from "./StylistList";
import ResetFilter from "./ResetFilter";

// Interface for stylist data based on your API response
interface ApiStylist {
  _id: string;
  companyName: string;
  description: string;
  experience: string;
  rating: number;
  reviews: number;
  services: string[];
  location: {
    state: string;
    lga: string;
    address: string;
    branches: number;
  };
  avatar: string;
  banner: string;
  isCompanyVerified: boolean;
  verificationStatus: string;
  specialty: string;
  slug: string;
  owner: {
    _id: string;
    firstName: string;
    surname: string;
    email: string;
    name: string;
  };
  email: string;
  phone: string;
  status: string;
}

// Interface for UI stylist data
interface UIStylist {
  id: string;
  company: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  experience: string;
  image: string;
  services: string[];
  description: string;
  slug: string;
  isVerified: boolean;
}

// Interface for API response
interface ApiResponse {
  success: boolean;
  fromCache: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  stylists: ApiStylist[];
}

// Service filters
const serviceFilters = [
  { id: "all", name: "All Services" },
  { id: "traditional", name: "Traditional" },
  { id: "corporate", name: "Corporate" },
  { id: "casual", name: "Casual Wear" },
  { id: "bridal", name: "Bridal" },
  { id: "formal", name: "Formal Wear" },
];

const StylistsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Debounce search
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  // Prepare query parameters
  const queryParams = {
    company: activeFilter === "all" ? debouncedSearchTerm : "",
    specialty: activeFilter !== "all" ? activeFilter : "",
    page,
    limit,
    isCompanyVerified: "true", // Always fetch verified stylists
  };

  // Fetch stylists from API
  const { data, isLoading, isError, error } = useGetStylistsQuery(queryParams);

  // Type cast the response
  const apiData = data as ApiResponse | undefined;

  // Filter and map API data to UI format
  const formattedStylists: UIStylist[] = (apiData?.stylists || [])
    .filter((stylist) => stylist.isCompanyVerified && stylist.status === "active")
    .map((stylist) => ({
      id: stylist._id,
      company: stylist.companyName,
      specialty: stylist.specialty || "Fashion Styling",
      rating: stylist.rating || 0,
      reviews: stylist.reviews || 0,
      location: stylist.location?.state
        ? stylist.location.state + (stylist.location.lga ? `, ${stylist.location.lga}` : "")
        : "Location not specified",
      experience: stylist.experience || "Not specified",
      image: stylist.avatar || "/stylist-placeholder.jpg",
      services: stylist.services || [],
      description: stylist.description,
      slug: stylist.slug,
      isVerified: stylist.isCompanyVerified,
    }));

  const totalItems = apiData?.total || 0;
  const totalPages = apiData?.pages || 1;

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle filter change
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    setPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search verified stylists..."
              className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {serviceFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeFilter === filter.id
                    ? "bg-amber-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}>
                {filter.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-60 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          // Error State
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to load stylists</h3>
              <p className="text-red-600 mb-4">
                {error?.data?.message || "Please try again later"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                Retry
              </button>
            </div>
          </div>
        ) : formattedStylists.length > 0 ? (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{formattedStylists.length}</span> of{" "}
                <span className="font-semibold">{totalItems}</span> verified stylists
              </p>
            </div>

            {/* Stylists Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {formattedStylists.map((stylist) => (
                <StylistList key={stylist.id} stylist={stylist} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          // No Results State
          <ResetFilter
            setActiveFilter={setActiveFilter}
            setSearchTerm={setSearchTerm}
            setPage={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default StylistsPage;

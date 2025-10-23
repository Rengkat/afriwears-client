"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiStar, FiMapPin } from "react-icons/fi";
import { BsArrowRight } from "react-icons/bs";
import { useGetStylistsQuery } from "@/redux/services/StylistApiSlice";
import Hero from "./StylistsHero";

// Mock data for stylists
const mockStylists = [
  {
    id: "1",
    company: "Amina Couture",
    specialty: "Bridal & Formal Wear",
    rating: 4.8,
    reviews: 124,
    location: "Lagos, Nigeria",
    experience: "8 years",
    image: "/stylist1.jpg",
    services: ["Custom Dresses", "Bridal Wear", "Ankara Designs"],
  },
  {
    id: "2",
    company: "Kente Royalty",
    specialty: "Traditional African Wear",
    rating: 4.9,
    reviews: 215,
    location: "Accra, Ghana",
    experience: "12 years",
    image: "/stylist2.jpg",
    services: ["Kente Outfits", "Agbada", "Corporate Traditional"],
  },
  {
    id: "3",
    company: "Zainab Stitches",
    specialty: "Modern African Fashion",
    rating: 4.7,
    reviews: 178,
    location: "Nairobi, Kenya",
    experience: "6 years",
    image: "/stylist3.jpg",
    services: ["Contemporary Styles", "Fusion Wear", "Ready-to-Wear"],
  },
  {
    id: "4",
    company: "Adire Elegance",
    specialty: "Hand-dyed Fabrics",
    rating: 4.9,
    reviews: 267,
    location: "Abuja, Nigeria",
    experience: "10 years",
    image: "/stylist4.jpg",
    services: ["Adire Dresses", "Custom Prints", "Accessories"],
  },
  {
    id: "5",
    company: "Nneka Designs",
    specialty: "Casual & Everyday Wear",
    rating: 4.6,
    reviews: 92,
    location: "Cape Town, South Africa",
    experience: "5 years",
    image: "/stylist5.jpg",
    services: ["Ankara Casual", "Office Wear", "Modern Traditional"],
  },
  {
    id: "6",
    company: "Royal Stitches",
    specialty: "Men's Formal Wear",
    rating: 4.8,
    reviews: 156,
    location: "Kano, Nigeria",
    experience: "9 years",
    image: "/stylist6.jpg",
    services: ["Agbada", "Corporate Suits", "Traditional Menswear"],
  },
  {
    id: "7",
    company: "Silk & Lace",
    specialty: "Luxury Evening Wear",
    rating: 4.9,
    reviews: 203,
    location: "Dakar, Senegal",
    experience: "7 years",
    image: "/stylist7.jpg",
    services: ["Evening Gowns", "Beaded Dresses", "Custom Embroidery"],
  },
  {
    id: "8",
    company: "Heritage Designs",
    specialty: "Cultural Attire",
    rating: 5.0,
    reviews: 342,
    location: "Kumasi, Ghana",
    experience: "15 years",
    image: "/stylist8.jpg",
    services: ["Traditional Outfits", "Cultural Festivals", "Royal Attire"],
  },
];

const StylistsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useGetStylistsQuery({
    company: "",
    specialty: "",
    page,
    limit,
  });

  const filteredStylists = mockStylists.filter((stylist) => {
    const matchesSearch =
      stylist.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stylist.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "all" ||
      stylist.services.some((service) =>
        service.toLowerCase().includes(activeFilter.toLowerCase())
      );

    return matchesSearch && matchesFilter;
  });

  const serviceFilters = [
    { id: "all", name: "All Services" },
    { id: "traditional", name: "Traditional" },
    { id: "corporate", name: "Corporate" },
    { id: "casual", name: "Casual Wear" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <Hero />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-12">
          <div className="relative max-w-xl mx-auto mb-8">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stylists by name or specialty..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {serviceFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeFilter === filter.id
                    ? "bg-amber-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}>
                {filter.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stylists Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredStylists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredStylists.map((stylist) => (
              <div
                key={stylist.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/stylists/${stylist.id}`}>
                  <div className="relative h-60">
                    <Image
                      src={stylist.image}
                      alt={stylist.company}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-white">
                        <FiStar className="text-amber-300" />
                        <span className="font-medium">{stylist.rating}</span>
                        <span className="text-sm opacity-80">({stylist.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{stylist.company}</h3>
                    <p className="text-amber-600 font-medium mb-2">{stylist.specialty}</p>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <FiMapPin className="mr-1" />
                      <span>{stylist.location}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{stylist.experience} experience</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {stylist.services.slice(0, 3).map((service, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          {service}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-amber-600 font-medium group">
                      <span className="group-hover:underline">View portfolio</span>
                      <BsArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <FiSearch className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stylists found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none">
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StylistsPage;

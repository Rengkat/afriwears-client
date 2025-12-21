"use client";
import Image from "next/image";
import Link from "next/link";
import { BsInstagram, BsTelephoneFill, BsPinterest, BsStarFill, BsStarHalf } from "react-icons/bs";
import { FaTwitter, FaFacebookSquare, FaMapMarkerAlt } from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";
import ChatBtn from "./chatBtn";
import { useGetStylistDetailQuery } from "@/redux/services/StylistApiSlice";
import { useParams } from "next/navigation";

// Mock data for stylist portfolio and reviews
const mockPortfolio = [
  { id: 1, image: "/portfolio1.jpg", category: "Bridal Wear" },
  { id: 2, image: "/portfolio2.jpg", category: "Traditional" },
  { id: 3, image: "/portfolio3.jpg", category: "Corporate" },
  { id: 4, image: "/portfolio4.jpg", category: "Casual" },
  { id: 5, image: "/portfolio5.jpg", category: "Bridal Wear" },
  { id: 6, image: "/portfolio6.jpg", category: "Traditional" },
];

const mockReviews = [
  {
    id: 1,
    user: "Amina Johnson",
    rating: 5,
    comment: "Absolutely stunning work on my wedding dress! Attention to detail was impeccable.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    user: "Chinedu Okoro",
    rating: 4.5,
    comment: "Great quality fabrics and perfect fitting. Will definitely order again.",
    date: "1 month ago",
  },
  {
    id: 3,
    user: "Fatima Diallo",
    rating: 5,
    comment: "The designs are so unique and authentically African. Love working with this stylist!",
    date: "2 months ago",
  },
];

const SellerPage = async () => {
  const { stylistId } = useParams();
  const { data } = useGetStylistDetailQuery(stylistId, {
    // refetchOnMountOrArgChange: true,
  });
  console.log(stylistId, data);
  // In a real app, you would fetch this data
  const stylist = {
    id: params.stylistId,
    company: "Amina Couture",
    firstName: "Amina",
    surname: "Mohammed",
    phone: "+2348012345678",
    website: "https://aminacouture.africa",
    companyDescription:
      "Specializing in bespoke African fashion for over 10 years. We create unique, culturally-inspired designs that blend traditional techniques with contemporary styles for the modern African woman.",
    companyAddress: "25 Fashion Avenue, Victoria Island",
    state: "Lagos",
    branches: 3,
    products: 28,
    rating: 4.8,
    twitter: "https://twitter.com/aminacouture",
    pintrest: "https://pinterest.com/aminacouture",
    email: "contact@aminacouture.africa",
    facebook: "https://facebook.com/aminacouture",
    instagram: "https://instagram.com/aminacouture",
    specialties: ["Bridal Wear", "Traditional Outfits", "Corporate Attire"],
    experience: "10+ years",
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white h-64">
        <Image
          src="/stylist-banner.jpg"
          alt={`${stylist.company} banner`}
          fill
          className="object-cover opacity-70"
        />
        <div className="relative z-10 h-full flex flex-col justify-end items-start p-8">
          <h1 className="text-3xl md:text-4xl font-bold">{stylist.company}</h1>
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => {
              if (i < Math.floor(stylist.rating)) {
                return <BsStarFill key={i} className="text-amber-400 mr-1" />;
              }
              if (i === Math.floor(stylist.rating) && stylist.rating % 1 >= 0.5) {
                return <BsStarHalf key={i} className="text-amber-400 mr-1" />;
              }
              return <BsStarFill key={i} className="text-gray-400 mr-1" />;
            })}
            <span className="ml-2 text-amber-400">
              {stylist.rating} ({stylist.products}+ orders)
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Image
                    src="/stylist-profile.jpg"
                    width={160}
                    height={160}
                    alt={stylist.company}
                    className="rounded-full border-4 border-white shadow-md"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {stylist.firstName} {stylist.surname}
                  </h2>
                  <p className="text-amber-600 font-medium mb-3">{stylist.experience} experience</p>
                  <p className="text-gray-600 mb-4">{stylist.companyDescription}</p>
                  <div className="flex flex-wrap gap-2">
                    {stylist.specialties.map((specialty, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Portfolio</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mockPortfolio.map((item) => (
                    <div key={item.id} className="group relative rounded-lg overflow-hidden h-48">
                      <Image
                        src={item.image}
                        alt={`${stylist.company} portfolio - ${item.category}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                        <span className="text-white text-sm font-medium">{item.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{review.user}</h4>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => {
                          if (i < Math.floor(review.rating)) {
                            return <BsStarFill key={i} className="text-amber-400 mr-1" />;
                          }
                          if (i === Math.floor(review.rating) && review.rating % 1 >= 0.5) {
                            return <BsStarHalf key={i} className="text-amber-400 mr-1" />;
                          }
                          return <BsStarFill key={i} className="text-gray-300 mr-1" />;
                        })}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact/Sidebar */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Stylist</h3>

                {/* <ChatBtn stylist={stylist} /> */}

                <a
                  href={`tel:${stylist.phone}`}
                  className="flex items-center justify-center gap-3 text-center w-full rounded-lg bg-gray-100 hover:bg-gray-200 font-medium text-gray-800 py-3 px-4 mt-4 transition-colors">
                  <BsTelephoneFill /> <span>{stylist.phone}</span>
                </a>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Location</h4>
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p>{stylist.companyAddress}</p>
                      <p className="text-gray-500">{stylist.state}</p>
                      {stylist.branches > 1 && (
                        <p className="text-sm text-gray-500 mt-1">
                          {stylist.branches} branches nationwide
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Connect</h4>
                  <div className="flex gap-4">
                    {stylist.twitter && (
                      <a href={stylist.twitter} className="text-blue-400 hover:text-blue-500">
                        <FaTwitter size={24} />
                      </a>
                    )}
                    {stylist.facebook && (
                      <a href={stylist.facebook} className="text-blue-600 hover:text-blue-700">
                        <FaFacebookSquare size={24} />
                      </a>
                    )}
                    {stylist.instagram && (
                      <a href={stylist.instagram} className="text-pink-600 hover:text-pink-700">
                        <BsInstagram size={24} />
                      </a>
                    )}
                    {stylist.pintrest && (
                      <a href={stylist.pintrest} className="text-red-600 hover:text-red-700">
                        <BsPinterest size={24} />
                      </a>
                    )}
                  </div>
                </div>

                {stylist.website && (
                  <div className="mt-6">
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
                          d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Stylist Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{stylist.experience}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Products</span>
                    <span className="font-medium">{stylist.products}+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center">
                      <BsStarFill className="text-amber-400 mr-1" />
                      <span className="font-medium">{stylist.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Branches</span>
                    <span className="font-medium">{stylist.branches}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { FiMapPin, FiStar, FiCheckCircle, FiTag } from "react-icons/fi";

interface Stylist {
  id: string;
  company: string;
  specialty: string;
  specialtyArray?: string[];
  rating: number;
  reviews: number;
  location: string;
  experience: string;
  image: string;
  services: string[];
  slug: string;
  isVerified: boolean;
}

interface StylistListProps {
  stylist: Stylist;
}

const StylistList = ({ stylist }: StylistListProps) => {
  // Parse specialty string back to array for display
  const specialties =
    stylist.specialtyArray || (stylist.specialty ? stylist.specialty.split(", ") : []);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
      <Link href={`/stylists/${stylist.slug || stylist.id}`} className="flex-1 flex flex-col">
        <div className="relative h-60">
          <Image
            src={stylist.image || "/stylist-placeholder.jpg"}
            alt={stylist.company}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

          {/* Verified Badge */}
          {stylist.isVerified && (
            <div className="absolute top-4 left-4 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-md">
              <FiCheckCircle className="text-green-600" />
              Verified
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-white">
              <FiStar className="text-amber-300" />
              <span className="font-bold text-lg">{stylist.rating.toFixed(1)}</span>
              <span className="text-sm opacity-90">
                ({stylist.reviews} {stylist.reviews === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-3">
            <h3 className="text-xl font-bold text-gray-900 mb-1.5 line-clamp-1">
              {stylist.company}
            </h3>

            {/* Specialties as tags */}
            <div className="mb-2">
              {specialties.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {specialties.slice(0, 2).map((spec, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      <FiTag size={10} />
                      {spec}
                    </span>
                  ))}
                  {specialties.length > 2 && (
                    <span className="text-xs text-gray-500">+{specialties.length - 2} more</span>
                  )}
                </div>
              ) : (
                <p className="text-amber-600 font-medium text-sm">Fashion Stylist</p>
              )}
            </div>
          </div>

          <div className="flex items-center text-gray-500 text-sm mb-4">
            <FiMapPin className="mr-1.5 flex-shrink-0" />
            <span className="line-clamp-1">{stylist.location}</span>
          </div>

          <p className="text-gray-600 mb-4">
            <span className="font-medium">Experience:</span> {stylist.experience}
          </p>

          {stylist.services && stylist.services.length > 0 && (
            <div className="mb-5">
              <div className="flex flex-wrap gap-2">
                {stylist.services.slice(0, 3).map((service, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                    {service}
                  </span>
                ))}
                {stylist.services.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-500">
                    +{stylist.services.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center text-amber-600 font-medium group-hover:text-amber-700 transition-colors">
              <span className="group-hover:underline">View profile</span>
              <BsArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default StylistList;

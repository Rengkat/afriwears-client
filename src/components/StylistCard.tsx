"use client";

import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle, FiStar, FiPackage, FiMapPin } from "react-icons/fi";

interface StylistCardProps {
  stylist: any;
}

const StylistCard = ({ stylist }: StylistCardProps) => {
  if (!stylist) return null;

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow">
          <Image
            src={stylist.avatar || "/avatar.jpg"}
            alt={stylist.name || "Stylist"}
            fill
            className="object-cover"
          />
          {stylist.verified && (
            <div className="absolute bottom-0 right-0 bg-green-500 text-white p-1 rounded-full">
              <FiCheckCircle size={16} />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900">{stylist.name}</h3>
              {stylist.companyName && (
                <p className="text-sm text-gray-600">{stylist.companyName}</p>
              )}

              <div className="flex items-center gap-4 mt-2">
                {stylist.rating && (
                  <div className="flex items-center gap-1">
                    <FiStar className="text-amber-500" />
                    <span className="text-sm font-medium">{stylist.rating.toFixed(1)}</span>
                  </div>
                )}

                {stylist.productCount && (
                  <div className="flex items-center gap-1">
                    <FiPackage className="text-gray-400" />
                    <span className="text-sm text-gray-600">{stylist.productCount} products</span>
                  </div>
                )}

                {stylist.location && (
                  <div className="flex items-center gap-1">
                    <FiMapPin className="text-gray-400" />
                    <span className="text-sm text-gray-600">{stylist.location}</span>
                  </div>
                )}
              </div>
            </div>

            <Link
              href={`/stylists/${stylist._id}`}
              className="px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 border border-amber-200 hover:border-amber-300 rounded-lg transition-colors">
              View Profile
            </Link>
          </div>

          {stylist.bio && <p className="mt-3 text-gray-600 text-sm line-clamp-2">{stylist.bio}</p>}

          <div className="flex flex-wrap gap-2 mt-3">
            {stylist.specialties?.slice(0, 3).map((specialty: string) => (
              <span
                key={specialty}
                className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200">
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StylistCard;

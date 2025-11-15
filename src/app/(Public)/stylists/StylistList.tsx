import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { FiMapPin, FiStar } from "react-icons/fi";

const StylistList = ({ stylist }: any) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/stylists/${stylist.id}`}>
        <div className="relative h-60">
          <Image src={stylist.image} alt={stylist.company} fill className="object-cover" />
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
  );
};

export default StylistList;

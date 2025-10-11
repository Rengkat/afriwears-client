"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsHeart, BsHeartFill, BsEye, BsArrowRight } from "react-icons/bs";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const mockLadiesProducts = [
  {
    id: "1",
    name: "Adire Elegance Dress",
    slug: "adire-elegance-dress",
    image: "/ladies-dress-1.jpg",
    price: 25000,
    originalPrice: 32000,
    stylist: "Zainab Couture",
    colors: ["indigo", "crimson", "gold"],
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    name: "Ankara Jumpsuit",
    slug: "ankara-jumpsuit",
    image: "/ladies-dress-2.jpg",
    price: 18000,
    originalPrice: 22000,
    stylist: "Nneka Designs",
    colors: ["blue", "yellow", "green"],
    rating: 4.5,
    reviews: 87,
  },
  {
    id: "3",
    name: "Lace Buba Set",
    slug: "lace-buba-set",
    image: "/ladies-dress-3.jpg",
    price: 35000,
    originalPrice: 42000,
    stylist: "Amina Collections",
    colors: ["ivory", "gold", "peach"],
    rating: 4.9,
    reviews: 215,
  },
  {
    id: "4",
    name: "Kente Wrap Dress",
    slug: "kente-wrap-dress",
    image: "/ladies-dress-4.jpg",
    price: 28000,
    originalPrice: 35000,
    stylist: "Kosi Creations",
    colors: ["red", "gold", "black"],
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "5",
    name: "Modern Iro & Buba",
    slug: "modern-iro-buba",
    image: "/ladies-dress-5.jpg",
    price: 22000,
    originalPrice: 28000,
    stylist: "Zainab Couture",
    colors: ["navy", "white", "silver"],
    rating: 4.6,
    reviews: 92,
  },
  {
    id: "6",
    name: "Silk Adire Gown",
    slug: "silk-adire-gown",
    image: "/ladies-dress-6.jpg",
    price: 40000,
    originalPrice: 48000,
    stylist: "Amina Collections",
    colors: ["purple", "teal", "gold"],
    rating: 4.9,
    reviews: 203,
  },
  {
    id: "7",
    name: "Gele & Dress Set",
    slug: "gele-dress-set",
    image: "/ladies-dress-7.jpg",
    price: 32000,
    originalPrice: 38000,
    stylist: "Kosi Creations",
    colors: ["blue", "orange", "white"],
    rating: 4.7,
    reviews: 178,
  },
  {
    id: "8",
    name: "Beaded Dinner Dress",
    slug: "beaded-dinner-dress",
    image: "/ladies-dress-8.jpg",
    price: 45000,
    originalPrice: 52000,
    stylist: "Nneka Designs",
    colors: ["black", "gold", "red"],
    rating: 5.0,
    reviews: 267,
  },
];

const RecentProducts = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Ladies' Collections
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our newest African-inspired designs that blend tradition with contemporary
            fashion
          </motion.p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockLadiesProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12">
          <Link href="/products/ladies">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors">
              View All Ladies' Wear
              <BsArrowRight size={18} />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default RecentProducts;

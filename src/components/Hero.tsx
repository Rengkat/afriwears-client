"use client";
import React from "react";
import SubHero from "./SubHero";
import Image from "next/image";

import { motion } from "framer-motion";

import Link from "next/link";

const Hero = () => {
  const categories = [
    {
      id: 1,
      title: "Men's Native",
      subtitle: "African Heritage Collection",
      link: "/products/men-native-wears",
      image: "/men-native.png",
      bgColor: "from-green-100 to-green-50",
      textColor: "text-green-800",
      overlay: "bg-green-800/10",
      position: "right-0 bottom-0",
      size: "w-[40%] md:w-[35%] lg:w-[30%] xl:w-[45%]",
    },
    {
      id: 2,
      title: "Men's Corporate",
      subtitle: "Premium Nigerian Tailoring",
      link: "/products/men-cooperate-wears",
      image: "/men-cooperate.png",
      bgColor: "from-blue-100 to-blue-50",
      textColor: "text-blue-800",
      overlay: "bg-blue-800/10",
      position: "right-0 bottom-0",
      size: "w-[50%] md:w-[50%] lg:w-[40%] xl:w-[70%]",
    },
    {
      id: 3,
      title: "Women's Native",
      subtitle: "Elegant African Designs",
      link: "/products/ladies-native-wears",
      image: "/women-native2.png",
      bgColor: "from-amber-100 to-amber-50",
      textColor: "text-amber-800",
      overlay: "bg-amber-800/10",
      position: "right-0 bottom-0",
      size: "w-[70%] md:w-[65%] lg:w-[50%] xl:w-[90%]",
    },
    {
      id: 4,
      title: "Women's Corporate",
      subtitle: "Sophisticated Workwear",
      link: "/products/ladies-cooperate-wears",
      image: "/women-cooperate.png",
      bgColor: "from-purple-100 to-purple-50",
      textColor: "text-purple-800",
      overlay: "bg-purple-800/10",
      position: "top-0 right-0",
      size: "w-[40%] md:w-[30%] lg:w-[20%] xl:w-[40%]",
    },
  ];

  return (
    <div className="w-full">
      {/* Static Hero Section */}
      <div className="relative w-full h-screen max-h-[800px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10 z-10" />

        <div className="relative h-full w-full flex items-center">
          <Image
            src="/woman-hero.png"
            alt="African Fashion Collection"
            fill
            className="object-contain"
            priority
          />

          <div className="container mx-auto px-6 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Elevate Your Style with African Elegance
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Discover handcrafted premium African attire that blends tradition with modern
                fashion
              </p>
              <div className="flex gap-4">
                <Link href="/products/men-native-wears">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-white text-amber-900 px-8 py-3 rounded-full font-bold hover:bg-amber-100 transition-all">
                    Shop Men's
                  </motion.button>
                </Link>
                <Link href="/products/ladies-native-wears">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-amber-600 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-700 transition-all">
                    Shop Women's
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="container mx-auto px-4 py-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Discover Our Collections
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: category.id * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="relative h-64 rounded-xl overflow-hidden shadow-lg group">
              <div
                className={`absolute inset-0 bg-gradient-to-b ${category.bgColor} ${category.overlay} group-hover:opacity-80 transition-opacity`}></div>
              <div className="relative h-full flex items-center pl-6 z-10">
                <SubHero
                  heading={category.title}
                  subHeading={category.subtitle}
                  link={category.link}
                />
              </div>
              <Image
                src={category.image}
                width={500}
                height={500}
                alt={category.title}
                className={`absolute ${category.position} ${category.size} h-full object-cover transition-all duration-300 group-hover:scale-105`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;

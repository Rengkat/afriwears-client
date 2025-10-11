"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const PromoBanner = () => {
  return (
    <section className="relative overflow-hidden bg-gray-900 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/african-pattern.png')] bg-repeat bg-[size:200px]"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* Left Image - Only visible on larger screens */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block relative h-96">
            <Image
              src="/womandis.png"
              alt="Elegant African woman"
              fill
              className="object-contain"
              quality={100}
            />
          </motion.div>

          {/* Center Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 text-center lg:text-left">
            <p className="uppercase text-amber-400 text-lg md:text-xl font-medium tracking-wider mb-3">
              Make the Right Choice
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Premium Attire <br className="hidden md:block" />
              for Every Occasion
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto lg:mx-0">
              Discover handcrafted pieces that celebrate African heritage while meeting modern
              fashion standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg">
                  Shop Collection
                </motion.button>
              </Link>
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-transparent hover:bg-white/10 border-2 border-white text-white px-8 py-3 rounded-full font-bold transition-all">
                  Our Story
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Right Image - Only visible on larger screens */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block relative h-96">
            <Image
              src="/menside.png"
              alt="Stylish African man"
              fill
              className="object-contain"
              quality={100}
            />
          </motion.div>
        </div>
      </div>

      {/* Mobile image - Only visible on small screens */}
      <div className="lg:hidden relative h-64 w-full">
        <Image
          src="/banner-mobile.jpg"
          alt="African fashion"
          fill
          className="object-cover opacity-70"
        />
      </div>
    </section>
  );
};

export default PromoBanner;

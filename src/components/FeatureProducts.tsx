"use client";
import Image from "next/image";
import Link from "next/link";
import { BsArrowRight, BsStarFill, BsStarHalf } from "react-icons/bs";
import { motion } from "framer-motion";

const mockFeaturedProducts = [
  {
    id: "f1",
    name: "Royal Kente Agbada Set",
    slug: "royal-kente-agbada",
    image: "/featured-1.jpg",
    price: 65000,
    originalPrice: 80000,
    stylist: "Royal Heritage Designs",
    colors: ["gold", "red", "black"],
    rating: 5.0,
    reviews: 342,
    isBestSeller: true,
    isNew: false,
    description: "Handwoven kente fabric with intricate embroidery details",
  },
  {
    id: "f2",
    name: "Premium Silk Adire Gown",
    slug: "premium-silk-adire",
    image: "/featured-2.jpg",
    price: 55000,
    originalPrice: 68000,
    stylist: "Amina Luxury",
    colors: ["indigo", "white", "gold"],
    rating: 4.9,
    reviews: 278,
    isBestSeller: true,
    isNew: true,
    description: "Luxury silk adire with hand-painted patterns and lace accents",
  },
  {
    id: "f3",
    name: "Modern Ankara 3-Piece",
    slug: "modern-ankara-3piece",
    image: "/featured-3.jpg",
    price: 48000,
    originalPrice: 55000,
    stylist: "Urban African Couture",
    colors: ["blue", "yellow", "green"],
    rating: 4.8,
    reviews: 195,
    isBestSeller: false,
    isNew: true,
    description: "Contemporary take on traditional Ankara with modern tailoring",
  },
  {
    id: "f4",
    name: "Beaded Asooke Evening Dress",
    slug: "beaded-asooke-evening",
    image: "/featured-4.jpg",
    price: 72000,
    originalPrice: 85000,
    stylist: "Zainab Royalty",
    colors: ["cream", "gold", "burgundy"],
    rating: 5.0,
    reviews: 421,
    isBestSeller: true,
    isNew: false,
    description: "Hand-beaded asooke fabric with crystal embellishments",
  },
];

const FeaturedProductCard = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      transition={{ duration: 0.6 }}
      className="relative group overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {product.isBestSeller && (
          <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            BESTSELLER
          </span>
        )}
        {product.isNew && (
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            NEW
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative h-80 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
          <div className="flex flex-col items-end">
            <span className="font-bold text-gray-900">₦{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₦{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3">{product.stylist}</p>
        <p className="text-gray-500 text-sm mb-4">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => {
              if (i < Math.floor(product.rating)) {
                return <BsStarFill key={i} size={14} />;
              }
              if (i === Math.floor(product.rating) && product.rating % 1 >= 0.5) {
                return <BsStarHalf key={i} size={14} />;
              }
              return <BsStarFill key={i} size={14} className="text-gray-300" />;
            })}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Color Options */}
        <div className="flex gap-2 mb-5">
          {product.colors.map((color) => (
            <div
              key={color}
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {/* CTA Button */}
        <Link href={`/products/${product.slug}`}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition-colors">
            View Details
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

const FeaturedProducts = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Featured Collections
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto">
            Carefully curated selection of our most premium African fashion pieces, loved by
            customers and crafted by master artisans
          </motion.p>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockFeaturedProducts.map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16">
          <Link href="/collections/featured">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
              Browse All Featured Items
              <BsArrowRight size={18} />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

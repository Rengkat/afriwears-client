"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const customerSupport = [
  {
    img: "/worldwide-shipping.svg",
    heading: "Free Worldwide Shipping",
    subHeading: "For all orders over $99",
    id: "12jdjfh3jrnfnnc",
  },
  {
    img: "/money-back-guarantee.svg",
    heading: "Money Back Guarantee",
    subHeading: "If items have wrong measurements",
    id: "68fdjyu75gmekdm",
  },
  {
    img: "/online-support.svg",
    heading: "24/7 Customer Support",
    subHeading: "Dedicated assistance",
    id: "085vgmw36ouhacf",
  },
  {
    img: "/protection.svg",
    heading: "Secure Payments",
    subHeading: "100% protected transactions",
    id: "74gndvmwui0edd",
  },
];

const CustomerSupportBanner = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50 border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {customerSupport.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row lg:flex-col items-center text-center lg:text-center gap-4">
              <div className="p-3 bg-amber-50 rounded-full">
                <Image
                  src={item.img}
                  width={48}
                  height={48}
                  alt={item.heading}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.heading}</h3>
                <p className="text-gray-600 text-sm md:text-base">{item.subHeading}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerSupportBanner;

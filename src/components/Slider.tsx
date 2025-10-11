"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeroSkeleton } from "./Skeleton";

const Slider = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const slides = [
    {
      id: 1,
      title: "African Native Wears",
      subtitle: "Hot Men Collection",
      link: "/products/men-native-wears",
      className: "slider-1",
      textColor: "text-white",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: 2,
      title: "African Native Wears",
      subtitle: "Hot Women Collection",
      link: "/products/ladies-native-wears",
      className: "slider-2",
      textColor: "text-gray-900",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: 3,
      title: "Men Corporate Wears",
      subtitle: "Premium Collection",
      link: "/products/men-cooperate-wears",
      className: "slider-3",
      textColor: "text-white md:text-gray-900",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: 4,
      title: "Women Corporate Wears",
      subtitle: "New Arrival",
      link: "/products/ladies-cooperate-wears",
      className: "slider-4",
      textColor: "text-gray-900",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
    },
  ];

  return (
    <>
      {!isClient ? (
        <div className="h-[70vh] xl:h-auto col-span-2 row-span-2 relative">
          <HeroSkeleton />
        </div>
      ) : (
        <div className="hero-slider h-[70vh] xl:h-screen relative">
          <Swiper
            className="h-full w-[90%] mx-auto"
            spaceBetween={40}
            centeredSlides={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[Autoplay, Pagination, Navigation]}
            loop={true}>
            {slides.map((slide) => (
              <SwiperSlide key={slide.id} className={slide.className}>
                <div className="h-full w-full flex items-center">
                  <div className="container mx-auto px-8">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="max-w-lg">
                      <h3 className={`text-lg md:text-xl font-semibold mb-2 ${slide.textColor}`}>
                        {slide.subtitle}
                      </h3>
                      <h1 className={`font-bold text-4xl md:text-6xl mb-6 ${slide.textColor}`}>
                        {slide.title}
                      </h1>
                      <Link href={slide.link}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`${slide.buttonBg} py-3 px-8 rounded-full shadow-lg text-lg font-bold text-white transition-colors`}>
                          SHOP NOW
                        </motion.button>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Arrows */}
          <div className="swiper-button-next hidden md:block"></div>
          <div className="swiper-button-prev hidden md:block"></div>
        </div>
      )}
    </>
  );
};

export default Slider;

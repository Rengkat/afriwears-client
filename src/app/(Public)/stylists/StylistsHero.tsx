import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative bg-gray-900 text-white h-64">
      <Image
        src="/stylists-hero.jpg"
        alt="African Fashion Stylists"
        fill
        className="object-cover opacity-70"
      />
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Talented Stylists</h1>
        <p className="text-lg md:text-xl max-w-2xl">
          Discover the creative minds behind our authentic African fashion designs
        </p>
      </div>
    </div>
  );
};
export default Hero;

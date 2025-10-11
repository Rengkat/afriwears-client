import CustomerSupportBanner from "@/components/CustomerBanner";
import FeaturedProducts from "@/components/FeatureProducts";
import Hero from "@/components/Hero";
import PromoBanner from "@/components/PromoBanner";
import RecentProducts from "@/components/RecentProducts";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <RecentProducts />
      <PromoBanner />
      <FeaturedProducts />
      <CustomerSupportBanner />
    </div>
  );
}

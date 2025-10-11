import "../globals.css";
import Footer from "../../components/Footer";
import dynamic from "next/dynamic";
import MobileNav from "@/components/MobileNav";
import NavBar from "@/components/Nav";
interface Props {
  children: React.ReactNode;
}
export const metadata = {
  title: "Afriwears",
  description: "Buy your African Native and cooperate wears online and connect with stylist",
};
export default function PublicLayout({ children }: Props) {
  return (
    <>
      <div className="w-full relative">
        <div className="sticky top-0 left-0 right-0 z-50 bg-[#fffffff2]">
          <NavBar />
        </div>
        {children}
        <Footer />
      </div>
      {/* <div className=""> */}
      <MobileNav />
    </>
  );
}

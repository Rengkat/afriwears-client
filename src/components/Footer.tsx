import { FiInstagram, FiFacebook, FiTwitter, FiYoutube } from "react-icons/fi";
import { MdOutlineEmail, MdOutlineLocationOn, MdOutlinePhone } from "react-icons/md";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white">
      {/* Main Footer Content */}
      <div className="bg-[#2b2a2a] text-white pt-12 pb-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Categories */}
            <div>
              <h3 className="text-xl font-bold uppercase mb-6 pb-2 border-b border-gray-600">
                Categories
              </h3>
              <ul className="space-y-3">
                {[
                  "Men Native Wears",
                  "Men Cooperate Wears",
                  "Women Native Wears",
                  "Women Cooperate Wears",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3 className="text-xl font-bold uppercase mb-6 pb-2 border-b border-gray-600">
                Help & Info
              </h3>
              <ul className="space-y-3">
                {[
                  "Track Order",
                  "Returns & Exchanges",
                  "Shipping Policy",
                  "Size Guide",
                  "FAQs",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold uppercase mb-6 pb-2 border-b border-gray-600">
                Contact Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MdOutlineLocationOn fontSize={25} className="text-blue-400 text-xl mt-1 mr-3" />
                  <p>8th floor, 379 Yakubu Gowon, Jos, Plateau State, Nigeria</p>
                </div>
                <div className="flex items-center">
                  <MdOutlinePhone className="text-blue-400 text-xl mr-3" />
                  <p>(+234) 096 716 6879</p>
                </div>
                <div className="flex items-center">
                  <MdOutlineEmail className="text-blue-400 text-xl mr-3" />
                  <p>info@afriwears.com</p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-xl font-bold uppercase mb-6 pb-2 border-b border-gray-600">
                Newsletter
              </h3>
              <p className="mb-4">Subscribe for updates, promotions and more</p>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-transparent border-b border-gray-500 py-2 px-1 focus:border-blue-400 focus:outline-none transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition-colors duration-300 shadow-lg">
                  Subscribe
                </button>
              </form>
              <div className="flex space-x-4 mt-6">
                {[
                  { icon: <FiFacebook className="text-xl" />, name: "Facebook" },
                  { icon: <FiInstagram className="text-xl" />, name: "Instagram" },
                  { icon: <FiTwitter className="text-xl" />, name: "Twitter" },
                  { icon: <FiYoutube className="text-xl" />, name: "YouTube" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label={social.name}>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AfriWears. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

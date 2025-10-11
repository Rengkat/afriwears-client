import Link from "next/link";
import { motion } from "framer-motion";

interface Props {
  heading: string;
  subHeading: string;
  link: string;
}

export default function SubHero({ heading, subHeading, link }: Props) {
  return (
    <div className="flex items-center h-full">
      <div>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-bold text-2xl md:text-3xl py-2 text-gray-800">
          {heading}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-light mb-4 text-gray-700">
          {subHeading}
        </motion.p>
        <Link href={link}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
            Shop now
          </motion.button>
        </Link>
      </div>
    </div>
  );
}

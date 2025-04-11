// NeonText.tsx
import { motion } from "framer-motion";
import React from "react";

interface NeonTextProps {
  text: string;
}

export const NeonText: React.FC<NeonTextProps> = ({ text }) => {
  // Define keyframes for neon effect.
  const neonKeyframes = {
    scale: [1, 1.05, 1],
    textShadow: [
      "none", 
      "0 0 8px #fff, 0 0 12px #fff, 0 0 15px #a855f7",
      "none"
    ]
  };

  return (
    <motion.p
      initial={{ opacity: 1, scale: 1, textShadow: "none" }}
      animate={neonKeyframes}
      transition={{
        duration: 1,
        ease: "easeInOut"
      }}
      className="lg:text-4xl sm:text-2xl font-extrabold text-gray-100 text-center mt-6"
    >
      {text
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}
    </motion.p>
  );
};

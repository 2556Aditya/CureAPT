"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {cn} from "../../lib/utils"

// More vibrant gradient combinations
const gradients = [
  "from-[#FF0080] via-[#FF0080] to-[#7928CA]", // Hot pink to purple
  "from-[#7928CA] via-[#FF0080] to-[#FF0080]", // Purple to pink
  "from-[#00DFD8] via-[#007CF0] to-[#00DFD8]", // Cyan to blue
  "from-[#007CF0] via-[#00DFD8] to-[#007CF0]", // Blue to cyan
  "from-[#FF4D4D] via-[#F9CB28] to-[#FF4D4D]", // Red to yellow
  "from-[#00FF00] via-[#00DFD8] to-[#00FF00]", // Green to cyan
  "from-[#7928CA] via-[#FF4D4D] to-[#7928CA]", // Purple to red
  "from-[#FF4D4D] via-[#F9CB28] to-[#00FF00]", // Red to yellow to green
  "from-[#00DFD8] via-[#007CF0] to-[#7928CA]", // Cyan to blue to purple
  "from-[#FF0080] via-[#7928CA] to-[#FF4D4D]"  // Pink to purple to red
];

export const WobbleCard = ({
  children,
  containerClassName,
  className
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [gradient] = useState(gradients[Math.floor(Math.random() * gradients.length)]);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 20;
    const y = (clientY - (rect.top + rect.height / 2)) / 20;
    setMousePosition({ x, y });
  };

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
          : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
        transition: "transform 0.1s ease-out",
      }}
      className={cn(
        "mx-auto w-full relative rounded-2xl overflow-hidden",
        `bg-gradient-to-br ${gradient}`,
        containerClassName
      )}>
      <div
        className="relative h-full backdrop-blur-[2px] [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.2),rgba(255,255,255,0))] sm:mx-0 sm:rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)",
        }}>
        <motion.div
          style={{
            transform: isHovering
              ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.03, 1.03, 1)`
              : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
            transition: "transform 0.1s ease-out",
          }}
          className={cn("h-full px-4 py-20 sm:px-10", className)}>
          <Noise />
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};

const Noise = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
      style={{
        backgroundImage: "url(/noise.webp)",
        backgroundSize: "30%",
      }}
    />
  );
};
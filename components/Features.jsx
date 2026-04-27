'use client'
import { cn } from "../src/lib/utils";
import Image from "next/image";
import createGlobe from "cobe";
import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollRevealText }  from "./ScrollRevealText";
import React, { useEffect, useState, useRef } from "react";

export default function Features() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const features = [
    {
      title: "Track Your Health Streaks",
      description:
        "Stay motivated with our gamified streak system. Build and maintain healthy habits through consistent daily tracking.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-900",
    },
    {
      title: "Personal Health Metrics",
      description:
        "Comprehensive tracking of your vital health metrics, exercise routines, and wellness goals in one place.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-900",
    },
    {
      title: "AI-Powered Recommendations",
      description:
        "Get personalized health and wellness recommendations powered by our advanced AI system.",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-900",
    },
    {
      title: "Daily Progress Dashboard",
      description:
        "Visual insights into your daily health journey with interactive charts and progress tracking.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];
  return (
    (<div className="relative z-20 pb-16 max-w-7xl mx-auto  rounded-3xl">
      <div className="px-8">
        <ScrollRevealText className="text-3xl lg:text-6xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
          Your Health Journey Gamified.
        </ScrollRevealText>

        <ScrollRevealText  className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
          Transform your wellness routine into an engaging experience with CureAPT&apos;s innovative health tracking features.
        </ScrollRevealText>
      </div>
      <div className="relative bg-blue-900 bg-opacity-5 rounded-xl shadow-[0_0px_64px_rgba(8,_120,_300,_1)]">
  <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-600">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className=" h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>)
  );
}

const FeatureCard = ({
  children,
  className
}) => {
  return (
    (<div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>)
  );
};

const FeatureTitle = ({ children }) => {
  return (
    <h3 className="max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-2xl md:text-4xl md:leading-snug">
      {children}
    </h3>
  );
};

const FeatureDescription = ({ children }) => {
  return (
    <div className={cn(
      "text-sm md:text-base text-left mx-auto",
      "text-neutral-500 text-center font-normal dark:text-neutral-300",
      "text-left max-w-xl mx-0 md:text-sm my-2"
    )}>
      {children}
    </div>
  );
};

export const SkeletonOne = () => {
  return (
    (<div className="relative flex py-8 px-2 gap-10 h-full">
      <div
        className="  mx-auto  group ">
        <div className="flex flex-1  flex-col space-y-2  ">
          {/* TODO */}
          <Image
            src="/sza.jpeg"
            alt="header"
            width={800}
            height={400}
            className=" object-cover object-left-top rounded-sm" />
        </div>
      </div>
    </div>)
  );
};

export const SkeletonThree = () => {
  return (
    (<Link
      href="/sign-up"
      target="__blank"
      className="relative flex gap-10  h-full group/image">
      <div
        className="w-full  mx-auto bg-transparent dark:bg-transparent group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2  relative">
          {/* TODO */}
          <Image
            src="/office.jpg"
            alt="header"
            width={700}
            height={700}
            className=" object-cover object-center rounded-sm blur-none group-hover/image:blur-md transition-all duration-200"
          />
        </div>
      </div>
    </Link>)
  );
};

// In Features.jsx

export const SkeletonTwo = () => {
  // Define fixed rotation values instead of using Math.random()
  const rotationAngles = [
    2.5, -1.5, 5.0, -3.5, 1.0,  // First row
    3.0, -2.0, 4.0, -1.0, 2.0   // Second row
  ];

  const images = [
    "/1.png",
    "/5.jpeg",
    "/4.jpeg",
    "/6.jpeg",
    "/8.jpeg",
  ];

  const imageVariants = {
    whileHover: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
  };

  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      <div className="flex flex-row -ml-20">
        {images.map((image, idx) => (
          <motion.div
            key={`first-row-${idx}`}
            variants={imageVariants}
            style={{
              rotate: rotationAngles[idx],
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <Image
              src={image}
              alt="preview image"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {images.map((image, idx) => (
          <motion.div
            key={`second-row-${idx}`}
            variants={imageVariants}
            style={{
              rotate: rotationAngles[idx + 5],
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <Image
              src={image}
              alt="preview image"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    (<div
      className="h-60 md:h-60  flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
      <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
    </div>)
  );
};

export const Globe = ({ className }) => {
  const canvasRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !canvasRef.current) return;
    
    let phi = 0;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        // longitude latitude
        { location: [43.740194, 7.426633], size: 0.03 },
        { location: [28.655908, 77.491121], size: 0.1 },
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    (<canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className} />)
  );
};

import React from "react";
import Button1 from "./Button";
import { ScrollRevealText }  from "./ScrollRevealText";
export default function CTA() {
  return (
    <div  className="px-8 py-20">
      <ScrollRevealText className="text-3xl lg:text-6xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
        Transform Your Health Today
      </ScrollRevealText>
      
      <ScrollRevealText className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
        Take control of your wellbeing with our comprehensive health metrics tracking platform. 
        Start your journey towards a healthier lifestyle.
      </ScrollRevealText>

      <div className="flex justify-center mt-8">
        <Button1 />
      </div>
    </div>
  );
}
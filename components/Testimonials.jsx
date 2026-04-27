import React from "react";
import Image from 'next/image';

const testimonials = [
  {
    name: "@Walter White",
    role: "Chemistry Professor",
    comment: "The health tracking precision is 99.1% pure excellence. Exactly what I needed.",
    image: "/testimonials/walter.jpg"
  },
  {
    name: "@Jesse Pinkman", 
    role: "Fitness Enthusiast",
    comment: "Yo, these health streaks are addictive! Science, motivation - they've got it all!",
    image: "/testimonials/jesse.jpg"
  },
  {
    name: "@Saul Goodman",
    role: "Attorney", 
    comment: "Better Call CureAPT! Their streak system keeps me accountable, and that's no small feat.",
    image: "/testimonials/saul.jpg"
  },
  {
    name: "@Dwight Schrute",
    role: "Beet Farmer",
    comment: "Superior health tracking. Bears eat beets, and I eat according to CureAPT's recommendations.",
    image: "/testimonials/dwight.jpg"
  },
  {
    name: "@Kim Wexler",
    role: "Legal Professional",
    comment: "The attention to detail in health metrics is exactly what busy professionals need.",
    image: "/testimonials/kim.jpg"
  },
  {
    name: "@Michael Scott",
    role: "Branch Manager", 
    comment: "That's what she said - about how amazing CureAPT's wellness tracking is!",
    image: "/testimonials/Michael.jpg"
  },
  {
    name: "@Gus Fring",
    role: "Restaurant Owner",
    comment: "The consistency and professionalism of this health app is... acceptable.",
    image: "/testimonials/gus.jpg"
  },
  {
    name: "@Pam Beesly",
    role: "Artist",
    comment: "The interface is so intuitive, even Michael could track his health goals.",
    image: "/testimonials/pam.jpg"
  },
  {
    name: "@Mike Ehrmantraut",
    role: "Security Consultant",
    comment: "No half measures when it comes to health. This app gets it done right.",
    image: "/testimonials/mike.jpg"
  },
  {
    name: "@Jim Halpert",
    role: "Sales Director",
    comment: "Finally, a health app that doesn't make me want to look at the camera in disbelief.",
    image: "/testimonials/jim.jpg"
  },
  {
    name: "@Skyler White",
    role: "Business Manager",
    comment: "The family tracking feature helps me keep everyone's health in check.",
    image: "/testimonials/skyler.jpg" 
  },
  {
    name: "@Howard Hamlin",
    role: "Law Firm Partner",
    comment: "Pristine design, impeccable functionality. CureAPT is simply exceptional.",
    image: "/testimonials/howard.jpg"
  },
  {
    name: "@Eduardo Salamanca",
    role: "International Entrepreneur",
    comment: "This app keeps me on track no matter where I travel. Impeccable attention to detail, just like me.",
    image: "/testimonials/lalo.jpg"
  }
];

const ReviewCard = ({ image, name, role, comment }) => {
  return (
    <figure className="relative w-[400px] h-[180px] mx-6 rounded-xl border border-gray-800 p-6 bg-black/40">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-800 relative">
          <Image
            src={image}
            alt={name}
            fill
            style={{objectFit: 'cover'}}
            sizes="48px"
          />
        </div>
        <div>
          <h3 className="text-base font-medium text-white">{name}</h3>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
      <blockquote className="mt-4 text-sm text-gray-300 leading-relaxed whitespace-normal">
        {comment}
      </blockquote>
    </figure>
  );
};

export default function Testimonials() {
  return (
    <div className="relative w-full py-4">
      <div className="flex overflow-hidden relative w-full">
        <div className="animate-scroll flex whitespace-nowrap">
          {testimonials.map((review, idx) => (
            <ReviewCard key={idx} {...review} />
          ))}
        </div>
        <div className="animate-scroll flex whitespace-nowrap" aria-hidden="true">
          {testimonials.map((review, idx) => (
            <ReviewCard key={`clone-${idx}`} {...review} />
          ))}
        </div>
      </div>
      
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[15%] bg-gradient-to-r from-[rgb(4,4,29)] to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-[rgb(4,4,29)] to-transparent"></div>
    </div>
  );
}
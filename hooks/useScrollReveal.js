// hooks/useScrollReveal.js
'use client';
import { useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function useScrollReveal() {
  const [element, setElement] = useState(null);

  useLayoutEffect(() => {
    if (!element) return;

    const splitText = new SplitType(element, {
      types: 'words',
      tagName: 'span'
    });

    const words = splitText.words;

    gsap.set(words, {
      y: 20,
      opacity: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        end: 'top 50%',
        scrub: 1,
        markers: false,
        toggleActions: 'play none none reverse',
      }
    });

    tl.to(words, {
      y: 0,
      opacity: 1,
      delay: 1,
      duration: 2,
      ease: "power2.out",
      stagger: {
        amount: 0.7,
        from: "start"
      },
      onComplete: () => {
        gsap.set(words, { clearProps: "all" }); // Clear GSAP properties after animation
      }
    });

    return () => {
      splitText.revert();
      tl.kill();
    };
  }, [element]);

  return setElement;
}

'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { RoughEase,ExpoScaleEase, SlowMo } from "gsap/EasePack";


gsap.registerPlugin(RoughEase,ExpoScaleEase, SlowMo);

export const useTextAnimation = (text) => {
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Set initial state
    element.textContent = text
    gsap.from(element, {
      opacity: 0,
      duration: 1,
      ease:'rough({strength: 8, points: 10, template: none, randomize: false, taper: "in", clamp: false})',
      stagger: {
        amount: 1,
      },
      onStart: () => {
        element.style.opacity = 0
      }
    })

  }, [text])

  return elementRef
}
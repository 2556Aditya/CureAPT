// hooks/useScrollToSection.js
'use client'
import { useCallback } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

export const useScrollToSection = () => {
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      // Removed delay by setting duration lower and using a snappier ease
      gsap.to(window, {
        duration: 0.5, // Reduced from 1
        scrollTo: {
          y: element,
          offsetY: 80,
          autoKill: false // Prevents killing the animation mid-scroll
        },
        ease: "power2.out" // Changed to a snappier ease
      })
    }
  }, [])

  return scrollToSection
}
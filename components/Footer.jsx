import React from "react";
import Link from "next/link";
import { useScrollToSection } from "../hooks/useScrollToSection"
import { FaTwitter, FaLinkedin, FaInstagram, FaPinterest, FaGithub } from "react-icons/fa";

export default function Footer() {
  const scrollToSection = useScrollToSection()

  const handleClick = (e, sectionId) => {
    e.preventDefault()
    scrollToSection(sectionId)
  }

  return (
    <footer className="w-full pt-12 px-4">
    <div className="max-w-6xl mx-auto ">
      <div className="flex flex-wrap justify-center gap-8 mb-8">
        <a href="#home" onClick={(e) => handleClick(e, 'home')} className="text-gray-300 hover:text-white transition-colors">
          Home
        </a>
        <a href="#features" onClick={(e) => handleClick(e, 'features')} className="text-gray-300 hover:text-white transition-colors">
          Features
        </a>
        <a href="/dashboard" onClick={(e) => handleClick(e, 'dashboard')} className="text-gray-300 hover:text-white transition-colors">
          Dashboard
        </a>
        <a href="#testimonials" onClick={(e) => handleClick(e, 'testimonials')} className="text-gray-300 hover:text-white transition-colors">
          Testimonials
        </a>
        <a href="#pricing" onClick={(e) => handleClick(e, 'pricing')} className="text-gray-300 hover:text-white transition-colors">
          Pricing
        </a>
      </div>

        {/* Social Links & Copyright */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6">
            <Link href="www.linkedin.com/in/aditya-chaurasia-89a849248/" className="text-gray-400 hover:text-white transition-colors">
              <FaLinkedin size={20} />
            </Link>
            <Link href="https://in.pinterest.com/VincenzoSanji/" className="text-gray-400 hover:text-white transition-colors">
              <FaPinterest size={20} />
            </Link>
            <Link href="https://github.com/2556Aditya" className="text-gray-400 hover:text-white transition-colors">
              <FaGithub size={20} />
            </Link>
          </div>
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} CureAPT. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
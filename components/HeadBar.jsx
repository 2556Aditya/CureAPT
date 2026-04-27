import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import { CureaptLogo } from "./CureaptLogo";
import { UserIcon } from "./UserIcon";
import { HoverBorderGradient } from "./hover-border-gradient";
import { useScrollToSection } from "../hooks/useScrollToSection"

export default function HeadBar() {
  const scrollToSection = useScrollToSection()

  const handleClick = (e, sectionId) => {
    e.preventDefault()
    scrollToSection(sectionId)
  }

  return (
    <Navbar maxWidth="2xl" className="bg-color-black" >
           <NavbarBrand>
        <CureaptLogo />
        <p className="font-bold text-2xl text-white">CureAPT</p>
      </NavbarBrand>
      <NavbarContent className="sm:flex gap-4" justify="center">
        <NavbarItem>
          <a href="#features" onClick={(e) => handleClick(e, 'features')} className="text-white">
            Features
          </a>
        </NavbarItem>
        <NavbarItem>
          <a href="/dashboard" onClick={(e) => handleClick(e, 'dashboard')} className="text-cyan-400 ">
            Dashboard
          </a>
        </NavbarItem>
        <NavbarItem>
          <a href="#testimonials" onClick={(e) => handleClick(e, 'testimonials')} className="text-white">
            Testimonials
          </a>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className=" lg:flex">
          <Link href="/sign-in" className="text-white">
          <div className=" flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center text-sm space-x-2"
      >
        <span>Login</span>
      </HoverBorderGradient>
    </div>
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
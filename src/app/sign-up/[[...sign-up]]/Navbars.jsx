import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import { CureaptLogo } from "./CureaptLogo";

export default function Navbars() {
  return (
    <Navbar maxWidth="2xl" className="bg-color-black" >
      <NavbarBrand >
        <CureaptLogo />
        <p className="font-bold text-2xl text-white">CureAPT</p>
      </NavbarBrand>
    </Navbar>
  );
}
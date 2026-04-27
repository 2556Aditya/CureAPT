// page.js (sign-up)
"use client"
import { SignUp } from "@clerk/nextjs";
import Navbars from "./Navbars";
import { useEffect } from "react";

export default function SignUpPage() {
  useEffect(() => {
    localStorage.removeItem("clerk-db");
  }, []);

  return (
    <main className="bg-gradient-to-t from-blue-600 to-black min-h-screen">
      <Navbars />
      <div className="m-auto mt-[70px] h-[580px] max-w-[450px] backdrop-blur-xl backdrop-brightness-75 backdrop-contrast-125 back rounded-3xl">
        <div className="ml-[26px] pt-[23px]">
          <SignUp 
            routing="path"
            signInUrl="/sign-in"
            redirectUrl="/dashboard"
            afterSignUpUrl="/dashboard"
          />
        </div>
      </div>
    </main>
  );
}
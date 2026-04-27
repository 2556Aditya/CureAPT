// page.js (sign-in)
"use client"
import { SignIn } from "@clerk/nextjs";
import Navbars from "./Navbars";
import { useEffect } from "react";
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard';

  useEffect(() => {
    localStorage.removeItem("clerk-db");
  }, []);

  return (
    <main className="bg-gradient-to-t from-blue-600 to-black min-h-screen">
      <Navbars />
      <div className="m-auto mt-[70px] h-[500px] max-w-[450px] backdrop-blur-xl backdrop-brightness-75 backdrop-contrast-125 back rounded-3xl">
        <div className="ml-[26px] pt-[23px]">
          <SignIn 
            routing="path"
            signUpUrl="/sign-up"
            redirectUrl={redirectUrl}
            afterSignInUrl={redirectUrl}
          />
        </div>
      </div>
    </main>
  );
}
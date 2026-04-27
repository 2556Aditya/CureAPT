import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
    
import { ExpoScaleEase } from "gsap/EasePack";
    
import { TextPlugin } from "gsap/TextPlugin";
import React from 'react'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "postcss";
import { divider } from "@nextui-org/react";

gsap.registerPlugin(ScrollTrigger);

gsap.registerPlugin(useGSAP,TextPlugin,ExpoScaleEase);


const Streak = () => {
    useGSAP(()=>{
        gsap.to('#streak',{
            ease:'bounce.inOut',
            opacity: 1,
            y:0,
            duration: 2,
            repeat: 0,
            yoyo: true,
            delay: 0.5,
        })
    }, [])
  return (
    <>
    <h1 id="streak" className=" opacity-0 
         uppercase text-5xl 
         subpixel-antialiased 
         font-black 
         tracking-tight 
         font-serif">
        Streak
    </h1>
    </>
  )
}

export default Streak
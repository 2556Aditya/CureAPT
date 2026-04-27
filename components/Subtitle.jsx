import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
    
import { ExpoScaleEase } from "gsap/EasePack";
    
import { TextPlugin } from "gsap/TextPlugin";
import React from 'react'
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.registerPlugin(useGSAP,TextPlugin,ExpoScaleEase);


const Subtitle = () => {
    useGSAP(()=>{
        gsap.to('#text',{
            ease:'power2.inOut',
            opacity: 1,
            y:0,
            delay: 0.5,
            scrollTrigger:{
                trigger:'#text',

            }
        })
    }, [])
  return (
    <>
    <h1 id="text" className=" opacity-0 
         uppercase text-xl 
         subpixel-antialiased 
         font-semibold text-center
         tracking-widest 
        font-mono">
        Play your way to better life
    </h1>
    </>
  )
}

export default Subtitle
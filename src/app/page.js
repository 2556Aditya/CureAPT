'use client'
import { Divider, colors } from "@nextui-org/react";
import HeadBar from "../../components/HeadBar";
import Testimonial from "../../components/Testimonials";
import Pricing from "../../components/Pricing";
import Footer from "../../components/Footer";
import {ContainerScroll} from "../../components/container-scroll-animation";
import Image from "next/image";
import Stats from "../../components/Stats";
import Features from "../../components/Features";
import CTA from "../../components/CTA";
import { useTextAnimation } from '../../hooks/useTextAnimation';
import { ShootingStars } from "../../components/shooting-stars";
import { StarsBackground } from "../../components/stars-background";
import { Montserrat_Alternates } from "next/font/google"
import { Jaro } from "next/font/google"
import { ScrollRevealText }  from "../../components/ScrollRevealText";

const jaroo = Jaro({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal']
});
const montserrat = Montserrat_Alternates({
  subsets: ["latin"], 
  weight: ['700']
});

export default function Home() {
  const healthRef = useTextAnimation('Health With')
  const cureRef = useTextAnimation('CureAPT.')
  

  return (
    <main className="bg-opacity-10 bg-blue-500" >
      <ShootingStars />
      <StarsBackground />
      <HeadBar/>
      <div id="home">
      <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
    <h1 className="text-4xl font-semibold text-black dark:text-white">
      Unleash Your True Potential Of <br />
      <div className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
      <span ref={healthRef} className={`${jaroo.className} tracking-tight`}></span>&nbsp;
       <span ref={cureRef} className={`${montserrat.className} tracking-tight gradient-glow  ` }></span>
      </div>
    </h1>
          </>
        }
      >
        <Image
          src={`/ssd.png`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full "
          draggable={false}
        />
      </ContainerScroll>
    </div>
    <div id="features" className="flex justify-center m-auto ">
      <Features/>
      </div>
      <div >
      <CTA/>
      </div>
      <div id="testimonials" className="relative z-20 pb-16 max-w-7xl mx-auto">
  <div className="px-8"> {/* Add container similar to Features */}
    <ScrollRevealText className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
      Testimonials
    </ScrollRevealText>
    <ScrollRevealText className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
      Take time to read what our customers have to say about us.
    </ScrollRevealText>
  </div>
  <div className="flex flex-wrap gap-5 justify-center">
    <Testimonial/>
  </div>
</div>
<div className="relative z-20 pb-16 max-w-7xl mx-auto pt-20">
  <div className="px-4">
    <ScrollRevealText className="text-6xl font-extrabold text-center text-white">
      Trusted by Health Enthusiasts Worldwide
    </ScrollRevealText>
    <ScrollRevealText className="text-2xl font-extralight font-sans text-center text-white pt-2">
      Join thousands transforming their wellness journey with CureAPT
    </ScrollRevealText>
  </div>
  <Stats/>
</div>
      <div id="pricing" className="flex justify-center">
      <Pricing/>
      </div>
      <>
        <Footer/>
      </>
      </div>
      <div className="p-7 flex justify-center text-center gradient-cyber">
        Made By Aditya Chaurasia
      </div>
    </main>
  );
}

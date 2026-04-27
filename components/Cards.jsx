import React from "react";
import {Card, CardHeader, CardBody, CardFooter, Image,Button} from "@nextui-org/react";
import Link from "next/link";

export default function Cards() {
  return (
    <div className=" grid max-w-[2000px] max-h-[2000px] gap-5 grid-cols-12 grid-rows-2 px-8 py-8 ">
    <Card isBlurred className="col-span-12 sm:col-span-4 h-[300px]">
      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">Mindfulness</p>
        <h4 className="text-white font-medium text-large">Channel Your Focus</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card background"
        className="z-0 w-full h-full object-cover"
        src="/1.png"
      />
    </Card>
    <Card isBlurred className="col-span-12 sm:col-span-4 h-[300px]">
      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">Streak</p>
        <h4 className="text-white font-medium text-large">Secret Behind Better Everything</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card background"
        className="z-0 w-full h-full object-cover"
        src="/2.png"
      />
    </Card>
    <Card isBlurred className="col-span-12 sm:col-span-4 h-[300px]">
      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">Supercharged</p>
        <h4 className="text-white font-medium text-large">Start Everyday Like New Year</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card background"
        className="z-0 w-full h-full object-cover"
        src="/3.png"
      />
    </Card>
    <Card isBlurred isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5">
      <CardHeader className="absolute z-10 top-1 flex-col items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">Listen...</p>
        <h4 className="text-white font-medium text-2xl">1 Day/Day 1?</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card example background"
        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
        src="/4.jpeg"
      />
      <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
        <div>
          <p className="text-black text-tiny font-semibold">Workout Architect</p>
          <p className="text-black text-tiny">Put That Work In</p>
        </div>
        <Button as={Link} href="/sign-up" className="text-tiny" color="primary" radius="full" size="sm">
          Day 1
        </Button>
      </CardFooter>
    </Card>
    <Card isBlurred isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7">
      <CardHeader className="absolute z-10 top-1 flex-col items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">Your day your way</p>
        <h4 className="text-white/90 font-medium text-xl">Your checklist for better life</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Relaxing app background"
        className="z-0 w-full h-full object-cover"
        src="/5.jpeg"
      />
      <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
        <div className="flex flex-grow gap-2 items-center">
          <Image
            alt="Breathing app icon"
            className="rounded-full w-10 h-11 bg-black"
            src="https://nextui.org/images/breathing-app-icon.jpeg"
          />
          <div className="flex flex-col">
            <p className="text-tiny text-white/60">Diet/Calorie Manager</p>
            <p className="text-tiny text-white/60">Plan Your Calorie Thing Right</p>
          </div>
        </div>
        <Button as={Link} href="/sign-up" radius="full" size="sm">Start Now</Button>
      </CardFooter>
    </Card>
  </div>
  );
}
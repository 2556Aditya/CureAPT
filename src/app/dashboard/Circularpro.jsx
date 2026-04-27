import React, { useEffect, useState } from "react";
import { CircularProgress, Card, CardBody, CardFooter, Chip, Button } from "@nextui-org/react";


export default function Circularpro({ streakCount }) {
  return (
    <Button className="w-[260px] h-[270px] p-0">
      <Card className="w-[260px] h-[270px] border-none bg-gradient-to-br from-blue-700 to-black">
        <CardBody className="justify-center items-center pb-0">
          <CircularProgress
            classNames={{
              svg: "w-48 h-48 drop-shadow-md",
              indicator: "stroke-success",
              track: "stroke-white/10",
              value: "text-3xl font-semibold text-white",
            }}
            value={streakCount}
            strokeWidth={3.5}
            showValueLabel={true}
          />
        </CardBody>
        <CardFooter className="justify-center items-center pt-0">
          <Chip className="p-4 mb-2"
            classNames={{
              base: "border-1 border-white/30",
              content: "text-white/90 text-small font-semibold",
            }}
            variant="bordered"
          >
            Day {streakCount}
          </Chip>
        </CardFooter>
      </Card>
    </Button>
  );
}
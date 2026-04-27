import React from "react";
import { Progress } from "@nextui-org/react";
import { Card } from "@nextui-org/react";

export default function Pb1({ value = 0 }) {
  const normalizedValue = Math.round(Math.max(0, Math.min(100, value)));
  return (
    <Card
      isBlurred
      className=" max-w-[700px] min-w-[600px] border-none bg-background/60 dark:bg-default-100/50 p-1"
      shadow="md">
    <Progress className="max-w-[600px] min-w-[500px] p-4 "
      size="sm"
      radius="sm"
      classNames={{
        base: "min-w-md ",
        track: "drop-shadow-md border border-default",
        indicator: "bg-gradient-to-r from-yellow-400 to-red-500",
        label: "tracking-wider font-medium text-default-600",
        value: "text-foreground/60",
      }}
      label="General Lifestyle"
      value={normalizedValue}
      showValueLabel={true}
    />
    </Card>

  );
}

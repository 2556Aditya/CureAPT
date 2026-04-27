import React from "react";
import {Slider} from "@nextui-org/react";

export default function Slider1() {
  return (
    <Slider 
    radius="full"
      label="Currency" 
      showTooltip={true}
      formatOptions={{style: 'currency', currency: 'JPY'}}
      tooltipValueFormatOptions={{style: 'currency', currency: 'JPY'}}
      defaultValue={40}
      className="max-w-md"
    />
  );
}

import React from "react";
import {Input} from "@nextui-org/react";

export default function Input1({ 
  value, 
  onChange, 
  manifestation, 
  onManifestationChange 
}) {

  return (
    <div className="w-full flex gap-4">
        <div className=" w-full inline-block gap-4">
          <Input  variant="faded" color="primary" label="Username"
           classNames={{
            input: [
              "bg-[#27272A]",

            ]
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pb-5"/>

         <Input variant="faded" color="primary" label="Manifestation"
           classNames={{
            input: [
              "bg-[#27272A]",
            ]
          }}
          value={manifestation}
          onChange={(e) => onManifestationChange(e.target.value)}
          />
         
        </div>
    </div>  
  );
}

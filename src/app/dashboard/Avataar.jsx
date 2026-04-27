// src/components/Avataar.js
import React from "react";
import { Avatar } from "@nextui-org/react";

// src/components/Avataar.js
export default function Avataar({ currentPhoto }) {
  return (
    <div className="flex items-center drop-shadow-md">
      <Avatar
        isBordered
        radius="md"
        color="danger"
        size="lg"
        src={currentPhoto || "https://i.pravatar.cc/150?u=a06712d"}
        onError={(e) => {
          e.target.src = "https://i.pravatar.cc/150?u=a06712d";
        }}
      />
    </div>
  );
}
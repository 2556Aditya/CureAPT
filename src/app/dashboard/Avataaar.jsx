// src/components/Avataaar.js
'use client'
import React, { useRef } from "react";
import { Avatar, Button } from "@nextui-org/react";

export default function Avataaar({ currentPhoto, onPhotoChange }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoChange(file);
      const previewUrl = URL.createObjectURL(file);
      // You might want to store this URL in state if needed
    }
  };

  return (
    <div className="relative">
      <Button radius="full" className="w-24 h-24 p-0" onClick={handleClick}>
        <div className="flex gap-4 items-center drop-shadow-md">
          <Avatar
            isBordered
            radius="full"
            color="primary"
            className="w-20 h-20 text-large"
            src={currentPhoto || "https://i.pravatar.cc/150?u=a04258a2462d826712d"}
          />
        </div>
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}

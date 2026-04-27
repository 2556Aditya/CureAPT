import React from "react";
import { Chip } from "@nextui-org/react";

export default function Chip1({ tag }) {
  return (
    <div className="flex gap-4">
      <Chip color="danger" variant="shadow">{tag}</Chip>
    </div>
  );
}
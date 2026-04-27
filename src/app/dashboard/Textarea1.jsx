import React, {useState} from "react";
import {Textarea} from "@nextui-org/react";

export default function Textarea1({ value, onChange }) {
  const [content, setContent] = useState('');

  return (
    <Textarea
      variant="faded"
      label="Let Your Thoughts Flow"
      labelPlacement="outside"
      placeholder="Tell me What You Thinking"
      description=" Journal: a daily record of news and events of a personal nature; a diary."
      classNames={{
        input: [
          "bg-[#27272A]",
          "placeholder:text-white/60",
        ]
      }}
      color="secondary"
      value={value}
      onChange={onChange}
      minRows={1}
    />
  );
}
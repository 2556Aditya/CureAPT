"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import HealthChatbot from "./HealthChatbot";

export default function AiC() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="shadow"
        color="danger"
        size="lg"
        radius="full"
        className="relative z-10"
        onClick={() => setShowChat(true)}
      >
        Chat with AI Therapist
      </Button>

      <HealthChatbot
        apiKey={process.env.NEXT_PUBLIC_GEMINI_KEY}
        isOpen={showChat}
        onClose={() => setShowChat(false)}
      />
    </div>
  );
}
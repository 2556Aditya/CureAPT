// components/AiC.jsx
'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";

export default function AiC() {
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.embeddedChatbotConfig = {
      chatbotId: "7Lz-RkmZqTM4ik6Ytf1-c",
      domain: "www.chatbase.co"
    };

    const script = document.createElement('script');
    script.src = "https://www.chatbase.co/embed.min.js";
    script.defer = true;
    script.onload = () => setIsLoading(false);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="relative">
      <Button 
        variant="shadow"
        color="danger"
        size="lg"
        className="relative z-10"
        onClick={() => setShowChat(true)}
      >
        Chat with AI Therapist
      </Button>

      {showChat && (
        <div 
          className="fixed bottom-5 right-5 w-[400px] h-[600px] z-50 rounded-xl overflow-hidden shadow-2xl"
        >
          <button
            onClick={() => setShowChat(false)}
            className="absolute top-2 right-2 z-50 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <span className="text-white text-xl">✕</span>
          </button>
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          )}

          <iframe
            src="https://www.chatbase.co/chatbot-iframe/7Lz-RkmZqTM4ik6Ytf1-c"
            width="100%"
            height="100%"
            frameBorder="0"
            className="bg-white"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      )}
    </div>
  );
}
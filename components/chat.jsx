"use client";
import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const userMsg = { role: "user", text: input };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);

    const res = await fetch("/api/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: nextMessages }),
    });

    const data = await res.json();

    const aiMsg = { role: "ai", text: data.reply };
    setMessages((prev) => [...prev, aiMsg]);

    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-black shadow-lg rounded-lg p-2 z-[9999]">
      
      {/* Messages */}
      <div className="h-60 overflow-y-auto border mb-2 p-2">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1">
            <b>{msg.role === "user" ? "You: " : "AI: "}</b>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input + Button */}
      <div className="flex">
        <input
          className="flex-1 border p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-black px-3"
        >
          Send
        </button>
      </div>

    </div>
  );
}
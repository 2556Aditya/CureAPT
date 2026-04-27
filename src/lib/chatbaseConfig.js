// lib/chatbaseConfig.js
export const chatbaseConfig = {
    // Widget Configuration 
    customStyles: {
      chatWindow: {
        height: "600px", 
        width: "400px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
      },
      userMessage: {
        backgroundColor: "#0066cc",
        color: "white", 
        borderRadius: "18px"
      },
      botMessage: {
        backgroundColor: "#f5f5f5",
        color: "#333333",
        borderRadius: "18px"
      }
    },
    initialMessages: [
      "Welcome to CureAPT! I'm here to support your wellness journey. 🌟",
      "How are you feeling today?"
    ],
    quickReplies: [
      "I need help managing stress",
      "Looking for exercise tips",
      "Want to improve sleep",
      "Feeling anxious",
      "Need motivation"
    ],
    // Response Settings
    maxTokens: 300,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0.5,
    presencePenalty: 0.5,
    stopSequences: ["Human:", "Assistant:"]
  };
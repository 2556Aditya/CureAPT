import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const messages = body?.messages || [];

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    //Extract emotion from last message
    const lastMessage = messages.length > 0 ? messages[messages.length - 1]?.text : "";

    //Crisis detection
    const lowerMsg = lastMessage?.toLowerCase() || "";
    const normalizedMsg = lowerMsg.replace(/[^a-z\s]/g, "");

    const crisisKeywords = [
      "suicide",
      "kill myself",
      "end my life",
      "want to die",
      "hurt myself",
      "no reason to live",
      "i give up",
      "i feel like dying"
    ];

    const isCrisis = crisisKeywords.some(word => 
      lowerMsg.includes(word) || normalizedMsg.includes(word)
    );

    if (isCrisis) {
      return Response.json({
        reply: "I'm really sorry you're feeling this way. You don’t have to go through this alone. It might help to reach out to someone you trust or a mental health professional. If you're in immediate danger, please contact a local helpline or emergency service right now. I'm here to listen—what’s been weighing on you?",
        emotion: { emotion: "crisis", cause: "unknown" }
      });
    }

    const emotionPrompt = `
Extract emotion and cause from this message.

Message: "${lastMessage}"

Return ONLY JSON:
{
  "emotion": "",
  "cause": ""
}
`;

    const emotionRes = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: emotionPrompt,
    });

    let emotionData;

    try {
      const cleaned = emotionRes.text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      emotionData = JSON.parse(cleaned);
    } catch {
      emotionData = { emotion: "unknown", cause: "unknown" };
    }

    //Therapist behavior with emotion awareness
    const systemPrompt = `
You are a calm, empathetic AI therapist.

User emotion: ${emotionData.emotion}
Cause: ${emotionData.cause}

Response style:
- Speak naturally like a real human
- Avoid repeating similar sentence patterns
- Vary your wording each time
- Keep responses short (2–4 lines)

Response structure:
1. Acknowledge the feeling
2. Add a small insight or perspective
3. Offer ONE simple suggestion (if helpful)
4. Ask ONE thoughtful follow-up

Rules:
- Do NOT sound like a textbook or template
- Do NOT over-explain
- Do NOT give medical advice
- Be warm, simple, and real

Goal:
Make the user feel understood and slightly better after each reply.
`;

    const conversation = messages
      .map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.text}`)
      .join("\n");

    const finalPrompt = `${systemPrompt}\n\n${conversation}\nAI:`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: finalPrompt,
    });

    return Response.json({
      reply: response.text,
      emotion: emotionData
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Something went wrong" });
  }
}
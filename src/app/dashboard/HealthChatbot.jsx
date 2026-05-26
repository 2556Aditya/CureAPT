"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const SYSTEM_PROMPT = `You are Vitale, a warm and knowledgeable health & wellness companion. Your role is strictly limited to health, wellness, nutrition, fitness, mental wellbeing, sleep, and related medical information.

Rules:
- Only answer health-related questions. If asked anything else, kindly redirect.
- Never diagnose conditions or prescribe medications.
- Always recommend consulting a qualified healthcare professional for serious concerns.
- Be warm, supportive, and concise. Use simple language.
- When relevant, add a brief disclaimer at the end.`;

const GEMINI_MODEL = "gemini-2.5-flash";
const PANEL_W = 370;
const PANEL_H = 560;

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "var(--accent)",
          display: "inline-block",
          animation: `vitale-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          opacity: 0.7,
        }} />
      ))}
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: "14px",
      animation: "vitale-fadeup 0.3s ease forwards",
    }}>
      {!isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "linear-gradient(135deg, #00c9a7, #007a65)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, marginRight: 8, flexShrink: 0, marginTop: 2,
          boxShadow: "0 2px 8px rgba(0,201,167,0.35)",
        }}>✦</div>
      )}
      <div style={{
        maxWidth: "75%",
        padding: isUser ? "10px 15px" : "12px 15px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        background: isUser ? "linear-gradient(135deg, #00c9a7, #007a65)" : "rgba(255,255,255,0.06)",
        border: isUser ? "none" : "1px solid rgba(255,255,255,0.09)",
        color: isUser ? "#fff" : "rgba(255,255,255,0.88)",
        fontSize: 13.5, lineHeight: 1.65,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.01em",
        boxShadow: isUser ? "0 4px 14px rgba(0,201,167,0.3)" : "0 2px 8px rgba(0,0,0,0.2)",
        whiteSpace: "pre-wrap",
        backdropFilter: "blur(8px)",
      }}>
        {msg.content}
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  "How to sleep better?",
  "Foods for immunity boost",
  "Managing daily stress",
  "Staying hydrated tips",
];

export default function HealthChatbot({ apiKey, isOpen: isOpenProp, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Drag state
  const [pos, setPos] = useState(null); // null = default CSS bottom-right
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const panelRef = useRef(null);
  const hasDragged = useRef(false); // distinguish click vs drag on header

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const open = isOpenProp !== undefined ? isOpenProp : isOpen;

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    // Reset to default position each time panel opens
    if (open) setPos(null);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Drag logic ────────────────────────────────────────────────
  const clamp = useCallback((x, y) => {
    const maxX = window.innerWidth - PANEL_W - 8;
    const maxY = window.innerHeight - PANEL_H - 8;
    return {
      x: Math.max(8, Math.min(x, maxX)),
      y: Math.max(8, Math.min(y, maxY)),
    };
  }, []);

  const onPointerDown = useCallback((e) => {
    // Only drag on the header bar itself, not its buttons
    if (e.target.closest("button")) return;
    e.preventDefault();
    hasDragged.current = false;

    const rect = panelRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    dragOffset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    setIsDragging(true);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!isDragging) return;
    hasDragged.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPos(clamp(
      clientX - dragOffset.current.x,
      clientY - dragOffset.current.y,
    ));
  }, [isDragging, clamp]);

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchmove", onPointerMove, { passive: false });
    window.addEventListener("touchend", onPointerUp);
    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, [isDragging, onPointerMove, onPointerUp]);
  // ─────────────────────────────────────────────────────────────

  const buildHistory = (msgs) =>
    msgs.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setShowSuggestions(false);
    const newMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: buildHistory(newMessages),
            generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
          }),
        }
      );
      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm having trouble responding right now. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please check your network and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const toggleOpen = () => {
    if (isOpenProp !== undefined && onClose) { onClose(); } else { setIsOpen((v) => !v); }
  };

  // Panel position style — fixed bottom-right until first drag
  const panelStyle = pos
    ? { top: pos.y, left: pos.x, bottom: "auto", right: "auto" }
    : { bottom: 90, right: 24 };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');

        @keyframes vitale-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes vitale-fadeup {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes vitale-slidein {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes vitale-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,201,167,0.45); }
          50%       { box-shadow: 0 0 0 10px rgba(0,201,167,0); }
        }
        @keyframes vitale-orb {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(12px, -10px) scale(1.06); }
          66%       { transform: translate(-8px, 8px) scale(0.95); }
        }

        .vitale-panel {
          position: fixed;
          width: 370px;
          height: 560px;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          z-index: 9999;
          animation: vitale-slidein 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
          box-shadow:
            0 30px 80px rgba(0,0,0,0.5),
            0 0 0 1px rgba(255,255,255,0.07),
            inset 0 1px 0 rgba(255,255,255,0.1);
          --accent: #00c9a7;
          --accent-dark: #007a65;
          --bg: #0d1117;
          --text: rgba(255,255,255,0.88);
          --muted: rgba(255,255,255,0.4);
          font-family: 'DM Sans', sans-serif;
          transition: box-shadow 0.2s;
        }

        .vitale-panel.is-dragging {
          box-shadow:
            0 48px 100px rgba(0,0,0,0.65),
            0 0 0 1px rgba(0,201,167,0.25),
            inset 0 1px 0 rgba(255,255,255,0.12);
          animation: none;
        }

        .vitale-bg { position: absolute; inset: 0; background: var(--bg); z-index: 0; }

        .vitale-orb1 {
          position: absolute; width: 280px; height: 280px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,201,167,0.12) 0%, transparent 70%);
          top: -80px; right: -80px;
          animation: vitale-orb 8s ease-in-out infinite;
          pointer-events: none; z-index: 0;
        }
        .vitale-orb2 {
          position: absolute; width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,122,101,0.1) 0%, transparent 70%);
          bottom: 80px; left: -60px;
          animation: vitale-orb 11s ease-in-out infinite reverse;
          pointer-events: none; z-index: 0;
        }

        .vitale-header {
          position: relative; z-index: 1;
          padding: 18px 20px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          display: flex; align-items: center; gap: 12px;
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
        }
        .vitale-header:active { cursor: grabbing; }

        .vitale-drag-hint {
          position: absolute;
          top: 7px; left: 50%; transform: translateX(-50%);
          width: 32px; height: 3px; border-radius: 2px;
          background: rgba(255,255,255,0.15);
          transition: background 0.2s, width 0.2s;
        }
        .vitale-header:hover .vitale-drag-hint {
          background: rgba(0,201,167,0.45);
          width: 40px;
        }

        .vitale-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, #00c9a7, #007a65);
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
          box-shadow: 0 0 0 3px rgba(0,201,167,0.2), 0 4px 12px rgba(0,201,167,0.3);
          flex-shrink: 0; pointer-events: none;
        }
        .vitale-title {
          font-family: 'Syne', sans-serif;
          font-size: 17px; font-weight: 700;
          color: #fff; letter-spacing: -0.02em;
          pointer-events: none;
        }
        .vitale-subtitle {
          font-size: 11.5px; color: var(--muted);
          margin-top: 1px; letter-spacing: 0.02em;
          display: flex; align-items: center; gap: 5px;
          pointer-events: none;
        }
        .vitale-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent); box-shadow: 0 0 6px var(--accent);
          flex-shrink: 0;
        }
        .vitale-close {
          margin-left: auto;
          width: 30px; height: 30px; border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--muted); font-size: 16px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
          pointer-events: all;
        }
        .vitale-close:hover { background: rgba(255,255,255,0.12); color: #fff; }

        .vitale-messages {
          flex: 1; overflow-y: auto; padding: 18px 16px 8px;
          position: relative; z-index: 1;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .vitale-messages::-webkit-scrollbar { width: 4px; }
        .vitale-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        .vitale-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          height: 100%; gap: 10px;
          animation: vitale-fadeup 0.5s ease forwards;
        }
        .vitale-empty-icon {
          width: 60px; height: 60px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(0,201,167,0.15), rgba(0,122,101,0.1));
          border: 1px solid rgba(0,201,167,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; margin-bottom: 6px;
        }
        .vitale-empty-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #fff; }
        .vitale-empty-sub { font-size: 12.5px; color: var(--muted); text-align: center; max-width: 220px; line-height: 1.6; }
        .vitale-suggestions { display: flex; flex-wrap: wrap; gap: 7px; justify-content: center; margin-top: 14px; }
        .vitale-chip {
          padding: 6px 12px; border-radius: 20px;
          background: rgba(0,201,167,0.08); border: 1px solid rgba(0,201,167,0.2);
          color: var(--accent); font-size: 11.5px;
          cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }
        .vitale-chip:hover {
          background: rgba(0,201,167,0.16); border-color: rgba(0,201,167,0.45);
          transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,201,167,0.15);
        }

        .vitale-footer {
          position: relative; z-index: 1;
          padding: 12px 14px 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(20px);
        }
        .vitale-input-row {
          display: flex; align-items: flex-end; gap: 10px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 10px 10px 10px 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .vitale-input-row:focus-within {
          border-color: rgba(0,201,167,0.45); box-shadow: 0 0 0 3px rgba(0,201,167,0.08);
        }
        .vitale-textarea {
          flex: 1; background: none; border: none; outline: none;
          color: var(--text); font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          resize: none; line-height: 1.5; max-height: 80px; scrollbar-width: none;
        }
        .vitale-textarea::placeholder { color: rgba(255,255,255,0.25); }
        .vitale-send {
          width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #00c9a7, #007a65);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; box-shadow: 0 2px 10px rgba(0,201,167,0.35);
          color: #fff; font-size: 15px;
        }
        .vitale-send:hover:not(:disabled) { transform: scale(1.08); box-shadow: 0 4px 16px rgba(0,201,167,0.5); }
        .vitale-send:disabled { opacity: 0.4; cursor: not-allowed; }

        .vitale-disclaimer {
          text-align: center; font-size: 10px;
          color: rgba(255,255,255,0.2); margin-top: 8px; letter-spacing: 0.03em;
        }

        .vitale-fab {
          position: fixed; bottom: 24px; right: 24px;
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(135deg, #00c9a7, #007a65);
          border: none; cursor: pointer; z-index: 9998;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; color: #fff;
          box-shadow: 0 6px 24px rgba(0,201,167,0.45);
          transition: transform 0.2s;
          animation: vitale-pulse 2.5s ease-in-out infinite;
        }
        .vitale-fab:hover { transform: scale(1.1); }
      `}</style>

      {isOpenProp === undefined && (
        <button className="vitale-fab" onClick={toggleOpen} aria-label="Open health assistant">
          {open ? "✕" : "✦"}
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          className={`vitale-panel${isDragging ? " is-dragging" : ""}`}
          style={panelStyle}
          role="dialog"
          aria-label="Vitale health assistant"
        >
          <div className="vitale-bg" />
          <div className="vitale-orb1" />
          <div className="vitale-orb2" />

          {/* Header — drag handle */}
          <div
            className="vitale-header"
            onMouseDown={onPointerDown}
            onTouchStart={onPointerDown}
          >
            {/* Drag pill indicator */}
            <div className="vitale-drag-hint" aria-hidden="true" />

            <div className="vitale-avatar">✦</div>
            <div>
              <div className="vitale-title">Vitale</div>
              <div className="vitale-subtitle">
                <span className="vitale-dot" />
                Health &amp; Wellness Assistant
              </div>
            </div>
            <button className="vitale-close" onClick={toggleOpen} aria-label="Close">✕</button>
          </div>

          {/* Messages */}
          <div className="vitale-messages">
            {messages.length === 0 && showSuggestions ? (
              <div className="vitale-empty">
                <div className="vitale-empty-icon">🌿</div>
                <div className="vitale-empty-title">How can I help you?</div>
                <div className="vitale-empty-sub">Ask me anything about your health, nutrition, fitness, or wellbeing.</div>
                <div className="vitale-suggestions">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} className="vitale-chip" onClick={() => send(s)}>{s}</button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                {loading && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: "linear-gradient(135deg, #00c9a7, #007a65)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, flexShrink: 0, boxShadow: "0 2px 8px rgba(0,201,167,0.35)",
                    }}>✦</div>
                    <div style={{
                      padding: "10px 14px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      borderRadius: "18px 18px 18px 4px",
                    }}>
                      <TypingDots />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Footer */}
          <div className="vitale-footer">
            <div className="vitale-input-row">
              <textarea
                ref={inputRef}
                className="vitale-textarea"
                rows={1}
                placeholder="Ask about your health…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px";
                }}
                disabled={loading}
              />
              <button
                className="vitale-send"
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                aria-label="Send"
              >↑</button>
            </div>
            <div className="vitale-disclaimer">Not a substitute for professional medical advice</div>
          </div>
        </div>
      )}
    </>
  );
}
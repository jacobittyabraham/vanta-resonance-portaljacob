"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Check, LoaderCircle, Radio, RotateCcw, ShieldCheck } from "lucide-react";

type FormState = {
  name: string;
  age: string;
  location: string;
  email: string;
  message: string;
};

type ChatMessage = {
  id: number;
  from: "vanta" | "user";
  text: string;
};

const emptyForm: FormState = {
  name: "",
  age: "",
  location: "",
  email: "",
  message: "",
};

const questions = [
  { key: "name", text: "First, what should I call you?", placeholder: "Your name" },
  { key: "age", text: "How old are you?", placeholder: "Your age" },
  { key: "location", text: "Where are you reaching me from?", placeholder: "City / area" },
  { key: "email", text: "And where can I reach you if we get disconnected?", placeholder: "you@example.com" },
  { key: "message", text: "I have the basics. Now tell me what happened.", placeholder: "Tell Vanta what you need help with…" },
] as const;

export default function SignalChat({ onClose }: { onClose?: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, from: "vanta", text: "I detected a signal. I'm listening." },
    { id: 2, from: "vanta", text: questions[0].text },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending]);

  const current = questions[step];

  const progress = useMemo(() => ((step + 1) / questions.length) * 100, [step]);

  async function submitCurrent() {
    const value = input.trim();
    if (!value || sending || complete) return;

    setError("");
    setMessages((m) => [...m, { id: Date.now(), from: "user", text: value }]);

    const nextForm = { ...form, [current.key]: value } as FormState;
    setForm(nextForm);
    setInput("");

    if (step < questions.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      window.setTimeout(() => {
        setMessages((m) => [
          ...m,
          { id: Date.now() + 1, from: "vanta", text: questions[nextStep].text },
        ]);
      }, 260);
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Transmission failed.");
      }

      setComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transmission failed.");
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 2,
          from: "vanta",
          text: "The signal hit interference. Check the details and try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setStep(0);
    setForm(emptyForm);
    setInput("");
    setError("");
    setComplete(false);
    setMessages([
      { id: Date.now(), from: "vanta", text: "I detected a signal. I'm listening." },
      { id: Date.now() + 1, from: "vanta", text: questions[0].text },
    ]);
  }

  return (
    <section className="signal-panel" id="signal">
      <div className="signal-panel__top">
        <div className="signal-status"><span /> LIVE SIGNAL</div>
        <div className="signal-panel__meta">VANTA / RESONANCE-01</div>
      </div>

      <div className="signal-progress">
        <span style={{ width: `${complete ? 100 : progress}%` }} />
      </div>

      {!complete ? (
        <>
          <div className="chat-window" ref={scrollRef}>
            {messages.map((message) => (
              <div className={`chat-line chat-line--${message.from}`} key={message.id}>
                {message.from === "vanta" && (
                  <div className="chat-avatar"><Radio size={15} /></div>
                )}
                <div className="chat-bubble">{message.text}</div>
              </div>
            ))}
            {sending && (
              <div className="chat-line chat-line--vanta">
                <div className="chat-avatar"><Radio size={15} /></div>
                <div className="chat-bubble chat-bubble--typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </div>

          <div className="chat-composer">
            <div className="chat-input-wrap">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submitCurrent();
                  }
                }}
                type={current.key === "email" ? "email" : current.key === "age" ? "number" : "text"}
                placeholder={current.placeholder}
                disabled={sending}
                autoFocus
              />
              <button
                className="send-button"
                type="button"
                onClick={submitCurrent}
                disabled={!input.trim() || sending}
                aria-label="Send response"
              >
                {sending ? <LoaderCircle className="spin" size={18} /> : <ArrowUp size={18} />}
              </button>
            </div>
            <div className="chat-foot">
              <span>ENTER TO TRANSMIT</span>
              <span>{Math.round(complete ? 100 : progress)}%</span>
            </div>
            {error && <p className="chat-error">{error}</p>}
          </div>
        </>
      ) : (
        <div className="signal-success">
          <div className="success-orbit">
            <div className="success-core"><Check size={30} /></div>
          </div>
          <p className="eyebrow">SIGNAL RECEIVED</p>
          <h3>Vanta has<br />received your signal.</h3>
          <p className="success-copy">
            Your request has been transmitted. The response network has been notified.
          </p>
          <div className="success-details">
            <ShieldCheck size={17} />
            <span>Your information was transmitted securely.</span>
          </div>
          <div className="success-actions">
            <button className="button button--ghost" onClick={reset}>
              <RotateCcw size={15} /> SEND ANOTHER SIGNAL
            </button>
            {onClose && <button className="button button--primary" onClick={onClose}>RETURN TO VANTA</button>}
          </div>
        </div>
      )}
    </section>
  );
}
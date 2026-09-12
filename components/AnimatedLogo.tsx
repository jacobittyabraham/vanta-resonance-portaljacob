import { useId } from "react";

export default function AnimatedLogo({ compact = false }: { compact?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`vanta-logo ${compact ? "vanta-logo--compact" : ""}`} aria-label="Vanta">
      <svg viewBox="0 0 84 84" role="img">
        <defs>
          <linearGradient id={`g-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8ef2cf" />
            <stop offset="100%" stopColor="#b6fff0" />
          </linearGradient>
        </defs>
        <circle className="logo-ring" cx="42" cy="42" r="31" />
        <path className="logo-mark" d="M25 52 L42 22 L59 52 M32 42 H52" />
      </svg>
      {!compact && <span>VANTA</span>}
    </div>
  );
}
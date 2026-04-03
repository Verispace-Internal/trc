"use client";

import { useEffect, useRef, useState } from "react";

const CSS = `
@keyframes letter-rise {
  from { transform: translateY(0vw); }
  to   { transform: translateY(-5vw); }
}
@keyframes letter-fall {
  from { transform: translateY(-5vw); }
  to   { transform: translateY(0vw); }
}
@keyframes flap-open {
  0%   { transform: rotateX(0deg); }
  100% { transform: rotateX(-178deg); }
}
@keyframes flap-close {
  0%   { transform: rotateX(-178deg); }
  100% { transform: rotateX(0deg); }
}
@keyframes shadow-grow {
  from { opacity: 0.3; transform: scaleX(0.96); }
  to   { opacity: 0.7; transform: scaleX(1.04); }
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes stamp-appear {
  0%   { opacity: 0; transform: rotate(-8deg) scale(0.7); }
  60%  { transform: rotate(2deg) scale(1.08); }
  100% { opacity: 1; transform: rotate(-4deg) scale(1); }
}
@keyframes wax-pop {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes scan-line {
  0%   { top: 0%; opacity: 0.6; }
  100% { top: 100%; opacity: 0; }
}
@keyframes envelope-idle {
  0%,100% { transform: translateY(0px) rotate(0deg); }
  30%      { transform: translateY(-3px) rotate(0.3deg); }
  70%      { transform: translateY(-1px) rotate(-0.2deg); }
}

.letter-paper {
  animation: letter-fall 0.5s cubic-bezier(0.4,0,0.2,1) forwards;
}
.letter-paper.rising {
  animation: letter-rise 0.6s cubic-bezier(0.22,0.61,0.36,1) forwards;
}
.letter-paper.falling {
  animation: letter-fall 0.5s cubic-bezier(0.4,0,0.2,1) forwards;
}

.top-flap {
  transform-origin: top center;
  transform-style: preserve-3d;
  animation: flap-close 0.01s forwards;
}
.top-flap.opening {
  animation: flap-open 0.55s cubic-bezier(0.22,0.61,0.36,1) forwards;
}
.top-flap.closing {
  animation: flap-close 0.45s cubic-bezier(0.4,0,0.2,1) forwards;
}

.envelope-idle {
  animation: envelope-idle 4s ease-in-out infinite;
}
`;

export default function WhySection({ why }: {
  why: { title: string; description: string }
}) {
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const [opened, setOpened] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!document.getElementById("why-letter-css")) {
      const el = document.createElement("style");
      el.id = "why-letter-css";
      el.textContent = CSS;
      document.head.appendChild(el);
      styleRef.current = el;
    }
    return () => { styleRef.current?.remove(); };
  }, []);

  const handleClick = () => {
    if (animating) return;
    setAnimating(true);

    if (!opened) {
      // Open sequence
      setOpened(true);
      setTimeout(() => setShowContent(true), 400);
      setTimeout(() => setAnimating(false), 700);
    } else {
      // Close sequence
      setShowContent(false);
      setTimeout(() => setOpened(false), 300);
      setTimeout(() => setAnimating(false), 700);
    }
  };

  return (
    <section
      style={{
        width: "100%",
        padding: "80px 16px 100px",
        background: "var(--bg-main)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Section Title */}
      <h2
        style={{
          fontSize: "clamp(24px, 5vw, 48px)",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "-0.03em",
          textAlign: "center",
          marginBottom: "clamp(60px, 12vw, 100px)",
          lineHeight: 1.1,
        }}
      >
        {why.title}
      </h2>

      {/* Letter + Envelope Container */}
      <div
        style={{
          position: "relative",
          maxWidth: "480px",
width: "100%",
padding: "0 12px",
          
          cursor: animating ? "default" : "pointer",
          userSelect: "none",
        }}
        onClick={handleClick}
      >

        {/* ── LETTER PAPER (slides out above) ── */}
        <div
          className={`letter-paper ${opened ? "rising" : "falling"}`}
          style={{
            position: "absolute",
            top: 0,
            left: "5%",
            transform: "translateX(-50%) translateY(0px)",
            width: "clamp(260px, 90%, 420px)",
            zIndex: opened ? 30 : 0,
            pointerEvents: opened ? "auto" : "none",
  
          }}
        >
          <div
            style={{
              background: "#FAFAF8",
              borderRadius: "12px",
              padding: "clamp(16px, 4vw, 32px)",
              boxShadow: opened
                ? "0 24px 60px rgba(0,0,0,0.45), 0 8px 20px rgba(0,0,0,0.25)"
                : "none",
              border: "1px solid rgba(255,255,255,0.06)",
              minHeight: "220px",
            }}
          >
            {/* Letterhead */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
                paddingBottom: "14px",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "#0a0e18",
                    letterSpacing: "-0.04em",
                  }}
                >
                  trc.
                </div>
                <div style={{ fontSize: "10px", color: "#888", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "1px" }}>
                  The Rentux Company
                </div>
              </div>

              {/* Stamp */}
              <div
                style={{
                  width: "clamp(36px, 10vw, 48px)",
height: "clamp(44px, 12vw, 56px)",
                  border: "2px solid rgba(34,197,94,0.6)",
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  background: "rgba(34,197,94,0.06)",
                  animation: showContent ? "stamp-appear 0.5s ease 0.15s both" : "none",
                  opacity: showContent ? undefined : 0,
                  transform: "rotate(-4deg)",
                }}
              >
                <div style={{ fontSize: "16px", lineHeight: 1 }}>✦</div>
                <div style={{ fontSize: "8px", fontWeight: 700, color: "rgba(34,197,94,0.8)", letterSpacing: "0.04em" }}>
                  TRC
                </div>
              </div>
            </div>

            {/* Content lines */}
            <div
              style={{
                opacity: showContent ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              {/* Date line */}
              <div style={{ fontSize: "11px", color: "#999", marginBottom: "14px", letterSpacing: "0.02em" }}>
                To: Our Community &nbsp;·&nbsp; Est. 2024
              </div>

              {/* Body text */}
              <p
                style={{
                  fontSize: "clamp(13px, 3.2vw, 15px)",
                  lineHeight: 1.7,
                  color: "#2a2a2a",
                  margin: 0,
                  fontFamily: "Georgia, serif",
                }}
              >
                {why.description}
              </p>

              {/* Signature */}
              <div style={{ marginTop: "24px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div>
                  <div
                    style={{
                      fontSize: "22px",
                      color: "#1a1a2e",
                      fontFamily: "'Brush Script MT', cursive, Georgia, serif",
                      lineHeight: 1,
                      marginBottom: "2px",
                    }}
                  >
                    The TRC Team
                  </div>
                  <div style={{ fontSize: "10px", color: "#aaa", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Rentux Company
                  </div>
                </div>

                {/* Wax seal */}
                <div
                  style={{
                    width: "clamp(32px, 10vw, 44px)",
height: "clamp(32px, 10vw, 44px)",
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 35% 35%, #c53030, #7f1d1d)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(127,29,29,0.5), inset 0 1px 2px rgba(255,255,255,0.2)",
                    animation: showContent ? "wax-pop 0.4s ease 0.3s both" : "none",
                    opacity: showContent ? undefined : 0,
                    transform: showContent ? undefined : "scale(0)",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                    T
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ENVELOPE ── */}
        <div
          className={!opened ? "envelope-idle" : ""}
          style={{
            position: "relative",
            zIndex: 10,
            marginTop: "clamp(120px, 20vw, 110px)",
            width: "100%",
           
            perspective: "800px",
          }}
        >
          {/* Envelope body */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "0",
              paddingTop:"10%",
              paddingBottom: "62%",
              borderRadius: "16px",
              overflow: "visible",
            }}
          >
            {/* Back of envelope */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "16px",
                background: "#0e1420",
                border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              {/* Envelope inner diamond pattern (decorative lining) */}
              <svg
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                viewBox="0 0 480 300"
                preserveAspectRatio="none"
              >
                {/* Left flap */}
                <polygon points="0,0 0,300 220,150" fill="#0b1019" />
                {/* Right flap */}
                <polygon points="480,0 480,300 260,150" fill="#090d15" />
                {/* Bottom flap */}
                <polygon points="0,300 480,300 240,150" fill="#080c13" />
                {/* Crease lines */}
                <line x1="0" y1="0" x2="240" y2="150" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <line x1="480" y1="0" x2="240" y2="150" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <line x1="0" y1="300" x2="240" y2="150" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <line x1="480" y1="300" x2="240" y2="150" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              </svg>

              {/* Brand mark bottom-left */}
              <div
                style={{
                  position: "absolute",
                  bottom: "14px",
                  left: "16px",
                  background: "var(--text-primary)",
                  color: "var(--bg-main)",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                trc.
              </div>

              {/* To: address */}
              <div
                style={{
                  position: "absolute",
                  bottom: "14px",
                  right: "16px",
                  textAlign: "right",
                  opacity: 0.35,
                }}
              >
                <div style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>To</div>
                <div style={{ fontSize: "11px", color: "var(--text-primary)", fontWeight: 500, letterSpacing: "-0.01em" }}>Our Community</div>
              </div>
            </div>

            {/* ── TOP FLAP (3D fold) ── */}
            <div
              className={`top-flap ${opened ? "opening" : "closing"}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "55%",
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
                zIndex: 20,
              }}
            >
              {/* Front face of flap */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "16px 16px 0 0",
                  overflow: "hidden",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <svg
                  style={{ width: "100%", height: "100%" }}
                  viewBox="0 0 480 180"
                  preserveAspectRatio="none"
                >
                  {/* Top flap triangle */}
                  <polygon points="0,0 480,0 240,165" fill="#0d1320" />
                  <line x1="0" y1="0" x2="240" y2="165" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="480" y1="0" x2="240" y2="165" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                </svg>
              </div>

              {/* Back face of flap (inside when open) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "16px 16px 0 0",
                  overflow: "hidden",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateX(180deg)",
                  background: "#F5F4F0",
                }}
              >
                {/* Inside flap — kraft paper look */}
                <svg
                  style={{ width: "100%", height: "100%" }}
                  viewBox="0 0 480 180"
                  preserveAspectRatio="none"
                >
                  <polygon points="0,0 480,0 240,165" fill="#EDE8DC" />
                  {/* Subtle grain lines */}
                  <line x1="0" y1="30" x2="480" y2="30" stroke="rgba(0,0,0,0.03)" strokeWidth="8" />
                  <line x1="0" y1="70" x2="480" y2="70" stroke="rgba(0,0,0,0.025)" strokeWidth="10" />
                  <line x1="0" y1="110" x2="480" y2="110" stroke="rgba(0,0,0,0.02)" strokeWidth="8" />
                </svg>
              </div>
            </div>

            {/* Envelope border ring */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.08)",
                pointerEvents: "none",
                zIndex: 21,
              }}
            />
          </div>

          {/* Drop shadow */}
          <div
            style={{
              position: "absolute",
              bottom: "-12px",
              left: "5%",
              right: "5%",
              height: "20px",
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              filter: "blur(12px)",
              animation: opened
                ? "shadow-grow 0.5s ease forwards"
                : "none",
              opacity: 0.4,
              zIndex: 0,
            }}
          />
        </div>

        {/* Click hint */}
        {!opened && (
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "12px",
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              opacity: 0.6,
              animation: "fade-in-up 0.6s ease 0.5s both",
            }}
          >
            Click to open ↑
          </div>
        )}

        {!opened && (
          <div
            style={{
              textAlign: "center",
              marginTop: "6px",
              fontSize: "11px",
              color: "var(--text-muted)",
              opacity: 0.4,
            }}
          >
            A message from us
          </div>
        )}

        {opened && (
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "12px",
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
              opacity: 0.5,
            }}
          >
            Click to close ↓
          </div>
        )}
      </div>
    </section>
  );
}
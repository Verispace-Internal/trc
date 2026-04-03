"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

// ── inject keyframes once ──────────────────────────────────────────────────
const CSS = `
@keyframes hero-fade-up {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes hero-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes orb-drift-1 {
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(40px,-30px) scale(1.08); }
  66%      { transform: translate(-25px,20px) scale(0.95); }
}
@keyframes orb-drift-2 {
  0%,100% { transform: translate(0,0) scale(1); }
  40%      { transform: translate(-50px,30px) scale(1.1); }
  70%      { transform: translate(30px,-40px) scale(0.92); }
}
@keyframes orb-drift-3 {
  0%,100% { transform: translate(0,0) scale(1); }
  50%      { transform: translate(20px,50px) scale(1.05); }
}
@keyframes grid-pulse {
  0%,100% { opacity: 0.025; }
  50%      { opacity: 0.055; }
}
@keyframes badge-glow {
  0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
  50%      { box-shadow: 0 0 16px 2px rgba(239,68,68,0.18); }
}
@keyframes blink-dot {
  0%,100% { opacity: 1; }
  50%      { opacity: 0.3; }
}
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
@keyframes cta-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.12); }
  50%      { box-shadow: 0 0 0 6px rgba(255,255,255,0); }
}
@keyframes float-particle {
  0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 0.6; }
  100% { transform: translateY(-120px) translateX(var(--dx)); opacity: 0; }
}
`;

// ── tiny particle data ─────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${8 + (i * 5.2) % 84}%`,
  bottom: `${5 + (i * 7) % 30}%`,
  size: 1.5 + (i % 3) * 0.8,
  delay: `${(i * 0.55) % 6}s`,
  duration: `${5 + (i * 0.7) % 5}s`,
  dx: `${-20 + (i * 13) % 40}px`,
  color: i % 4 === 0 ? "rgba(239,68,68,0.7)" : i % 4 === 1 ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.35)",
}));

export default function HeroSection({ hero }: { hero: { title: string; subtitle: string; cta: { href: string; label: string } } }) {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!document.getElementById("hero-keyframes")) {
      const el = document.createElement("style");
      el.id = "hero-keyframes";
      el.textContent = CSS;
      document.head.appendChild(el);
      styleRef.current = el;
    }
    return () => { styleRef.current?.remove(); };
  }, []);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-main)",
        overflow: "hidden",
        padding: "80px 16px",
      }}
    >

      {/* ── GRID PATTERN ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0,
          animation: "grid-pulse 6s ease-in-out infinite",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 10%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 10%, transparent 75%)",
          pointerEvents: "none",
        }}
      />

      {/* ── ORB 1 — indigo center ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orb-drift-1 18s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* ── ORB 2 — red accent top-right ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "orb-drift-2 22s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* ── ORB 3 — deep blue bottom-left ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "5%",
          left: "5%",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
          filter: "blur(70px)",
          animation: "orb-drift-3 26s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* ── FLOATING PARTICLES ── */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          aria-hidden
          style={{
            position: "absolute",
            left: p.left,
            bottom: p.bottom,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: p.color,
            animationName: "float-particle",
            animationDuration: p.duration,
            animationDelay: p.delay,
            animationTimingFunction: "ease-out",
            animationIterationCount: "infinite",
            "--dx": p.dx,
            pointerEvents: "none",
          } as React.CSSProperties}
        />
      ))}

      {/* ── CONTENT ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          maxWidth: "860px",
          width: "100%",
        }}
      >

        {/* ── BADGE ── */}
      

        {/* ── HEADLINE ── */}
        <h1
          style={{
            fontSize: "clamp(36px, 7vw, 76px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.08,
            color: "var(--text-primary)",
            margin: "0 0 4px",
            animation: "hero-fade-up 0.8s ease 0.1s both",
          }}
        >
          {(() => {
            const words = (hero.title as string).trim().split(" ");
            const last = words.pop();
            return (
              <>
                {words.join(" ")}{" "}
                <span
                  style={{
                    backgroundImage: "linear-gradient(135deg, var(--text-primary) 30%, rgba(239,68,68,0.9) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                >
                  {last}
                </span>
              </>
            );
          })()}
        </h1>

        {/* ── SHIMMER RULE ── */}
        <div
          aria-hidden
          style={{
            width: "120px",
            height: "2px",
            margin: "20px auto 0",
            borderRadius: "999px",
            backgroundImage: "linear-gradient(90deg, transparent, rgba(255, 255, 255), rgba(0, 97, 227, 0.48), transparent)",
            backgroundSize: "400px 2px",
            animation: "shimmer 3s linear infinite, hero-fade-in 1s ease 0.4s both",
            opacity: 0,
          }}
        />

        {/* ── SUBTITLE ── */}
        <p
          style={{
            marginTop: "24px",
            color: "var(--text-muted)",
            fontSize: "clamp(14px, 2vw, 18px)",
            lineHeight: 1.65,
            maxWidth: "560px",
            marginLeft: "auto",
            marginRight: "auto",
            fontWeight: 400,
            letterSpacing: "0.005em",
            animation: "hero-fade-up 0.8s ease 0.25s both",
          }}
        >
          {hero.subtitle}
        </p>

        {/* ── CTA ROW ── */}
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
            flexWrap: "wrap",
            animation: "hero-fade-up 0.8s ease 0.4s both",
          }}
        >
          {/* Primary CTA */}
          <Link
            href={hero.cta.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              padding: "13px 28px",
              borderRadius: "999px",
              background: "var(--text-primary)",
              color: "var(--bg-main)",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              textDecoration: "none",
              transition: "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
              animation: "cta-pulse 3s ease-in-out 1s infinite",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-2px) scale(1.03)";
              el.style.boxShadow = "0 12px 32px rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0) scale(1)";
              el.style.boxShadow = "none";
            }}
          >
            {hero.cta.label}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

      </div>

      {/* ── BOTTOM FADE ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(to bottom, transparent, var(--bg-main))",
          pointerEvents: "none",
        }}
      />

    </section>
  );
}
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { homeData } from "./data/home";
import { useInView } from "react-intersection-observer";

// ✅ Dynamic Imports (Code Splitting)
const Navbar = dynamic(() => import("./components/home/Navbar"));
const HeroSection = dynamic(() => import("./components/home/Herosection"));
const AutoSlider = dynamic(() => import("./components/home/AutoSlider"), {
  ssr: false,
});
const WhySection = dynamic(() => import("./components/home/WhySection"));
const Testimonials = dynamic(
  () => import("./components/home/Testimonials"),
  { ssr: false }
);
const Footer = dynamic(() => import("./components/home/Footer"));

/* ================= BENEFIT CARD ================= */
const BenefitCard = ({ item }: { item: any }) => {
  return (
    <div
      className="
      relative group
      h-[250px]
      rounded-2xl
      bg-[var(--bg-navbar)]
      overflow-hidden
      flex items-center justify-center
      cursor-pointer
    "
    >
      {/* FRONT */}
      <div
        className="
        absolute inset-0
        flex items-center justify-center
        text-[var(--text-primary)] text-xl md:text-2xl font-semibold
        transition-all duration-500
        group-hover:-translate-y-full
      "
      >
        {item.title}
      </div>

      {/* BACK */}
      <div
        className="
        absolute inset-0
        flex items-center justify-center
        text-[var(--text-primary)] text-sm px-6 text-left
        opacity-0
        translate-y-full
        transition-all duration-500
        group-hover:translate-y-0
        group-hover:opacity-100
      "
      >
        {item.description}
      </div>
    </div>
  );
};

/* ================= BENEFITS SECTION ================= */
const BenefitsSection = ({ benefits }: { benefits: any }) => {
  return (
    <section className="w-full py-24 bg-[var(--bg-main)] px-4 flex flex-col items-center">
      <h2 className="text-3xl md:text-5xl font-semibold text-[var(--text-primary)] mb-16">
        {benefits.title}
      </h2>

      <div className="w-full max-w-6xl bg-[var(--border-soft)] rounded-3xl p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.items.map((item: any, index: number) => (
            <BenefitCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ================= PROCESS SECTION ================= */
import Link from "next/link";

const ProcessSection = ({ process }: { process: any }) => {
  return (
    <section className="w-full py-16 md:py-28 bg-[var(--bg-main)] overflow-hidden">

      {/* TITLE */}
      <h2 className="text-center text-2xl sm:text-3xl md:text-5xl font-semibold text-[var(--text-primary)] mb-16 md:mb-28 px-4">
        {process.title}
      </h2>

      {/* ── MOBILE: simple vertical stack ── */}
      <div className="flex flex-col gap-6 px-4 max-w-sm mx-auto md:hidden">
        {process.steps.map((step: any, index: number) => (
          <div key={index} className="relative group">
            {/* connector line between cards */}
            {index < process.steps.length - 1 && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-px h-6 bg-white/20 z-10" />
            )}

            {/* GLOW */}
            <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl" />

            {/* CARD */}
            <div className="
              relative
              bg-[var(--text-primary)]
              text-[var(--bg-main)]
              rounded-2xl
              p-6
              shadow-2xl
              flex flex-col items-center text-center
              transition-all duration-300
              group-hover:-translate-y-1
            ">
              <div className="w-10 h-10 mb-4 bg-[var(--bg-main)] text-[var(--text-primary)] rounded-full flex items-center justify-center text-sm font-bold shadow-md shrink-0">
                {index + 1}
              </div>
              <p className="font-semibold text-base leading-snug">{step.title}</p>
              {step.button && (
                <Link
                  href="/joincommunity"
                  className="inline-block mt-4 px-5 py-2 rounded-lg text-sm bg-[var(--bg-main)] text-[var(--text-primary)] hover:opacity-80 transition"
                >
                  {step.button}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── DESKTOP: zigzag with SVG line ── */}
      <div className="relative max-w-6xl mx-auto hidden md:block px-6">

        {/* SVG CURVED LINE */}
        <svg
          className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[400px] opacity-40 pointer-events-none"
          viewBox="0 0 200 800"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M100 0 
               C 180 100, 20 200, 100 300
               C 180 400, 20 500, 100 600
               C 180 700, 100 800, 100 800"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="6 10"
          />
        </svg>

        {/* STEPS */}
        <div className="flex flex-col gap-32">
          {process.steps.map((step: any, index: number) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={index}
                className={`flex items-center ${isLeft ? "justify-start" : "justify-end"}`}
              >
                <div className="relative text-center group w-[320px]">

                  {/* GLOW */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl" />

                  {/* CARD */}
                  <div className="
                    relative h-[200px]
                    bg-[var(--text-primary)]
                    text-[var(--bg-main)]
                    rounded-2xl
                    p-6 mt-5
                    shadow-2xl
                    flex flex-col items-center
                    transition-all duration-300
                    group-hover:-translate-y-2
                  ">
                    <div className="w-10 h-10 mb-4 bg-[var(--bg-main)] text-[var(--text-primary)] rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                      {index + 1}
                    </div>
                    <p className="font-semibold text-lg leading-snug">{step.title}</p>
                    {step.button && (
                      <Link
                        href="/joincommunity"
                        className="inline-block mt-4 px-5 py-2 rounded-lg text-sm bg-[var(--bg-main)] text-[var(--text-primary)] hover:opacity-80 transition"
                      >
                        {step.button}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
/* ================= MAIN PAGE ================= */
export default function Home() {
  const { hero, why, benefits, process } = homeData;

  // ✅ Lazy Load Testimonials
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <>
      <Navbar />

      <HeroSection hero={hero} />

      <AutoSlider />

      <BenefitsSection benefits={benefits} />

      <WhySection why={why} />


      <ProcessSection process={process} />

      {/* Lazy Testimonials */}
      <div ref={ref}>
        {inView && <Testimonials />}
      </div>

      <Footer />
    </>
  );
}
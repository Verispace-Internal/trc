"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/Store/Store";

export default function AutoSlider() {
  const { companies } = useSelector(
    (state: RootState) => state.companyReducer
  );

  /* ✅ Extract company logos */
  const logos = useMemo(() => {
    const validLogos = companies
      .filter((c) => c.companyLogo?.url)
      .map((c) => ({
        src: c.companyLogo!.url,
        alt: c.companyName,
      }));

    /* duplicate for infinite scroll */
    return [...validLogos, ...validLogos];
  }, [companies]);

  return (
    <section className="relative w-full py-16 overflow-hidden bg-main">

      {/* Title */}
      <div className="flex justify-center mb-10">
        <div className="relative text-center">
          <div className="absolute inset-0 blur-xl bg-[var(--bg-navbar)]/60 rounded-full"></div>
          <h2 className="relative text-xl md:text-2xl font-semibold text-primary tracking-wide">
            Trusted by Rental Businesses
          </h2>
        </div>
      </div>

      {/* Gradient fade */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-main to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-main to-transparent z-10" />

      {/* Slider */}
      <div className="overflow-hidden">
        <div className="flex gap-10 animate-scroll items-center">

          {logos.length > 0 ? (
            logos.map((logo, index) => (
              <div
                key={`${logo.src}-${index}`}
                className="
                  min-w-[180px] md:min-w-[220px]
                  h-[90px]
                  rounded-full
                  bg-[var(--border-soft)]
                  border border-[var(--border-soft)]
                  backdrop-blur-md
                  flex items-center justify-center
                  transition-all duration-300
                  hover:bg-[var(--border-glow)]
                "
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={50}
                  className="object-contain opacity-80 hover:opacity-100 transition"
                  loading="lazy"
                  quality={75}
                  sizes="120px"
                />
              </div>
            ))
          ) : (
            <div className="w-full text-center text-sm text-white/30">
              No company logos available
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { X, Phone, Mail, Globe, MapPin, Package } from "lucide-react";

export interface Company {
  _id: string;
  companyName: string;
  companyInfo: string;
  about: string;
  companyLogo?: { url: string; fileId: string } | null;
  categoriesServed: string[];
  citiesCovered: string[];
  assetsHandled: string[];
  websiteSocials: string[];
  status?: string;
  phone?: string;
  email?: string;
  establishedYear?: string;
  owner?: string;
  address?: string;
}

// ─── Animation styles injected once ──────────────────────────────────────────
const MODAL_STYLES = `
  .modal-overlay {
    transition: opacity 280ms cubic-bezier(0.4, 0, 0.2, 1),
                backdrop-filter 280ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  .modal-overlay.entering,
  .modal-overlay.exiting {
    opacity: 0;
  }
  .modal-overlay.entered {
    opacity: 1;
  }

  .modal-panel {
    transition: opacity 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
                transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .modal-panel.entering,
  .modal-panel.exiting {
    opacity: 0;
    transform: scale(0.92) translateY(16px);
  }
  .modal-panel.entered {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

// ─── Modal component ──────────────────────────────────────────────────────────
function CompanyModal({ company, onClose }: { company: Company; onClose: () => void }) {
  // "entering" → "entered" on mount; "exiting" on close
  const [phase, setPhase] = useState<"entering" | "entered" | "exiting">("entering");

  useEffect(() => {
    // Inject keyframe styles once
    if (!document.getElementById("modal-anim-styles")) {
      const tag = document.createElement("style");
      tag.id = "modal-anim-styles";
      tag.textContent = MODAL_STYLES;
      document.head.appendChild(tag);
    }

    // Trigger enter animation on next frame
    const raf = requestAnimationFrame(() => setPhase("entered"));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setPhase("exiting");
    setTimeout(onClose, 280); // match the transition duration
  };

  return (
    <div
      className={`modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ${phase}`}
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={handleClose}
    >
      {/* Modal panel */}
      <div
        className={`modal-panel relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto bg-[var(--bg-main)] border border-[var(--border-soft)] rounded-2xl shadow-2xl ${phase}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close X */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center transition"
        >
          <X size={13} className="text-white/50" />
        </button>

        <div className="p-5 flex flex-col gap-4">

          {/* ── ROW 1: Logo + Info card ── */}
          <div className="flex gap-4 items-stretch">
            {/* Logo box */}
            <div className="relative w-[130px] sm:w-[150px] shrink-0 rounded-2xl overflow-hidden border border-[var(--border-soft)] bg-[#1e2330]" style={{ minHeight: 140 }}>
              {company.companyLogo?.url ? (
                <Image
                  src={company.companyLogo.url}
                  alt={company.companyName}
                  fill
                  className="object-cover"
                  sizes="150px"
                  quality={85}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl font-black text-white/10">
                    {company.companyName?.charAt(0)?.toUpperCase() || "C"}
                  </span>
                </div>
              )}
            </div>

            {/* Info card */}
            <div className="flex-1 border border-[var(--border-soft)] rounded-2xl p-4 flex flex-col justify-between gap-3">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-[var(--text-primary)] font-bold text-[15px] sm:text-base leading-tight">
                  {company.companyName}
                </h2>
                {company.categoriesServed?.length > 0 && (
                  <p className="text-white/50 text-[12.5px]">
                    Category: {company.categoriesServed.slice(0, 1).join(", ")}
                  </p>
                )}
                {company.citiesCovered?.length > 0 && (
                  <p className="text-white/50 text-[12.5px]">
                    Cities: {company.citiesCovered.slice(0, 3).join(", ")}
                  </p>
                )}
                {company.establishedYear && (
                  <p className="text-white/50 text-[12.5px]">Est.: {company.establishedYear}</p>
                )}
                {company.owner && (
                  <p className="text-white/50 text-[12.5px]">Owner: {company.owner}</p>
                )}
              </div>

              {/* Phone + Email */}
              <div className="flex gap-2 flex-wrap">
                {company.phone ? (
                  <a href={`tel:${company.phone}`} className="flex items-center gap-1.5 px-5 py-2 rounded-xl border border-[var(--border-soft)] text-[var(--text-primary)] text-[13px] font-semibold hover:bg-white/5 transition">
                    <Phone size={12} /> Phone
                  </a>
                ) : (
                  <button disabled className="flex items-center gap-1.5 px-5 py-2 rounded-xl border border-white/10 text-white/25 text-[13px] font-semibold cursor-not-allowed">
                    <Phone size={12} /> Phone
                  </button>
                )}
                {company.email ? (
                  <a href={`mailto:${company.email}`} className="flex items-center gap-1.5 px-5 py-2 rounded-xl border border-[var(--border-soft)] text-[var(--text-primary)] text-[13px] font-semibold hover:bg-white/5 transition">
                    <Mail size={12} /> Email
                  </a>
                ) : (
                  <button disabled className="flex items-center gap-1.5 px-5 py-2 rounded-xl border border-white/10 text-white/25 text-[13px] font-semibold cursor-not-allowed">
                    <Mail size={12} /> Email
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── ROW 2: About ── */}
          {company.about && (
            <div className="border border-[var(--border-soft)] rounded-2xl p-4">
              <p className="text-[12.5px] text-white/30 uppercase tracking-widest mb-2">About</p>
              <p className="text-[13px] text-white/60 leading-relaxed">{company.about}</p>
            </div>
          )}

          {/* ── ROW 3: Stats row ── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Asset Types", value: company.assetsHandled?.length ?? 0 },
              { label: "Cities", value: company.citiesCovered?.length ?? 0 },
              { label: "Categories", value: company.categoriesServed?.length ?? 0 },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#0f1420] border border-[var(--border-soft)] rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* ── ROW 4: Assets handled ── */}
          {company.assetsHandled?.length > 0 && (
            <div className="border border-[var(--border-soft)] rounded-2xl p-4">
              <div className="flex items-center gap-1.5 text-[11px] text-white/30 uppercase tracking-widest mb-3">
                <Package size={11} /> Assets Handled
              </div>
              <div className="flex flex-wrap gap-2">
                {company.assetsHandled.map((asset, i) => (
                  <span key={i} className="text-[12px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60">
                    {asset}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── ROW 5: Social / Address ── */}
          <div className="border border-[var(--border-soft)] rounded-2xl p-4 min-h-[120px]">
            {(company.websiteSocials?.length > 0 || company.address) ? (
              <div className="flex flex-col gap-4">
                {company.websiteSocials?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/30 uppercase tracking-widest mb-2">
                      <Globe size={11} /> Social Media &amp; Website
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {company.websiteSocials.map((link, i) => (
                        <a key={i} href={link.startsWith("http") ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--accent)] hover:underline break-all">
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {company.address && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/30 uppercase tracking-widest mb-2">
                      <MapPin size={11} /> Office Address
                    </div>
                    <p className="text-[13px] text-white/55 leading-relaxed">{company.address}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center py-6 text-center">
                <p className="text-white/20 text-sm leading-relaxed">
                  Social Media, Website, Office Address
                  <br />
                  <span className="text-white/10 text-xs">(Google Map Link if Possible)</span>
                </p>
              </div>
            )}
          </div>

          {/* ── Close button ── */}
          <button
            onClick={handleClose}
            className="w-full py-2.5 rounded-xl border border-[var(--border-soft)] text-white/50 text-sm font-semibold hover:bg-white/5 hover:text-white/80 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="group relative w-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#1e2330] to-[#141823] hover:shadow-xl hover:shadow-black/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      >
        {company.status && (
          <div className="absolute top-3 left-3 z-10 px-3 py-1 text-xs font-semibold rounded-full bg-white/10 backdrop-blur text-white">
            {company.status}
          </div>
        )}

        <div className="relative w-full h-[170px] overflow-hidden">
          {company.companyLogo?.url ? (
            <Image
              src={company.companyLogo.url}
              alt={company.companyName}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="200px"
              quality={75}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#252a36]">
              <span className="text-4xl font-black text-white/10">
                {company.companyName?.charAt(0)?.toUpperCase() || "C"}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </div>

        <div className="p-4 flex flex-col gap-3">
          <h3 className="text-white text-[16px] font-semibold tracking-tight line-clamp-1">
            {company.companyName}
          </h3>
          <div className="flex flex-wrap gap-1">
            {company.categoriesServed?.slice(0, 2).map((cat, i) => (
              <span key={i} className="text-[11px] px-2 py-1 rounded-full bg-white/5 text-white/70">{cat}</span>
            ))}
            {company.categoriesServed?.length > 2 && (
              <span className="text-[11px] px-2 py-1 rounded-full bg-white/5 text-white/50">+{company.categoriesServed.length - 2}</span>
            )}
          </div>
          <p className="text-[12px] text-white/50 line-clamp-1">
            📍 {company.citiesCovered?.slice(0, 2).join(", ")}
          </p>
          <button className="mt-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 transition-all duration-300 group-hover:scale-[1.02]">
            View Details →
          </button>
        </div>

        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]" />
      </div>

      {open && <CompanyModal company={company} onClose={() => setOpen(false)} />}
    </>
  );
}
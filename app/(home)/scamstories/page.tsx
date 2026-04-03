"use client";

import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import {
  AlertTriangle,
  Play,
  ExternalLink,
  Shield,
  Eye,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import {
  stats,
  warningSigns,
  reels,
  stories,
  platformColor,
} from "@/app/data/scamstories";

/* ================= DYNAMIC IMPORTS ================= */
const Navbar = dynamic(() => import("@/app/components/home/Navbar"), {
  loading: () => <div className="h-16 bg-black" />,
});

const Footer = dynamic(() => import("@/app/components/home/Footer"), {
  loading: () => <div className="h-40 bg-black" />,
});

/* ================= PAGE ================= */
export default function ScamStories() {
  // Lazy sections
  const { ref: videoRef, inView: videoVisible } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: storyRef, inView: storyVisible } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <>
      <Navbar />

      <main className="w-full bg-[var(--bg-main)] min-h-screen">
        {/* ── HERO ── */}
        <section className="relative w-full overflow-hidden px-6 pt-20 pb-16 flex flex-col items-center text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-500/5 blur-[120px] rounded-full" />
          </div>

          <div className="relative z-10 inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase">
            <AlertTriangle size={12} />
            Community Safety Alert
          </div>

          <h1 className="relative z-10 text-[var(--text-primary)] text-4xl md:text-6xl font-black tracking-tight leading-[1.1] max-w-3xl mb-6">
            Rental Scams Are <span className="text-red-400">Real.</span>
            <br />
            Here&apos;s What You Need to Know.
          </h1>

          <p className="relative z-10 text-[var(--text-muted)] text-base md:text-lg max-w-xl leading-relaxed mb-10">
            The TRC community documents real scam cases so every member stays
            protected. Watch, read, and share these stories — because awareness
            is the best defence.
          </p>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#stories"
              className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-main)] font-bold rounded-full text-sm hover:scale-105 transition-transform"
            >
              Read Real Stories
            </Link>
            <Link
              href="#videos"
              className="px-6 py-3 bg-white/5 border border-white/10 text-[var(--text-primary)] font-semibold rounded-full text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Play size={13} fill="currentColor" /> Watch Videos
            </Link>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="w-full px-6 pb-16">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 border border-white/[0.07] rounded-2xl overflow-hidden">
            {stats?.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center text-center px-6 py-8 border-r border-b border-white/[0.07]"
              >
                <div className="text-3xl font-black text-red-400">
                  {stat.value}
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── WARNING SIGNS ── */}
        <section className="w-full px-6 py-16 bg-[var(--bg-navbar)]">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Shield size={18} className="text-red-400" />
              <span className="text-[11px] font-bold text-red-400 uppercase">
                Warning signs
              </span>
            </div>

            <h2 className="text-[var(--text-primary)] text-2xl md:text-4xl font-black mb-12">
              How to spot a scam before it&apos;s too late
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {warningSigns?.map((sign, i) => (
                <div
                  key={i}
                  className="bg-[var(--bg-main)] border border-white/[0.06] rounded-2xl p-5 hover:border-red-500/20 transition"
                >
                  <div className="text-2xl mb-3">{sign.icon}</div>
                  <h3 className="text-[14px] font-bold mb-2">
                    {sign.title}
                  </h3>
                  <p className="text-[13px] text-[var(--text-muted)]">
                    {sign.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

       

        {/* ── VIDEO REELS ── */}
        <section id="videos" className="w-full px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Play size={16} className="text-[var(--accent)]" fill="currentColor" />
              <span className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-widest">Video stories</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <h2 className="text-[var(--text-primary)] text-2xl md:text-4xl font-black tracking-tight">
                Watch. Learn. Stay Safe.
              </h2>
              <div className="flex items-center gap-3">
                <Link href="https://instagram.com" target="_blank" className="flex items-center gap-2 text-[12px] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-white/[0.08] rounded-full px-4 py-2 transition-colors">
                  Instagram <ExternalLink size={11} />
                </Link>
                <Link href="https://youtube.com" target="_blank" className="flex items-center gap-2 text-[12px] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-white/[0.08] rounded-full px-4 py-2 transition-colors">
                  YouTube <ExternalLink size={11} />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {reels.map((reel) => (
                <Link key={reel.id} href={reel.href} target="_blank" className="group block">
                  <div className="bg-[var(--bg-navbar)] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-200 hover:-translate-y-0.5">
                    <div className="w-full aspect-[9/16] max-h-[220px] bg-[#141c2b] relative flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0f1728] to-[#1a2540]" />
                      <div className="relative z-10 w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-200">
                        <Play size={20} className="text-white ml-1" fill="white" />
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        {reel.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border mb-2 ${platformColor[reel.platform]}`}>
                        {reel.label}
                      </div>
                      <p className="text-[var(--text-primary)] text-[13px] font-semibold leading-[1.45] line-clamp-2">
                        {reel.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── REAL STORIES ── */}
        <section id="stories" className="w-full px-6 py-16 bg-[var(--bg-navbar)]">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen size={16} className="text-[var(--accent)]" />
              <span className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-widest">Documented cases</span>
            </div>
            <h2 className="text-[var(--text-primary)] text-2xl md:text-4xl font-black tracking-tight mb-10">
              Real Stories. Real Losses.
            </h2>
            <div className="flex flex-col gap-4">
              {stories.map((story) => (
                <div key={story.id} className="bg-[var(--bg-main)] border border-white/[0.06] rounded-2xl p-6 hover:border-red-500/15 transition-colors duration-200">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full">
                        {story.category}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)]">{story.location}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-[11px] text-[var(--text-muted)]">{story.date}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 text-xl font-black tracking-tight">{story.loss}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">estimated loss</div>
                    </div>
                  </div>
                  <p className="text-[var(--text-muted)] text-[14px] leading-relaxed">{story.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="w-full px-6 py-20 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mb-6">
            <Eye size={20} className="text-[var(--accent)]" />
          </div>
          <h2 className="text-[var(--text-primary)] text-2xl md:text-4xl font-black tracking-tight mb-4 max-w-xl">
            Experienced a scam? Report it to TRC.
          </h2>
          <p className="text-[var(--text-muted)] text-[15px] leading-relaxed max-w-md mb-8">
            Your report helps protect thousands of other rental professionals. We document, verify, and publish cases to keep the community safe.
          </p>
          <Link href="/joincommunity" className="px-8 py-3.5 bg-[var(--accent)] text-white font-bold rounded-full text-sm hover:scale-105 transition-transform duration-200">
            Report a Scam
          </Link>
        </section>

      </main>

      <Footer />
    </>
  );
}

"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-main text-primary pt-20 pb-8 px-6 md:px-12">

      {/* ================= TOP GRID ================= */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* LEFT SECTION */}
        <div>
          <h2 className="text-5xl font-semibold mb-6">trc.</h2>

          <p className="text-muted text-sm leading-relaxed max-w-sm">
            The Rental Community, in partnership with Rentux,
            provides free business leads to the members. Rentux
            is an online rental listings platform and you can list
            your inventory as well. The leads are shared directly
            in the WhatsApp group.
          </p>
        </div>

        {/* MAIN LINKS */}
        <div className="md:ml-10">
          <h3 className="text-xl font-semibold mb-6">Main Link</h3>

          <ul className="space-y-3 text-muted text-sm">
            <li>
              <Link href="/" className="hover:text-primary transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/Directory" className="hover:text-primary transition">
                Directory
              </Link>
            </li>
            <li>
              <Link href="/rentux" className="hover:text-primary transition">
                Rentux
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-primary transition">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/scamstories" className="hover:text-primary transition">
                Scam Stories
              </Link>
            </li>
          </ul>
        </div>

        {/* OTHER LINKS */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Other Link</h3>

          <ul className="space-y-3 text-muted text-sm">
            <li>
              <Link href="/privacy" className="hover:text-primary transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-primary transition">
                Terms & Service
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-primary transition">
                Community Info
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary transition">
                About Us
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* ================= BOTTOM ================= */}
      <div className="mt-16 border-t border-border-soft pt-6 text-center text-muted text-xs">
        © 2026 Verispace Technologies Pvt Ltd All rights reserved.
      </div>

    </footer>
  );
}
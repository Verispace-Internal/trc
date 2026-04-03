"use client";

import dynamic from "next/dynamic";

/* ✅ Dynamic Imports */
const Navbar = dynamic(() => import("@/app/components/home/Navbar"), {
  loading: () => <div className="h-16 bg-black" />,
});

const JoinCommunity = dynamic(
  () => import("../../components/home/JoinCommunity"),
  {
    loading: () => (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-500">
        Loading community...
      </div>
    ),
  }
);

const Footer = dynamic(() => import("@/app/components/home/Footer"), {
  loading: () => <div className="h-40 bg-black" />,
});

/* ✅ Page */
export default function JoinCommunityPage() {
  return (
    <>
      <Navbar />

      <main className="bg-[var(--bg-main)] min-h-screen">
        <JoinCommunity />
      </main>

      <Footer />
    </>
  );
}
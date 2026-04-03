"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ✅ Dynamic Imports */
const Navbar = dynamic(() => import("@/app/components/home/Navbar"), {
  loading: () => <div className="h-16 bg-black" />,
});

const Footer = dynamic(() => import("@/app/components/home/Footer"), {
  loading: () => <div className="h-40 bg-black" />,
});

const SearchBar = dynamic(() => import("@/app/components/home/Search"), {
  loading: () => (
    <div className="h-[120px] flex items-center justify-center text-sm text-gray-500">
      Loading search...
    </div>
  ),
});

const BlogCard = dynamic(
  () => import("@/app/components/home/BlogCard"),
  {
    loading: () => (
      <div className="flex items-center justify-center py-20 text-sm text-gray-500">
        Loading blogs...
      </div>
    ),
  }
);

// 👇 IMPORTANT: import hook separately (not dynamic)
import { useBlogPages } from "@/app/components/home/BlogCard";

export default function Blog() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const totalPages = useBlogPages(search);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(0);
  };

  return (
    <>
      <Navbar />

      <SearchBar
        title="Blog"
        placeholder="Search blog posts..."
        onSearch={handleSearch}
      />

      <main className="w-full min-h-screen bg-[var(--bg-main)] px-6 py-10 flex flex-col">
        {/* Blog List */}
        <BlogCard search={search} page={page} />

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-9 h-9 rounded-full bg-[var(--bg-navbar)] border border-[var(--border-soft)] flex items-center justify-center hover:border-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} className="text-white/70" />
          </button>

          {totalPages > 1 && (
            <span className="text-white/30 text-xs">
              {page + 1} / {totalPages}
            </span>
          )}

          <button
            onClick={() =>
              setPage((p) => Math.min(totalPages - 1, p + 1))
            }
            disabled={page >= totalPages - 1 || totalPages === 0}
            className="w-9 h-9 rounded-full bg-[var(--bg-navbar)] border border-[var(--border-soft)] flex items-center justify-center hover:border-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={14} className="text-white/70" />
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}
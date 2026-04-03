"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";

import { getBlogsAction, type Blog } from "@/app/Store/actions/blogActions";
import type { AppDispatch, RootState } from "@/app/Store/Store";

/* ✅ Dynamic Imports */
const Navbar = dynamic(() => import("@/app/components/home/Navbar"), {
  loading: () => <div className="h-16 bg-black" />,
});

const Footer = dynamic(() => import("@/app/components/home/Footer"), {
  loading: () => <div className="h-40 bg-black" />,
});

export default function BlogDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const id = params.id as string;

  const { blogs } = useSelector((state: RootState) => state.blogsReducer);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(false);

  /* ✅ Fetch blog */
  useEffect(() => {
    let isMounted = true;

    const fetchBlog = async () => {
      setFetching(true);
      setError(false);

      try {
        const res = await fetch(`/api/blog/${id}`);
        const json = await res.json();

        if (isMounted) {
          if (json.success) setBlog(json.data);
          else setError(true);
        }
      } catch {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setFetching(false);
      }
    };

    if (id) fetchBlog();

    return () => {
      isMounted = false;
    };
  }, [id]);

  /* ✅ Fetch list if empty */
  useEffect(() => {
    if (blogs.length === 0) {
      dispatch(getBlogsAction());
    }
  }, [dispatch, blogs.length]);

  /* ✅ Memoized navigation */
  const { prevBlog, nextBlog } = useMemo(() => {
    const published = blogs.filter((b) => b.status === "published");
    const index = published.findIndex((b) => b._id === id);

    return {
      prevBlog: index > 0 ? published[index - 1] : null,
      nextBlog: index < published.length - 1 ? published[index + 1] : null,
    };
  }, [blogs, id]);

  /* ✅ Date formatting */
  const displayDate = useMemo(() => {
    if (!blog) return "";
    const date = blog.publishedAt || blog.createdAt;
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [blog]);

  /* ✅ Content split */
  const paragraphs = useMemo(() => {
    return blog?.content?.split("\n\n").filter(Boolean) || [];
  }, [blog]);

  /* ── Loading ── */
  if (fetching) {
    return (
      <>
        <Navbar />
        <div className="w-full min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
          <div className="animate-pulse text-white/30 text-sm">
            Loading article...
          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ── Error ── */
  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div className="w-full min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
          <p className="text-white/40 text-sm">Blog not found.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="w-full bg-[var(--bg-main)] min-h-screen">
        {/* Header */}
        <div className="max-w-2xl mx-auto px-6 pt-14 text-center">
          <div className="flex justify-center gap-2 mb-6 text-[13px] text-white/40">
            <span>{blog.category || "General"}</span>
            <span>•</span>
            <span>{displayDate}</span>
            {blog.readTime && (
              <>
                <span>•</span>
                <span>{blog.readTime} min read</span>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-white/50 mb-6">{blog.excerpt}</p>
          )}

          <button className="inline-flex items-center gap-2 text-sm text-white/40 border border-white/10 px-4 py-2 rounded-full hover:text-white">
            <Share2 size={14} /> Share
          </button>
        </div>

        {/* Image */}
        {blog.coverImage && (
          <div className="w-full aspect-[16/7] relative mt-10">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={80}
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-[600px] mx-auto px-6 py-14">
          {paragraphs.length > 0 ? (
            paragraphs.map((para, i) => (
              <p key={i} className="text-white/60 mb-6 leading-[1.8]">
                {para}
              </p>
            ))
          ) : (
            <p className="text-white/30 text-center">
              No content available.
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="border-t border-white/10 max-w-2xl mx-auto px-6 py-6 flex justify-between">
          {prevBlog ? (
            <Link href={`/blog/${prevBlog._id}`} className="text-white/40 hover:text-white flex items-center gap-2">
              <ChevronLeft size={14} /> Previous
            </Link>
          ) : (
            <span className="text-white/20 flex items-center gap-2">
              <ChevronLeft size={14} /> Previous
            </span>
          )}

          {nextBlog ? (
            <Link href={`/blog/${nextBlog._id}`} className="text-white/40 hover:text-white flex items-center gap-2">
              Next <ChevronRight size={14} />
            </Link>
          ) : (
            <span className="text-white/20 flex items-center gap-2">
              Next <ChevronRight size={14} />
            </span>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
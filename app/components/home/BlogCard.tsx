"use client"

import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import Image from "next/image"
import Link from "next/link"
import { getBlogsAction } from "@/app/Store/actions/blogActions"
import type { AppDispatch, RootState } from "@/app/Store/Store"

interface BlogCardProps {
  search: string
  page: number
}

const PER_PAGE = 12

export default function BlogCard({ search, page }: BlogCardProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { blogs, loading } = useSelector(
    (state: RootState) => state.blogsReducer
  )

  /* Fetch once */
  useEffect(() => {
    if (blogs.length === 0) {
      dispatch(getBlogsAction())
    }
  }, [dispatch, blogs.length])

  /* Filter */
  const published = useMemo(() => {
    return blogs.filter((b) => b.status === "published")
  }, [blogs])

  const filtered = useMemo(() => {
    return published.filter(
      (b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        (b.category ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())
    )
  }, [published, search])

  const paginated = useMemo(() => {
    return filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE)
  }, [filtered, page])

  /* ── Loading ── */
  if (loading) {
    return (
      <section className="w-full bg-[#020817]">
        <div className="max-w-6xl mx-auto border-t border-white/20 border-b border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="px-6 md:px-10 py-10 border-b border-white/10 md:border-r"
              >
                <div className="w-full h-[200px] bg-white/5 mb-6 animate-pulse" />
                <div className="h-5 bg-white/5 w-3/4 mb-3 animate-pulse" />
                <div className="h-5 bg-white/5 w-1/2 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  /* ── Empty ── */
  if (filtered.length === 0) {
    return (
      <section className="w-full bg-[#020817]">
        <div className="flex items-center justify-center py-20 text-white/40 text-sm">
          {search
            ? `No blogs found for "${search}"`
            : "No blog posts published yet."}
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-[#020817] text-white">

      {/* WRAPPER */}
      <div className="max-w-6xl mx-auto border-t border-white/20 border-b border-white/20">

        <div className="grid grid-cols-1 md:grid-cols-2">

          {paginated.map((blog, index) => (
            <Link key={blog._id} href={`/blog/${blog._id}`}>

              <div
                className={`
                  group
                  px-6 md:px-10 py-10
                  flex flex-col justify-between
                  min-h-[420px]
                  border-b border-white/10
                  ${index % 2 === 0 ? "md:border-r border-white/10" : ""}
                `}
              >

                {/* IMAGE */}
                <div className="w-full h-[200px] relative mb-8 overflow-hidden">
                  {blog.coverImage ? (
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                      sizes="(max-width:768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5" />
                  )}
                </div>

                {/* TITLE */}
                <h3 className="
                  text-[22px] md:text-[26px]
                  leading-[1.3]
                  font-medium
                  tracking-tight
                  mb-10
                  font-serif
                ">
                  {blog.title}
                </h3>

                {/* FOOTER */}
                <div className="flex items-center justify-between mt-auto">

                  {/* META */}
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span>{blog.category || "General"}</span>
                    <span className="w-[4px] h-[4px] rounded-full bg-white/40" />
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* ARROW */}
                  <div className="
                    w-8 h-8 flex items-center justify-center
                    border border-white/20
                    group-hover:bg-white group-hover:text-black
                    transition
                  ">
                    ↗
                  </div>

                </div>
              </div>

            </Link>
          ))}

        </div>
      </div>
    </section>
  )
}

/* Pagination helper */
export function useBlogPages(search: string): number {
  const { blogs } = useSelector(
    (state: RootState) => state.blogsReducer
  )

  const total = useMemo(() => {
    const published = blogs.filter((b) => b.status === "published")
    const filtered = published.filter(
      (b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        (b.category ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())
    )
    return Math.ceil(filtered.length / PER_PAGE)
  }, [blogs, search])

  return total
}
"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import { getTestimonialsAction } from "@/app/Store/actions/testimonialActions"
import { homeData } from "../../data/home"
import type { AppDispatch, RootState } from "@/app/Store/Store"

// ✅ Define a consistent type
type ReviewItem = {
  name: string
  text: string
  position?: string
}

export default function Testimonials() {
  const dispatch = useDispatch<AppDispatch>()
  const { testimonials, loading } = useSelector(
    (state: RootState) => state.testimonialReducer
  )

  const { reviews } = homeData

  // Fetch only visible testimonials on mount
  useEffect(() => {
    if (testimonials.length === 0) {
      dispatch(getTestimonialsAction(true))
    }
  }, [dispatch, testimonials.length])

  // ✅ Normalize both API + fallback data
  const items: ReviewItem[] =
    testimonials.length > 0
      ? testimonials.map((t) => ({
          name: t.name,
          text: t.message,
          position: t.position || "",
        }))
      : reviews.items.map((r: any) => ({
          name: r.name,
          text: r.text,
          position: r.position || "", // fallback safe
        }))

  return (
    <section className="w-full py-20 md:py-32 bg-[var(--bg-main)] overflow-hidden">
      
      {/* Title */}
      <h2 className="text-center text-2xl md:text-5xl font-semibold text-[var(--text-primary)] mb-16 md:mb-24">
        {reviews.title}
      </h2>

      {/* Loading skeleton */}
      {loading && (
        <div className="flex gap-8 px-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[260px] md:min-w-[320px] h-[160px] bg-[var(--border-soft)] border border-[var(--border-soft)] rounded-2xl animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      )}

      {/* Slider */}
      {!loading && (
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[var(--bg-main)] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[var(--bg-main)] to-transparent z-10" />

          <div className="flex gap-8 animate-scroll">
            {[...items, ...items].map((review, i) => (
              <div
                key={i}
                className="
                  min-w-[260px] md:min-w-[320px]
                  h-[160px]
                  bg-[var(--border-soft)]
                  border border-[var(--border-soft)]
                  backdrop-blur-md
                  rounded-2xl
                  p-6
                  flex flex-col justify-between
                "
              >
                <p className="text-sm text-[var(--text-primary)] opacity-80 leading-relaxed">
                  {review.text}
                </p>

                <div>
                  <p className="text-sm text-[var(--text-primary)] font-semibold mt-4">
                    — {review.name}
                  </p>

                  {/* ✅ Safe render */}
                  {review.position && (
                    <p className="text-[10px] font-bold text-gray-500">
                      {review.position}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-20 w-full flex flex-col items-center">
        <Link
          className="py-3 px-8 hover:scale-105 transition-all duration-300 text-[var(--bg-main)] font-bold bg-[var(--text-primary)] rounded-xl"
          href="/joincommunity"
        >
          Join Now
        </Link>
      </div>
    </section>
  )
}
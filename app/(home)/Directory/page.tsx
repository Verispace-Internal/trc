"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ChevronLeft, ChevronRight } from "lucide-react"
import CompanyCard from "@/app/components/home/CompanyCard"
import Footer from "@/app/components/home/Footer"
import Navbar from "@/app/components/home/Navbar"
import SearchBar from "@/app/components/home/Search"
import { getCompaniesAction } from "@/app/Store/actions/companyActions"
import type { AppDispatch, RootState } from "@/app/Store/Store"

const PER_PAGE = 12

export default function Directory() {
  const dispatch = useDispatch<AppDispatch>()
  const { companies, loading } = useSelector(
    (state: RootState) => state.companyReducer
  )

  const [page, setPage] = useState(0)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("")
  const [sort, setSort] = useState("")

  useEffect(() => {
    if (companies.length === 0) dispatch(getCompaniesAction())
  }, [dispatch, companies.length])

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(0)
  }

  // ✅ FILTER
  const filtered = companies
    .filter((c) =>
      c.companyName.toLowerCase().includes(search.toLowerCase())
    )
    .filter((c) => {
      if (!filter || filter === "all") return true

      return c.categoriesServed?.some((cat: string) =>
        cat.toLowerCase().includes(filter)
      )
    })

  // ✅ SORT
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "a–z") {
      return a.companyName.localeCompare(b.companyName)
    }

    if (sort === "newest") {
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      )
    }

    if (sort === "oldest") {
      return (
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
      )
    }

    return 0
  })

  // ✅ PAGINATION
  const totalPages = Math.ceil(sorted.length / PER_PAGE)

  const paginated = sorted.slice(
    page * PER_PAGE,
    (page + 1) * PER_PAGE
  )

  return (
    <>
      <Navbar />

      <SearchBar
        onSearch={handleSearch}
        onFilter={(val) => {
          setFilter(val)
          setPage(0)
        }}
        onSort={(val) => setSort(val)}
      />

      <section className="w-full min-h-screen bg-[var(--bg-main)] px-4 sm:px-6 py-10 flex flex-col items-center">
        <div className="w-full max-w-[1400px]">

          {/* Loading */}
          {loading && (
            <div className="flex flex-wrap justify-center gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-[200px] h-[220px] bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && paginated.length === 0 && (
            <div className="text-white/40 text-sm text-center py-20">
              {search ? `No results for "${search}"` : "No companies found"}
            </div>
          )}

          {/* Cards */}
          {!loading && paginated.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {paginated.map((company) => (
                <div key={company._id} className="w-[200px]">
                  <CompanyCard company={company} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center"
              >
                <ChevronLeft size={14} />
              </button>

              <span className="text-white/30 text-xs">
                {page + 1} / {totalPages}
              </span>

              <button
                onClick={() =>
                  setPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={page >= totalPages - 1}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
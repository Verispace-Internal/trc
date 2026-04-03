"use client"

import { useEffect, useState } from "react"

interface SearchBarProps {
  onSearch?: (value: string) => void
  onFilter?: (value: string) => void
  onSort?: (value: string) => void
  placeholder?: string
  title?: string
}

export default function SearchBar({
  onSearch,
  onFilter,
  onSort,
  placeholder = "search",
  title = "Members",
}: SearchBarProps) {
  const [value, setValue] = useState("")
  const [debounced, setDebounced] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), 300)
    return () => clearTimeout(timer)
  }, [value])

  useEffect(() => {
    onSearch?.(debounced)
  }, [debounced, onSearch])

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: "1rem",
        padding: "1.25rem 1.5rem",
        backgroundColor: "var(--bg-navbar)",
        borderBottom: "1px solid var(--border-soft)",
        marginTop: "30px"
      }}
    >
      {/* LEFT — SEARCH */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            border: "1.5px solid var(--text-muted)",
            borderRadius: "6px",
            padding: "0.45rem 0.85rem",
            width: "100%",
            maxWidth: "280px",
            backgroundColor: "transparent",
            transition: "border-color 0.2s",
          }}
          onFocusCapture={(e) =>
          ((e.currentTarget as HTMLDivElement).style.borderColor =
            "var(--text-primary)")
          }
          onBlurCapture={(e) =>
          ((e.currentTarget as HTMLDivElement).style.borderColor =
            "var(--text-muted)")
          }
        >
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              width: "100%",
              fontFamily: "inherit",
            }}
          />

          {value && (
            <button
              onClick={() => setValue("")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                fontSize: "0.75rem",
                padding: 0,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* CENTER — TITLE */}
      <h2
        style={{
          color: "var(--text-primary)",
          fontSize: "2rem",
          fontWeight: "700",
          textAlign: "center",
          whiteSpace: "nowrap",
          margin: 0,
          letterSpacing: "-0.02em",
          fontFamily: "inherit",
        }}
      >
        {title}
      </h2>

      {/* RIGHT — FILTER + SORT */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1.5rem" }}>
        {[
          { label: "Filter", options: ["All", "Technology", "Industry", "Events"], onChange: onFilter },
          { label: "Sort", options: ["Newest", "Oldest", "A–Z"], onChange: onSort },
        ].map(({ label, options, onChange }) => (
          <div key={label} style={{ position: "relative" }}>
            <select
  onChange={(e) => onChange?.(e.target.value)}
  defaultValue=""
  style={{
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",

    background: "transparent",
    border: "1px solid var(--border-soft)",
    borderRadius: "6px",

    padding: "6px 28px 6px 10px",
    fontSize: "0.85rem",
    fontWeight: "500",

    color: "var(--text-primary)",
    cursor: "pointer",
    outline: "none",

    width: "110px", // ✅ IMPORTANT (fix stretch issue)
  }}
>
  <option value="" disabled hidden>
    {label}
  </option>

  {options.map((opt) => (
    <option
      key={opt}
      value={opt.toLowerCase()}
      style={{
        background: "#0b0f1a", // ✅ dark dropdown
        color: "#fff",
      }}
    >
      {opt}
    </option>
  ))}
</select>
          </div>
        ))}
      </div>
    </div>
  )
}
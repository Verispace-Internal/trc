import { X } from "lucide-react"

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-lg bg-[#0f1420] border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[var(--text-primary)] font-bold text-base">{title}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function InputField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">{label}</label>
      <input {...props} className="w-full bg-[var(--bg-main)] border border-white/[0.08] text-[var(--text-primary)] placeholder:text-white/20 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-white/25 transition-colors" />
    </div>
  )
}

export function TextAreaField({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">{label}</label>
      <textarea {...props} rows={3} className="w-full bg-[var(--bg-main)] border border-white/[0.08] text-[var(--text-primary)] placeholder:text-white/20 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-white/25 transition-colors resize-none" />
    </div>
  )
}

export function ActionBtn({ onClick, variant }: { onClick: () => void; variant: "edit" | "delete" }) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
        ${variant === "edit"
          ? "bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
          : "bg-red-500/5 hover:bg-red-500/15 text-red-400/50 hover:text-red-400"
        }`}
    >
      {variant === "edit"
        ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
      }
    </button>
  )
}
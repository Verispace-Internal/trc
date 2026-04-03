"use client"

import { useState, useRef, useCallback } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight, CheckCircle, RefreshCw, Phone, Mail } from "lucide-react"
import { AppDispatch, RootState } from "@/app/Store/Store"
import { clearError } from "@/app/Store/reducers/authSlice"
import { sendOtpAction, verifyOtpAction } from "@/app/Store/actions/authActions"

type Step = "details" | "otp"
type DetailsForm = { name: string; username: string; email: string; phone: string; password: string }

// ── PIN Input Component ───────────────────────────────────────────────
function PinInput({
  prefix,
  value,
  onChange,
  label,
  icon,
  hint,
}: {
  prefix: string
  value: string[]
  onChange: (val: string[]) => void
  label: string
  icon: React.ReactNode
  hint: string
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const focus = (i: number) => refs.current[i]?.focus()

  const handleChange = (i: number, raw: string) => {
    if (!/^\d*$/.test(raw)) return

    // Handle paste — fill all 6 digits at once
    if (raw.length > 1) {
      const digits = raw.replace(/\D/g, "").slice(0, 6).split("")
      const next = Array(6).fill("")
      digits.forEach((d, idx) => { next[idx] = d })
      onChange(next)
      focus(Math.min(digits.length, 5))
      return
    }

    const next = [...value]
    next[i] = raw.slice(-1)
    onChange(next)
    if (raw && i < 5) focus(i + 1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === "Backspace") {
      if (value[i]) {
        const next = [...value]; next[i] = ""; onChange(next)
      } else if (i > 0) {
        focus(i - 1)
        const next = [...value]; next[i - 1] = ""; onChange(next)
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      focus(i - 1)
    } else if (e.key === "ArrowRight" && i < 5) {
      focus(i + 1)
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.select()

  const filled = value.filter(Boolean).length

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/25 truncate max-w-[140px]">{hint}</span>
          {filled === 6 && (
            <span className="text-[10px] font-bold text-[var(--accent)] flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Done
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {value.map((digit, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={digit}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(e, i)}
            onFocus={handleFocus}
            className={`
              w-full h-12 sm:h-[52px]
              text-center text-[var(--text-primary)] text-[18px] font-black
              rounded-xl outline-none
              transition-all duration-150
              caret-transparent select-none
              ${digit
                ? "bg-[var(--accent)]/10 border-2 border-[var(--accent)]/50 text-[var(--accent)]"
                : "bg-[var(--bg-main)] border border-white/[0.08] focus:border-[var(--accent)]/40 focus:bg-[var(--accent)]/5"
              }
            `}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
          style={{ width: `${(filled / 6) * 100}%` }}
        />
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────
export default function Register() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.authReducer)

  const [step, setStep] = useState<Step>("details")
  const [showPassword, setShowPassword] = useState(false)
  const [verified, setVerified] = useState(false)
  const [savedDetails, setSavedDetails] = useState<DetailsForm | null>(null)
  const [pinPhone, setPinPhone] = useState(Array(6).fill(""))
  const [pinEmail, setPinEmail] = useState(Array(6).fill(""))

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DetailsForm>()

  const onDetailsSubmit = async (data: DetailsForm) => {
    dispatch(clearError())
    const result = await dispatch(sendOtpAction(data))
    if (sendOtpAction.fulfilled.match(result)) {
      setSavedDetails(data)
      setStep("otp")
    }
  }

  const onPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!savedDetails) return
    dispatch(clearError())
    const result = await dispatch(verifyOtpAction({
      ...savedDetails,
      phoneOtp: pinPhone.join(""),
      emailOtp: pinEmail.join(""),
    }))
    if (verifyOtpAction.fulfilled.match(result)) setVerified(true)
  }

  const resendPin = async () => {
    if (!savedDetails) return
    dispatch(clearError())
    setPinPhone(Array(6).fill(""))
    setPinEmail(Array(6).fill(""))
    await dispatch(sendOtpAction(savedDetails))
  }

  const pinComplete = pinPhone.every(Boolean) && pinEmail.every(Boolean)

  const inputCls = (hasError?: boolean) =>
    `w-full bg-[var(--bg-main)] border ${hasError ? "border-red-500/50" : "border-white/[0.08]"} text-[var(--text-primary)] placeholder:text-white/20 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-white/25 transition-colors`

  const Spinner = () => (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[var(--accent)]/4 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-[var(--text-primary)] text-3xl font-black tracking-tight">trc.</Link>
          <p className="text-[var(--text-muted)] text-[13px] mt-1">Admin Registration</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {(["details", "otp"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 text-[12px] font-semibold transition-colors
                ${step === s || (s === "details" && step === "otp") ? "text-[var(--accent)]" : "text-white/25"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black border transition-all
                  ${step === s
                    ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                    : s === "details" && step === "otp"
                      ? "bg-[var(--accent)]/20 border-[var(--accent)]/40 text-[var(--accent)]"
                      : "bg-white/5 border-white/10 text-white/25"}`}>
                  {s === "details" && step === "otp" ? "✓" : i + 1}
                </div>
                {s === "details" ? "Your details" : "Verify PIN"}
              </div>
              {i === 0 && <div className={`w-8 h-px transition-colors ${step === "otp" ? "bg-[var(--accent)]/40" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-[var(--bg-navbar)] border border-white/[0.07] rounded-2xl p-6 sm:p-7">

          {/* STEP 1 */}
          {step === "details" && (
            <>
              <h2 className="text-[var(--text-primary)] text-lg font-black mb-1">Create your account</h2>
              <p className="text-[var(--text-muted)] text-[13px] mb-6">Fill in your details to get started.</p>

              <form onSubmit={handleSubmit(onDetailsSubmit)} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Full Name</label>
                    <input {...register("name", { required: "Required" })} placeholder="Rajesh Kulkarni" className={inputCls(!!errors.name)} />
                    {errors.name && <span className="text-[11px] text-red-400">{errors.name.message}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Username</label>
                    <input {...register("username", { required: "Required", pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Letters, numbers, _ only" } })} placeholder="rajesh_admin" className={inputCls(!!errors.username)} />
                    {errors.username && <span className="text-[11px] text-red-400">{errors.username.message}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Email Address</label>
                  <input {...register("email", { required: "Required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } })} type="email" placeholder="admin@trc.in" className={inputCls(!!errors.email)} />
                  {errors.email && <span className="text-[11px] text-red-400">{errors.email.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Phone Number</label>
                  <input {...register("phone", { required: "Required", pattern: { value: /^[+\d]{10,15}$/, message: "Enter a valid number" } })} type="tel" placeholder="+91 98765 43210" className={inputCls(!!errors.phone)} />
                  {errors.phone && <span className="text-[11px] text-red-400">{errors.phone.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input {...register("password", { required: "Required", minLength: { value: 6, message: "Min. 6 characters" } })} type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" className={inputCls(!!errors.password) + " pr-11"} />
                    <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && <span className="text-[11px] text-red-400">{errors.password.message}</span>}
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] px-4 py-2.5 rounded-xl">{error}</div>}

                <button type="submit" disabled={isSubmitting || loading}
                  className="w-full bg-[var(--accent)] text-white font-bold text-[14px] rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-green-500 active:scale-[0.98] transition-all disabled:opacity-60 mt-1">
                  {loading ? <Spinner /> : <>Send PIN <ArrowRight size={15} /></>}
                </button>
              </form>

              <p className="text-center text-[12px] text-[var(--text-muted)] mt-5">
                Already have an account?{" "}
                <Link href="/admin/login" className="text-[var(--accent)] font-semibold hover:underline">Sign in</Link>
              </p>
            </>
          )}

          {/* STEP 2 — PIN */}
          {step === "otp" && !verified && (
            <>
              <h2 className="text-[var(--text-primary)] text-lg font-black mb-1">Verify your identity</h2>
              <p className="text-[var(--text-muted)] text-[13px] mb-7">
                We sent a 6-digit PIN to{" "}
                <span className="text-[var(--text-primary)] font-semibold">{savedDetails?.phone}</span>{" "}
                and{" "}
                <span className="text-[var(--text-primary)] font-semibold">{savedDetails?.email}</span>
              </p>

              <form onSubmit={onPinSubmit} className="flex flex-col gap-7">

                <PinInput
                  prefix="phone"
                  value={pinPhone}
                  onChange={setPinPhone}
                  label="Phone PIN"
                  icon={<Phone size={13} className="text-[var(--accent)]" />}
                  hint={savedDetails?.phone ?? ""}
                />

                <div className="h-px bg-white/[0.06]" />

                <PinInput
                  prefix="email"
                  value={pinEmail}
                  onChange={setPinEmail}
                  label="Email PIN"
                  icon={<Mail size={13} className="text-[var(--accent)]" />}
                  hint={savedDetails?.email ?? ""}
                />

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] px-4 py-2.5 rounded-xl">{error}</div>}

                <button
                  type="submit"
                  disabled={loading || !pinComplete}
                  className="w-full bg-[var(--accent)] text-white font-bold text-[14px] rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-green-500 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? <Spinner /> : <>Verify &amp; Register <ArrowRight size={15} /></>}
                </button>

                <div className="flex items-center justify-between -mt-3">
                  <button type="button" onClick={() => setStep("details")} className="text-[12px] text-white/30 hover:text-white/60 transition-colors">
                    ← Edit details
                  </button>
                  <button type="button" onClick={resendPin} disabled={loading} className="flex items-center gap-1.5 text-[12px] text-[var(--accent)]/70 hover:text-[var(--accent)] transition-colors disabled:opacity-40">
                    <RefreshCw size={11} className={loading ? "animate-spin" : ""} /> Resend PIN
                  </button>
                </div>

              </form>
            </>
          )}

          {/* SUCCESS */}
          {step === "otp" && verified && (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/25 flex items-center justify-center">
                <CheckCircle size={28} className="text-[var(--accent)]" />
              </div>
              <h3 className="text-[var(--text-primary)] text-xl font-black">Registration complete!</h3>
              <p className="text-[var(--text-muted)] text-[13px] max-w-xs">
                Your admin account has been created and verified successfully.
              </p>
              <Link href="/admin/login" className="mt-2 w-full bg-[var(--accent)] text-white font-bold text-[14px] rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-green-500 transition-colors">
                Go to Login <ArrowRight size={15} />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
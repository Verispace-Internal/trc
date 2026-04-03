"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"

import { Building2, User, Phone, Mail, MapPin, MessageSquare, CheckCircle, ArrowRight, Shield, Users, Zap } from "lucide-react"
import { createJoinRequestAction } from "@/app/Store/actions/joinCommunityActions"
import { clearJoinError, clearSubmitSuccess } from "@/app/Store/reducers/joinCommunitySlice"
import type { AppDispatch, RootState } from "@/app/Store/Store"

type FormData = {
  businessName: string
  ownerName: string
  phone: string
  email: string
  city: string
  message?: string
}

const perks = [
  {
    icon: <Users size={18} className="text-white" />,
    title: "Free business leads",
    desc: "Get rental leads shared directly in the WhatsApp group — no middlemen.",
  },
  {
    icon: <Shield size={18} className="text-white" />,
    title: "Scam protection network",
    desc: "Stay informed about bad actors and protect your business from fraud.",
  },
  {
    icon: <Zap size={18} className="text-white" />,
    title: "Rentux listing included",
    desc: "List your rental inventory on Rentux and reach more customers instantly.",
  },
]

const inputCls = "w-full bg-[var(--bg-main)] border border-[var(--border-soft)] text-[var(--text-primary)] placeholder:text-white/20 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-white/25 transition-colors"

export default function JoinCommunity() {
  const dispatch = useDispatch<AppDispatch>()
  const { submitLoading, submitSuccess, error } = useSelector(
    (state: RootState) => state.joinCommunityReducer
  )

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    return () => {
      dispatch(clearJoinError())
      dispatch(clearSubmitSuccess())
    }
  }, [dispatch])

  const onSubmit = (data: FormData) => {
    dispatch(clearJoinError())
    dispatch(createJoinRequestAction(data))
  }

  return (
    <main className="w-full min-h-screen bg-[var(--bg-main)]">

      {/* ── HERO ── */}
      <section className="relative w-full px-4 sm:px-6 pt-14 pb-10 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] bg-[var(--accent)]/5 blur-[100px] rounded-full" />
        </div>
        <h1 className="relative z-10 text-[var(--text-primary)] text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-[1.1] mb-2">
          Join The Rental Community
        </h1>
      </section>

      {/* ── CONTENT ── */}
      <section className="w-full px-4 sm:px-6 pb-20">
        <div className="max-w-2xl lg:max-w-5xl mx-auto flex flex-col gap-8">

          {/* ── FORM (always on top) ── */}
          <div className="bg-[var(--bg-navbar)] border border-[var(--border-soft)] rounded-2xl p-6 md:p-8">

            {submitSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/25 flex items-center justify-center">
                  <CheckCircle size={28} className="text-[var(--accent)]" />
                </div>
                <h3 className="text-[var(--text-primary)] text-xl font-black">Application received!</h3>
                <p className="text-[var(--text-muted)] text-[14px] leading-relaxed max-w-xs">
                  We&apos;ll review your details and add you to the WhatsApp community within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-[var(--text-primary)] text-lg font-black mb-1">Apply for membership</h2>
                <p className="text-[var(--text-muted)] text-[13px] mb-6">Fill in your details and we&apos;ll get you in.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold  uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 size={11} /> Business Name
                      </label>
                      <input {...register("businessName", { required: "Required" })} type="text" placeholder="e.g. Poona Film Centre" className={inputCls} />
                      {errors.businessName && <span className="text-[11px] text-red-400">{errors.businessName.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold  uppercase tracking-wider flex items-center gap-1.5">
                        <User size={11} /> Owner&apos;s Name
                      </label>
                      <input {...register("ownerName", { required: "Required" })} type="text" placeholder="e.g. Bob Baga" className={inputCls} />
                      {errors.ownerName && <span className="text-[11px] text-red-400">{errors.ownerName.message}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold  uppercase tracking-wider flex items-center gap-1.5">
                        <Phone size={11} /> Phone Number
                      </label>
                      <input {...register("phone", { required: "Required" })} type="tel" placeholder="+91 0000000000" className={inputCls} />
                      {errors.phone && <span className="text-[11px] text-red-400">{errors.phone.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold  uppercase tracking-wider flex items-center gap-1.5">
                        <Mail size={11} /> Email ID
                      </label>
                      <input {...register("email", { required: "Required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } })} type="email" placeholder="you@business.com" className={inputCls} />
                      {errors.email && <span className="text-[11px] text-red-400">{errors.email.message}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold  uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin size={11} /> City
                    </label>
                    <input {...register("city", { required: "Required" })} type="text" placeholder="e.g. Pune, Mumbai, Bangalore" className={inputCls} />
                    {errors.city && <span className="text-[11px] text-red-400">{errors.city.message}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold  uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare size={11} /> Message{" "}
                      <span className="normal-case text-white/20 font-normal">(optional)</span>
                    </label>
                    <textarea
                      {...register("message")}
                      rows={3}
                      placeholder="Tell us about your rental business..."
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-soft)] text-[var(--text-primary)] placeholder:text-white/20 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-white/25 transition-colors resize-none"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] px-4 py-2.5 rounded-xl">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full bg-blue-400 text-white font-bold text-[14px] rounded-xl py-3.5 flex items-center justify-center gap-2 hover:bg-blue-500 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                  >
                    {submitLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      <>Request Invite <ArrowRight size={15} /></>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-white/20 leading-relaxed">
                    By submitting you agree to our terms. We&apos;ll contact you via WhatsApp within 24 hours.
                  </p>

                </form>
              </>
            )}
          </div>

          {/* ── PERKS + TRUST — below form on all screens ── */}
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">

            {/* What you get */}
            <div className="bg-[var(--bg-navbar)] border border-[var(--border-soft)] rounded-2xl p-6 sm:col-span-2 lg:col-span-1">
              <h2 className="text-[var(--text-primary)] text-base font-bold mb-5">What you get for free</h2>
              <div className="flex flex-col gap-4">
                {perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-400/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {perk.icon}
                    </div>
                    <div>
                      <p className="text-[var(--text-primary)] text-[14px] font-semibold mb-0.5">{perk.title}</p>
                      <p className=" text-[13px] leading-relaxed">{perk.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust note */}
            {/* <div className="bg-[var(--bg-navbar)] border border-[var(--border-soft)] rounded-2xl p-5 flex items-start gap-4 sm:col-span-2 lg:col-span-1">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield size={16} className="text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-[var(--text-primary)] text-[13px] font-semibold mb-1">Your data is safe with us</p>
                <p className="text-[var(--text-muted)] text-[12px] leading-relaxed">
                  We never share your contact details with third parties. Your information is only used to verify your membership and connect you with leads.
                </p>
              </div>
            </div> */}

          </div>
        </div>
      </section>

    </main>
  )
}
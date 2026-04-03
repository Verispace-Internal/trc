"use client"

import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, ArrowRight, Shield } from "lucide-react"
import { AppDispatch, RootState } from "@/app/Store/Store"
import { clearError } from "@/app/Store/reducers/authSlice"
import { loginAction } from "@/app/Store/actions/authActions"


type LoginForm = { email: string; password: string }

export default function Login() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { loading, error } = useSelector((state: RootState) => state.authReducer)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    dispatch(clearError())
    const result = await dispatch(loginAction(data))
    if (loginAction.fulfilled.match(result)) {
      router.push("/admin/dashboard")
    }
  }

  const inputCls = (hasError?: boolean) =>
    `w-full bg-[var(--bg-main)] border ${hasError ? "border-red-500/50" : "border-white/[0.08]"} text-[var(--text-primary)] placeholder:text-white/20 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-white/25 transition-colors`

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[var(--accent)]/4 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-[var(--text-primary)] text-3xl font-black tracking-tight">trc.</Link>
          <p className="text-[var(--text-muted)] text-[13px] mt-1">Admin Portal</p>
        </div>

        <div className="bg-[var(--bg-navbar)] border border-white/[0.07] rounded-2xl p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
              <Shield size={16} className="text-[var(--accent)]" />
            </div>
            <div>
              <h2 className="text-[var(--text-primary)] text-[15px] font-black leading-tight">Welcome back</h2>
              <p className="text-[var(--text-muted)] text-[12px]">Sign in to your admin account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Email Address</label>
              <input {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } })} type="email" placeholder="admin@trc.in" className={inputCls(!!errors.email)} />
              {errors.email && <span className="text-[11px] text-red-400">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Password</label>
                <Link href="/admin/forgot-password" className="text-[11px] text-[var(--accent)]/70 hover:text-[var(--accent)] transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <input {...register("password", { required: "Password is required" })} type={showPassword ? "text" : "password"} placeholder="Enter your password" className={inputCls(!!errors.password) + " pr-11"} />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <span className="text-[11px] text-red-400">{errors.password.message}</span>}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] px-4 py-2.5 rounded-xl">{error}</div>
            )}

            <button type="submit" disabled={isSubmitting || loading} className="w-full bg-[var(--accent)] text-white font-bold text-[14px] rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-green-500 active:scale-[0.98] transition-all disabled:opacity-60 mt-1">
              {loading
                ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" /></svg>
                : <>Sign In <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-center text-[12px] text-[var(--text-muted)] mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/admin/register" className="text-[var(--accent)] font-semibold hover:underline">Register</Link>
          </p>
        </div>

        <p className="text-center text-[11px] text-white/20 mt-5">Protected area · TRC Admin Portal</p>
      </div>
    </div>
  )
}
// ── Types ─────────────────────────────────────────────────────────────

export interface Stat {
  value: string
  label: string
}

export interface WarningSign {
  icon: string
  title: string
  desc: string
}

export interface Reel {
  id: number
  platform: "instagram" | "youtube"
  label: string
  title: string
  duration: string
  href: string
}

export interface Story {
  id: number
  location: string
  loss: string
  category: string
  summary: string
  date: string
}

// ── Data ──────────────────────────────────────────────────────────────

export const stats: Stat[] = [
  { value: "₹2.4Cr+", label: "Lost in rental scams in 2025" },
  { value: "3,800+", label: "Reported cases across India" },
  { value: "68%",    label: "Victims were first-time renters" },
  { value: "91%",    label: "Scams happened via unverified platforms" },
]

export const warningSigns: WarningSign[] = [
  {
    icon: "💸",
    title: "Advance payment demands",
    desc: "Scammers ask for full payment before showing the equipment or signing any agreement. Never pay fully upfront.",
  },
  {
    icon: "📵",
    title: "Unverifiable contact details",
    desc: "No physical address, no business registration, no verifiable social presence — classic red flags.",
  },
  {
    icon: "🪪",
    title: "Fake identity documents",
    desc: "Stolen Aadhaar, PAN, or GST documents used to appear legitimate. Always cross-verify before engaging.",
  },
  {
    icon: "📦",
    title: "Too-good-to-be-true pricing",
    desc: "If rental prices are 50–70% below market rate, the deal is likely a trap to lure victims.",
  },
  {
    icon: "⏱️",
    title: "Urgency pressure tactics",
    desc: "\"Only available today\" or \"another buyer is interested\" — pressure to decide fast without due diligence.",
  },
  {
    icon: "🔗",
    title: "Suspicious payment links",
    desc: "Random UPI IDs, unbranded payment portals, or requests to pay via crypto or gift cards.",
  },
]

export const reels: Reel[] = [
  {
    id: 1,
    platform: "instagram",
    label: "Instagram Reel",
    title: "How a rental scam cost this vendor ₹1.8 lakh",
    duration: "1:12",
    href: "https://instagram.com",
  },
  {
    id: 2,
    platform: "youtube",
    label: "YouTube Short",
    title: "Fake documents used to steal equipment worth ₹3 lakh",
    duration: "0:58",
    href: "https://youtube.com",
  },
  {
    id: 3,
    platform: "instagram",
    label: "Instagram Reel",
    title: "The advance payment trap — a real story from Pune",
    duration: "1:34",
    href: "https://instagram.com",
  },
  {
    id: 4,
    platform: "youtube",
    label: "YouTube Short",
    title: "5 signs someone is trying to scam you in a rental deal",
    duration: "0:47",
    href: "https://youtube.com",
  },
  {
    id: 5,
    platform: "instagram",
    label: "Instagram Reel",
    title: "Scammer used a cloned WhatsApp profile to steal cameras",
    duration: "1:22",
    href: "https://instagram.com",
  },
  {
    id: 6,
    platform: "youtube",
    label: "YouTube Short",
    title: "How TRC community stopped a repeat offender",
    duration: "1:05",
    href: "https://youtube.com",
  },
]

export const stories: Story[] = [
  {
    id: 1,
    location: "Pune, Maharashtra",
    loss: "₹85,000",
    category: "Equipment theft",
    summary:
      "A rental vendor was approached by someone claiming to be a film producer. After collecting camera equipment worth ₹85,000, the person disappeared with a cloned Aadhaar card and a fake production company name.",
    date: "Jan 2026",
  },
  {
    id: 2,
    location: "Mumbai, Maharashtra",
    loss: "₹1,20,000",
    category: "Advance payment fraud",
    summary:
      "A listing on a popular classifieds site advertised professional lighting gear at 60% below market price. The buyer paid ₹1.2 lakh in advance and received empty boxes stuffed with newspaper.",
    date: "Feb 2026",
  },
  {
    id: 3,
    location: "Bangalore, Karnataka",
    loss: "₹2,40,000",
    category: "Identity fraud",
    summary:
      "A vendor rented out drones and gimbal equipment to a person presenting forged GST documents. The equipment was never returned and the contact number was disconnected within 48 hours.",
    date: "Mar 2026",
  },
]

export const platformColor: Record<string, string> = {
  instagram: "bg-[#E1306C]/10 text-[#E1306C] border-[#E1306C]/20",
  youtube:   "bg-red-500/10 text-red-400 border-red-500/20",
}
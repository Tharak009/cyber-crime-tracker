import { Link } from "react-router-dom";

const preventionPillars = [
  {
    title: "Verify identity",
    points: [
      "Treat urgent payment requests, refund calls, and KYC warnings as suspicious until verified independently.",
      "Do not trust caller ID, display names, or forwarded screenshots as proof."
    ]
  },
  {
    title: "Protect credentials",
    points: [
      "Never share OTPs, UPI PINs, CVV numbers, or remote-access codes.",
      "Use unique passwords and enable MFA for email, banking, and social platforms."
    ]
  },
  {
    title: "Preserve evidence",
    points: [
      "Capture screenshots, transaction references, profile links, and domain names immediately.",
      "Do not edit or forward suspicious files in ways that alter their metadata."
    ]
  }
];

const redFlags = [
  "Messages that push urgency: account blocked, refund expiring, or legal action in minutes",
  "Requests to install screen-sharing or APK files outside trusted app stores",
  "Fake shopping pages with deep discounts and payment-only checkout links",
  "Unknown contacts asking to move chats to another platform after promising jobs or investment returns",
  "QR-code scams that claim you must scan to receive money"
];

const reportingChecklist = [
  "Date and time of the incident",
  "Contact number, email, username, or website involved",
  "Transaction amount and payment reference, if applicable",
  "Screenshots, emails, URLs, and chat logs",
  "Any steps already taken, such as card freeze or password reset"
];

export default function SafetyTipsPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link className="btn-secondary" to="/">Back to home</Link>
          <div className="flex gap-3">
            <Link className="btn-secondary" to="/about">About</Link>
            <Link className="btn-primary" to="/report-crime">Report Crime</Link>
          </div>
        </div>

        <section className="card overflow-hidden">
          <div className="grid gap-8 bg-[linear-gradient(135deg,rgba(14,143,105,0.92),rgba(15,23,42,0.95))] px-6 py-10 text-white lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-brand-100">Cyber safety handbook</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight">Prevention helps. Fast, well-documented reporting helps even more.</h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200">
                Use this page as a practical reference for avoiding common cyber scams and preparing the exact information needed if something goes wrong.
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Best first response</p>
              <div className="mt-5 space-y-3">
                <div className="rounded-3xl bg-white/10 p-4 text-sm text-slate-100">Pause before sending money or credentials.</div>
                <div className="rounded-3xl bg-white/10 p-4 text-sm text-slate-100">Independently verify any caller or payment demand.</div>
                <div className="rounded-3xl bg-white/10 p-4 text-sm text-slate-100">Record evidence before accounts, chats, or fake pages disappear.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {preventionPillars.map((pillar) => (
            <article key={pillar.title} className="card p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Prevention pillar</p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">{pillar.title}</h2>
              <div className="mt-5 space-y-3">
                {pillar.points.map((point) => (
                  <p key={point} className="rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {point}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="card p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Scam red flags</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900">Patterns that deserve immediate suspicion</h2>
            <div className="mt-6 space-y-3">
              {redFlags.map((flag) => (
                <div key={flag} className="rounded-3xl border border-slate-200 p-4 text-sm leading-6 text-slate-700">
                  {flag}
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Before you report</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900">Keep these details ready for a stronger complaint</h2>
            <div className="mt-6 space-y-3">
              {reportingChecklist.map((item) => (
                <div key={item} className="rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
            <Link className="btn-primary mt-6" to="/report-crime">
              Open Reporting Form
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

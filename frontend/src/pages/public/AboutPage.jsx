import { Link } from "react-router-dom";

const missionCards = [
  {
    title: "For citizens",
    description: "A structured reporting flow helps victims submit usable complaints, preserve proof, and follow the investigation without uncertainty."
  },
  {
    title: "For officers",
    description: "Assigned cases, timelines, evidence references, and status controls reduce fragmented investigation work."
  },
  {
    title: "For administrators",
    description: "Supervisors can monitor case movement, assign officers, publish warnings, and review crime trends across the system."
  }
];

const caseJourney = [
  "Complaint submitted with incident details and contact information",
  "Review and triage by admin or cyber crime officer",
  "Officer assignment with priority and remarks",
  "Evidence request, investigation updates, and internal notes",
  "Resolution, closure, and citizen feedback"
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link className="btn-secondary" to="/">Back to home</Link>
          <div className="flex gap-3">
            <Link className="btn-secondary" to="/safety-tips">Safety Tips</Link>
            <Link className="btn-primary" to="/report-crime">Report Crime</Link>
          </div>
        </div>

        <section className="card overflow-hidden">
          <div className="grid gap-8 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(14,143,105,0.88))] px-6 py-10 text-white lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-brand-100">About the platform</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight">Cyber crime awareness works best when reporting, evidence, and follow-up are all connected.</h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200">
                This project is designed around a realistic public-sector workflow: victims report incidents online, officers investigate assigned cases, administrators manage staffing and oversight, and the system keeps each step visible through notifications and case history.
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Why this matters</p>
              <div className="mt-5 space-y-4 text-sm leading-6 text-slate-200">
                <p>Cyber crimes often move quickly across payment systems, communication apps, fake domains, and compromised accounts.</p>
                <p>When complaints are incomplete or delayed, evidence can disappear and traceability drops.</p>
                <p>This system is meant to reduce that gap by guiding the user and keeping the case workflow accountable end to end.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {missionCards.map((card) => (
            <article key={card.title} className="card p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Stakeholder view</p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">{card.title}</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">{card.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="card p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Core awareness principles</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900">Good cyber awareness is not just prevention. It is also readiness.</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              <p>People need to know what suspicious behavior looks like, what evidence to preserve, when to escalate, and how to avoid making the incident worse.</p>
              <p>Institutions need systems that make reporting easy enough to use under stress and structured enough to support an actual investigation.</p>
              <p>This application tries to meet both needs at the same time.</p>
            </div>
          </div>
          <div className="card p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Case journey</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900">What a complete complaint lifecycle looks like</h2>
            <div className="mt-6 space-y-3">
              {caseJourney.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-3xl bg-slate-50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                    0{index + 1}
                  </div>
                  <p className="text-sm leading-6 text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { crimeTypes } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";
import { dashboardRouteForRole, formatEnumLabel } from "../../utils/formatters";

const platformHighlights = [
  {
    title: "Guided complaint filing",
    description: "Citizens can file structured reports with incident details, suspect references, and evidence-ready timelines."
  },
  {
    title: "Officer investigation workspace",
    description: "Assigned officers update status, request more proof, add notes, and keep the case trail visible."
  },
  {
    title: "Admin command center",
    description: "Supervisors manage officers, assign workloads, publish warnings, and monitor resolution trends."
  }
];

const responseSteps = [
  "Create an account so the complaint can stay linked to your case history.",
  "Submit the incident with dates, suspect details, amount lost, and supporting evidence.",
  "Track assignment, evidence requests, investigation progress, and case closure in one place."
];

const emergencyChecklist = [
  "Freeze cards or banking access if money was moved.",
  "Preserve screenshots, emails, transaction IDs, and call logs.",
  "Do not delete chats, links, or suspicious attachments before reporting.",
  "Change passwords and enable MFA for email, banking, and social accounts."
];

export default function HomePage() {
  const { user, logout } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const dashboardRoute = dashboardRouteForRole(user?.role);

  useEffect(() => {
    api
      .get("/announcements/public", { headers: { Authorization: undefined } })
      .then((response) => setAnnouncements(Array.isArray(response.data.data) ? response.data.data : []))
      .catch(() => setAnnouncements([]));
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,143,105,0.20),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.15),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <header className="card mb-8 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(14,143,105,0.86))] px-6 py-5 text-white lg:px-8">
            <div className="flex items-center gap-4">
              <img src="/logo-dark.svg" alt="Cyber Crime Tracker" className="h-14 w-auto" />
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-brand-100">Citizen safety platform</p>
                <h1 className="mt-3 text-2xl font-semibold lg:text-3xl">Cyber Crime Reporting &amp; Case Tracking System</h1>
              </div>
            </div>
            <nav className="flex flex-wrap gap-3">
              <Link to="/about" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20">About</Link>
              <Link to="/safety-tips" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20">Safety Tips</Link>
              {user ? (
                <>
                  <Link to={dashboardRoute} className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20">Dashboard</Link>
                  <Link to="/profile" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20">Profile</Link>
                  <button type="button" onClick={logout} className="btn-primary">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20">Login</Link>
                  <Link to="/register" className="btn-primary">Register</Link>
                </>
              )}
            </nav>
          </div>
          <section className="grid gap-8 px-6 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-700">Modern cyber response workflow</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 lg:text-5xl">
                Report faster, preserve evidence better, and keep every case visible from complaint to closure.
              </h2>
              <p className="mt-6 max-w-2xl text-lg text-slate-600">
                This platform combines secure reporting, officer workflows, public safety alerts, evidence handling, administrative supervision, and realtime notifications in one place.
              </p>
              {user && (
                <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-3xl border border-brand-200 bg-brand-50 px-5 py-4 text-sm text-brand-900">
                  <span className="font-semibold">Signed in as {user.fullName}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                    {formatEnumLabel(user.role)}
                  </span>
                </div>
              )}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to={user ? dashboardRoute : "/report-crime"} className="btn-primary">
                  {user ? "Return to Dashboard" : "Report Crime Now"}
                </Link>
                <Link to={user ? "/profile" : "/login"} className="btn-secondary">
                  {user ? "Open Profile" : "Track Existing Case"}
                </Link>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Available reporting modes</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">11</p>
                  <p className="mt-2 text-sm text-slate-600">Fraud, phishing, identity theft, harassment, malware, and more.</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Realtime updates</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">WebSocket</p>
                  <p className="mt-2 text-sm text-slate-600">Case assignment, evidence requests, and investigation movement reach dashboards live.</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Built for traceability</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">Audit-ready</p>
                  <p className="mt-2 text-sm text-slate-600">Every status change, admin action, and reporting step stays visible across the system.</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-[2rem] bg-slateX p-6 text-white shadow-panel">
                <p className="text-xs uppercase tracking-[0.35em] text-brand-100">Response flow</p>
                <div className="mt-5 space-y-4">
                  {responseSteps.map((step, index) => (
                    <div key={step} className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold">
                        0{index + 1}
                      </div>
                      <p className="text-sm leading-6 text-slate-200">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-slate-900">Public announcements</h3>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                    Live alerts
                  </span>
                </div>
                <div className="mt-5 space-y-4">
                  {announcements.length === 0 && <p className="text-sm text-slate-500">No active alerts published right now.</p>}
                  {announcements.slice(0, 3).map((item) => (
                    <article key={item.id} className="rounded-3xl border border-slate-200 p-4">
                      <h4 className="font-semibold text-slate-900">{item.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.content}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </header>

        <section className="mb-8 grid gap-6 lg:grid-cols-3">
          {platformHighlights.map((highlight) => (
            <article key={highlight.title} className="card p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Platform capability</p>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{highlight.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{highlight.description}</p>
            </article>
          ))}
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="card p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Supported cyber crimes</p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-900">Report the exact digital threat you are facing</h3>
            <div className="mt-6 flex flex-wrap gap-3">
              {crimeTypes.map((type) => (
                <span key={type} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                  {type}
                </span>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Immediate action checklist</p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-900">What to do in the first few minutes</h3>
            <div className="mt-6 space-y-3">
              {emergencyChecklist.map((item) => (
                <div key={item} className="rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card overflow-hidden">
          <div className="grid gap-6 bg-[linear-gradient(135deg,rgba(14,143,105,0.92),rgba(15,23,42,0.95))] px-6 py-8 text-white lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-brand-100">Ready to act</p>
              <h3 className="mt-4 text-3xl font-semibold">Start with the right path for your role</h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
                Citizens can report incidents and track cases, officers can manage assigned investigations, and administrators can coordinate resources and publish public warnings.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <Link className="rounded-3xl bg-white px-5 py-4 text-center font-medium text-slate-900 transition hover:bg-slate-100" to="/register">
                Create Citizen Account
              </Link>
              <Link className="rounded-3xl bg-white/10 px-5 py-4 text-center font-medium text-white transition hover:bg-white/20" to="/login">
                Officer Login
              </Link>
              <Link className="rounded-3xl bg-white/10 px-5 py-4 text-center font-medium text-white transition hover:bg-white/20" to="/report-crime">
                Go to Report Form
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

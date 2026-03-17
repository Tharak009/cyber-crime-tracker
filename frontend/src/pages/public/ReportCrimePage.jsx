import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import ComplaintForm from "../../components/common/ComplaintForm";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const evidenceChecklist = [
  "Screenshots of chats, emails, payment pages, and suspicious profiles",
  "Transaction IDs, order numbers, UPI references, or bank SMS alerts",
  "Fraud website link, email address, phone number, or social profile involved",
  "A short step-by-step summary of what happened and when"
];

export default function ReportCrimePage() {
  const { user } = useAuth();
  const [success, setSuccess] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)]">
        <div className="mx-auto max-w-4xl px-4 py-16 lg:px-6">
          <div className="card overflow-hidden">
            <div className="grid gap-8 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(14,143,105,0.86))] px-8 py-10 text-white lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-brand-100">Secure complaint filing</p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight">Login is required before a complaint can be tracked safely.</h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-200">
                  Complaints are tied to a citizen account so the case timeline, officer communication, evidence uploads, and feedback history stay linked to the right person.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-300">What you get after login</p>
                <div className="mt-5 space-y-3 text-sm text-slate-100">
                  <div className="rounded-3xl bg-white/10 p-4">Structured complaint filing with required details</div>
                  <div className="rounded-3xl bg-white/10 p-4">Evidence upload and case progress updates</div>
                  <div className="rounded-3xl bg-white/10 p-4">Secure notifications when officers change case status</div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 px-8 py-8">
              <Link className="btn-primary" to="/login">Login</Link>
              <Link className="btn-secondary" to="/register">Create Citizen Account</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "ROLE_CITIZEN") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link className="btn-secondary" to="/">Back to home</Link>
          <div className="flex gap-3">
            <Link className="btn-secondary" to="/citizen">Go to Dashboard</Link>
            <Link className="btn-primary" to="/safety-tips">Safety Tips</Link>
          </div>
        </div>

        <section className="card overflow-hidden">
          <div className="grid gap-8 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(14,143,105,0.88))] px-6 py-10 text-white lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-brand-100">Citizen reporting desk</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight">File a cyber crime complaint with enough detail to support investigation.</h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200">
                Write clearly, include suspect references, and keep the description factual. After submission, you can continue from the citizen dashboard for evidence uploads, notifications, support tickets, and feedback.
              </p>
              {success && <p className="mt-6 rounded-3xl bg-white/10 px-5 py-4 text-sm text-white">{success}</p>}
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Evidence checklist</p>
              <div className="mt-5 space-y-3">
                {evidenceChecklist.map((item) => (
                  <div key={item} className="rounded-3xl bg-white/10 p-4 text-sm text-slate-100">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-6 px-6 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
            <ComplaintForm
              onSubmit={async (payload) => {
                await api.post("/complaints/create", payload);
                setSuccess("Complaint submitted successfully. Continue in the citizen dashboard to upload evidence and track updates.");
              }}
            />
            <div className="space-y-6">
              <div className="card p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-brand-700">How your case moves</p>
                <div className="mt-5 space-y-3">
                  {["Submitted", "Under Review", "Assigned to Officer", "Investigation Ongoing", "Resolved or Closed"].map((status) => (
                    <div key={status} className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                      {status}
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-brand-700">After submission</p>
                <div className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                  <p>Track your complaint status from the citizen dashboard.</p>
                  <p>Upload evidence whenever officers request more information.</p>
                  <p>Submit support tickets if you need operational help using the system.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import StatsCards from "../components/common/StatsCards";
import StatusBadge from "../components/common/StatusBadge";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { dashboardRouteForRole, formatEnumLabel } from "../utils/formatters";

function roleSummaryCards(role, stats) {
  if (role === "ROLE_ADMIN") {
    return [
      { label: "Total users", value: stats.totalUsers || 0, helper: "All registered accounts in the system" },
      { label: "Open cases", value: stats.openCases || 0, helper: "Complaints requiring active operational attention" },
      { label: "Resolved cases", value: stats.resolvedCases || 0, helper: "Investigations completed successfully" },
      { label: "Total complaints", value: stats.totalComplaints || 0, helper: "Overall complaint volume" }
    ];
  }

  if (role === "ROLE_OFFICER") {
    return [
      { label: "Assigned cases", value: stats.assignedCases || 0, helper: "Cases currently routed to you" },
      { label: "Active cases", value: stats.activeCases || 0, helper: "Investigations still in progress" },
      { label: "Evidence requested", value: stats.evidenceRequested || 0, helper: "Waiting for complainant response" },
      { label: "Resolved", value: stats.resolvedCases || 0, helper: "Cases closed out by your workflow" }
    ];
  }

  return [
    { label: "My complaints", value: stats.totalComplaints || 0, helper: "Complaints linked to this citizen account" },
    { label: "Open cases", value: stats.openCases || 0, helper: "Cases still under review or investigation" },
    { label: "Resolved cases", value: stats.resolvedCases || 0, helper: "Cases ready for closure feedback" },
    { label: "Support tickets", value: stats.supportTickets || 0, helper: "Requests you have raised with system support" }
  ];
}

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [summaryStats, setSummaryStats] = useState({});
  const [profileForm, setProfileForm] = useState({ fullName: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, next: false, confirm: false });
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const loadSummaryStats = useCallback(async () => {
    if (user?.role === "ROLE_ADMIN") {
      const { data } = await api.get("/admin/statistics");
      setSummaryStats(data.data || {});
      return;
    }

    if (user?.role === "ROLE_OFFICER") {
      const { data } = await api.get("/cases/assigned");
      const cases = Array.isArray(data.data) ? data.data : [];
      setSummaryStats({
        assignedCases: cases.length,
        activeCases: cases.filter((item) => !["RESOLVED", "CLOSED"].includes(item.status)).length,
        evidenceRequested: cases.filter((item) => item.status === "EVIDENCE_REQUESTED").length,
        resolvedCases: cases.filter((item) => item.status === "RESOLVED").length
      });
      return;
    }

    const [complaintsRes, supportRes] = await Promise.all([api.get("/complaints/user"), api.get("/support")]);
    const complaints = Array.isArray(complaintsRes.data.data) ? complaintsRes.data.data : [];
    const tickets = Array.isArray(supportRes.data.data) ? supportRes.data.data : [];
    setSummaryStats({
      totalComplaints: complaints.length,
      openCases: complaints.filter((item) => !["RESOLVED", "CLOSED"].includes(item.status)).length,
      resolvedCases: complaints.filter((item) => item.status === "RESOLVED").length,
      supportTickets: tickets.length
    });
  }, [user?.role]);

  useEffect(() => {
    refreshProfile().then((data) => {
      setProfile(data);
      setProfileForm({
        fullName: data.fullName || "",
        phone: data.phone || ""
      });
    });
    loadSummaryStats();
  }, [loadSummaryStats, refreshProfile]);

  const statsCards = useMemo(() => roleSummaryCards(user?.role, summaryStats), [summaryStats, user?.role]);

  const links = [
    { href: "#overview", label: "Overview", description: "Account status and role summary" },
    { href: "#details", label: "Profile Details", description: "Personal information on record" },
    { href: "#security", label: "Security", description: "Password and account protection" }
  ];

  const dashboardHome = dashboardRouteForRole(user?.role);

  return (
    <AppShell
      title="My Profile"
      subtitle="Manage your personal account details, review account status, and keep your security settings current."
      links={links}
      actions={[
        { label: "Back to dashboard", to: dashboardHome, variant: "secondary" }
      ]}
    >
      <section id="overview" className="scroll-mt-24">
        <StatsCards cards={statsCards} />

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="card p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Account summary</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">{profile?.fullName || user?.fullName}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-2 font-medium text-slate-900">{profile?.email || user?.email}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Role</p>
                <div className="mt-2">
                  <StatusBadge value={profile?.role || user?.role} />
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Account status</p>
                <div className="mt-2">
                  <StatusBadge value={profile?.status} />
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Email verification</p>
                <p className="mt-2 font-medium text-slate-900">{profile?.emailVerified ? "Verified" : "Pending verification"}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Profile guidance</p>
            <div className="mt-5 space-y-3">
              {[
                "Keep your phone number current so officers or support staff can verify contact details when needed.",
                "Use a strong password and rotate it if you suspect your credentials were exposed elsewhere.",
                `Your current access role is ${formatEnumLabel(profile?.role || user?.role)}.`
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="details" className="mt-10 scroll-mt-24">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Profile details</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Update the information attached to your account</h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <form
            className="card p-6"
            onSubmit={async (event) => {
              event.preventDefault();
              setProfileError("");
              setProfileMessage("");
              try {
                const { data } = await api.put("/auth/me", profileForm);
                setProfile(data.data);
                await refreshProfile();
                setProfileMessage("Profile updated successfully.");
              } catch (err) {
                setProfileError(err.response?.data?.message || "Failed to update profile");
              }
            }}
          >
            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="profile-full-name">Full name</label>
                <input
                  id="profile-full-name"
                  className="input"
                  value={profileForm.fullName}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, fullName: event.target.value }))}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="profile-email">Email</label>
                <input id="profile-email" className="input bg-slate-50" value={profile?.email || user?.email || ""} disabled />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="profile-phone">Phone</label>
                <input
                  id="profile-phone"
                  className="input"
                  value={profileForm.phone}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, phone: event.target.value }))}
                />
              </div>
              {profileError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{profileError}</p>}
              {profileMessage && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{profileMessage}</p>}
              <button className="btn-primary" type="submit">Save Profile Changes</button>
            </div>
          </form>

          <div className="card p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Record details</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-3xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">User ID</p>
                <p className="mt-2 font-medium text-slate-900">{profile?.id || user?.id || "-"}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Role policy</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Access rights are controlled by your system role and cannot be changed from the profile page.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Verification state</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {profile?.emailVerified ? "Your email is verified and ready for full notification workflows." : "Your email is still pending verification."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="security" className="mt-10 scroll-mt-24">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Security</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Change your password and review account protection basics</h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <form
            className="card p-6"
            onSubmit={async (event) => {
              event.preventDefault();
              setPasswordError("");
              setPasswordMessage("");
              if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                setPasswordError("New password and confirmation do not match");
                return;
              }
              try {
                await api.patch("/auth/change-password", {
                  currentPassword: passwordForm.currentPassword,
                  newPassword: passwordForm.newPassword
                });
                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setPasswordMessage("Password changed successfully.");
              } catch (err) {
                setPasswordError(err.response?.data?.message || "Failed to change password");
              }
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="current-password">Current password</label>
                <div className="flex gap-3">
                  <input
                    id="current-password"
                    className="input"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                  />
                  <button className="btn-secondary" type="button" onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}>
                    {showPasswords.current ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="new-password">New password</label>
                <div className="flex gap-3">
                  <input
                    id="new-password"
                    className="input"
                    type={showPasswords.next ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                  />
                  <button className="btn-secondary" type="button" onClick={() => setShowPasswords((prev) => ({ ...prev, next: !prev.next }))}>
                    {showPasswords.next ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="confirm-password">Confirm new password</label>
                <div className="flex gap-3">
                  <input
                    id="confirm-password"
                    className="input"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                  />
                  <button className="btn-secondary" type="button" onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}>
                    {showPasswords.confirm ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {passwordError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{passwordError}</p>}
              {passwordMessage && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{passwordMessage}</p>}
              <button className="btn-primary" type="submit">Update Password</button>
            </div>
          </form>

          <div className="card p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Security checklist</p>
            <div className="mt-5 space-y-3">
              {[
                "Use a password you do not reuse across banking, email, and social accounts.",
                "Change the password immediately if you suspect phishing or credential reuse.",
                "Keep your contact details current so important security-related notices can reach you."
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

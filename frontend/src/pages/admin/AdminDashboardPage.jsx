import { useCallback, useEffect, useState } from "react";
import AppShell from "../../components/layout/AppShell";
import StatsCards from "../../components/common/StatsCards";
import ComplaintTable from "../../components/common/ComplaintTable";
import { BarChartCard, DoughnutChartCard } from "../../components/common/ChartCard";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../services/api";
import useApi from "../../hooks/useApi";
import { useComplaintSearch } from "../../hooks/useComplaints";
import { formatEnumLabel } from "../../utils/formatters";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: value.includes?.("T") ? "short" : undefined
  }).format(new Date(value));
}

export default function AdminDashboardPage() {
  const statsRequest = useCallback(async () => {
    const { data } = await api.get("/admin/statistics");
    return data.data;
  }, []);
  const { data: stats, execute: loadStats } = useApi(statsRequest, false);
  const { data: complaintsData, execute: loadComplaints } = useComplaintSearch();
  const [users, setUsers] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [assignment, setAssignment] = useState({ complaintId: "", officerId: "", priorityLevel: "HIGH", remarks: "" });
  const [announcement, setAnnouncement] = useState({ title: "", content: "", published: true });
  const [assignmentError, setAssignmentError] = useState("");
  const [assignmentSuccess, setAssignmentSuccess] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [filters, setFilters] = useState({ query: "", status: "ALL", priority: "ALL" });
  const complaints = Array.isArray(complaintsData) ? complaintsData : [];
  const officerList = Array.isArray(officers) ? officers : [];
  const userList = Array.isArray(users) ? users : [];
  const publicAnnouncements = Array.isArray(announcements) ? announcements : [];
  const complaintStats = stats?.complaintsByType && typeof stats.complaintsByType === "object" ? stats.complaintsByType : {};
  const statusStats = stats?.casesByStatus && typeof stats.casesByStatus === "object" ? stats.casesByStatus : {};

  const load = useCallback(async () => {
    const [usersRes, officersRes, announcementsRes] = await Promise.all([
      api.get("/admin/users"),
      api.get("/admin/officers"),
      api.get("/announcements/public", { headers: { Authorization: undefined } })
    ]);
    await Promise.all([loadStats(), loadComplaints()]);
    setUsers(Array.isArray(usersRes.data.data) ? usersRes.data.data : []);
    setOfficers(Array.isArray(officersRes.data.data) ? officersRes.data.data : []);
    setAnnouncements(Array.isArray(announcementsRes.data.data) ? announcementsRes.data.data : []);
  }, [loadComplaints, loadStats]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredComplaints = complaints.filter((item) => {
    const searchText = filters.query.trim().toLowerCase();
    const matchesSearch = !searchText ||
      [item.complaintNumber, item.title, item.crimeType, item.citizenName, item.assignedOfficerName]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(searchText));
    const matchesStatus = filters.status === "ALL" || item.status === filters.status;
    const matchesPriority = filters.priority === "ALL" || item.priorityLevel === filters.priority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const roleCounts = userList.reduce(
    (acc, user) => {
      if (user.role === "ROLE_CITIZEN") acc.citizens += 1;
      if (user.role === "ROLE_OFFICER") acc.officers += 1;
      if (user.role === "ROLE_ADMIN") acc.admins += 1;
      return acc;
    },
    { citizens: 0, officers: 0, admins: 0 }
  );

  const officerWorkload = officerList
    .map((officer) => ({
      ...officer,
      activeCases: complaints.filter(
        (complaint) => complaint.assignedOfficerName === officer.fullName && !["RESOLVED", "CLOSED"].includes(complaint.status)
      ).length
    }))
    .sort((left, right) => right.activeCases - left.activeCases);

  const links = [
    { href: "#overview", label: "Overview", description: "System metrics and trends" },
    { href: "#operations", label: "Operations", description: "Complaint search and triage" },
    { href: "#assignment", label: "Assignments", description: "Officer routing and workload" },
    { href: "#governance", label: "Governance", description: "Users, alerts, and reports" }
  ];

  return (
    <AppShell
      title="Admin Dashboard"
      subtitle="Coordinate case flow, balance officer workload, monitor trends, and keep the public informed with a fuller command-center view."
      links={links}
      actions={[
        { label: "Refresh data", onClick: load, variant: "primary" },
        { label: "Home", to: "/", variant: "secondary" }
      ]}
    >
      <section id="overview" className="scroll-mt-24">
        {stats && (
          <StatsCards
            cards={[
              { label: "Total users", value: stats.totalUsers, helper: "Citizens, officers, and admins" },
              { label: "Total complaints", value: stats.totalComplaints, helper: "All reported cyber crimes" },
              { label: "Open cases", value: stats.openCases, helper: "Need active follow-up" },
              { label: "Resolved cases", value: stats.resolvedCases, helper: "Completed investigations" }
            ]}
          />
        )}

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            {stats && (
              <div className="grid gap-6 xl:grid-cols-2">
                <BarChartCard title="Crime Type Statistics" labels={Object.keys(complaintStats)} values={Object.values(complaintStats)} />
                <DoughnutChartCard title="Case Resolution Rate" labels={Object.keys(statusStats)} values={Object.values(statusStats)} />
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-700">User base composition</p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Citizens</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{roleCounts.citizens}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Officers</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{roleCounts.officers}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Admins</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{roleCounts.admins}</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Operational watchlist</p>
              <div className="mt-5 space-y-3">
                {[
                  `Unassigned complaints: ${complaints.filter((item) => !item.assignedOfficerName).length}`,
                  `Critical priority complaints: ${complaints.filter((item) => item.priorityLevel === "CRITICAL").length}`,
                  `Evidence-request backlog: ${complaints.filter((item) => item.status === "EVIDENCE_REQUESTED").length}`
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-slate-200 p-4 text-sm leading-6 text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="operations" className="mt-10 scroll-mt-24">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Complaint operations</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Search the complaint pool and triage workload</h2>
        </div>
        <div className="card mb-6 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <input
              className="input"
              placeholder="Search complaint, citizen, officer, or crime type"
              value={filters.query}
              onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
            />
            <select className="input" value={filters.status} onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}>
              <option value="ALL">All statuses</option>
              {["SUBMITTED", "UNDER_REVIEW", "ASSIGNED_TO_OFFICER", "INVESTIGATION_STARTED", "EVIDENCE_REQUESTED", "INVESTIGATION_ONGOING", "RESOLVED", "CLOSED"].map((status) => (
                <option key={status} value={status}>
                  {formatEnumLabel(status)}
                </option>
              ))}
            </select>
            <select className="input" value={filters.priority} onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value }))}>
              <option value="ALL">All priorities</option>
              {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((priority) => (
                <option key={priority} value={priority}>
                  {formatEnumLabel(priority)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ComplaintTable
          complaints={filteredComplaints}
          title="All complaints"
          caption="Filter the queue before assignment or escalation."
          emptyMessage="No complaints match the current filters."
        />
      </section>

      <section id="assignment" className="mt-10 scroll-mt-24">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Assignment desk</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Route cases to officers with visibility into workload</h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-slate-900">Assign case to officer</h3>
            <div className="mt-5 space-y-4">
              <select className="input" value={assignment.complaintId} onChange={(event) => setAssignment({ ...assignment, complaintId: event.target.value })}>
                <option value="">Select complaint</option>
                {complaints.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.complaintNumber} - {item.title}
                  </option>
                ))}
              </select>
              <select className="input" value={assignment.officerId} onChange={(event) => setAssignment({ ...assignment, officerId: event.target.value })}>
                <option value="">Select officer</option>
                {officerList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.fullName}
                  </option>
                ))}
              </select>
              <select className="input" value={assignment.priorityLevel} onChange={(event) => setAssignment({ ...assignment, priorityLevel: event.target.value })}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
              <textarea className="input min-h-24" placeholder="Assignment remarks" value={assignment.remarks} onChange={(event) => setAssignment({ ...assignment, remarks: event.target.value })} />
              {assignmentError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{assignmentError}</p>}
              {assignmentSuccess && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{assignmentSuccess}</p>}
              <button
                className="btn-primary"
                type="button"
                onClick={async () => {
                  setAssignmentError("");
                  setAssignmentSuccess("");
                  try {
                    await api.post("/cases/assign", {
                      complaintId: Number(assignment.complaintId),
                      officerId: Number(assignment.officerId),
                      priorityLevel: assignment.priorityLevel,
                      remarks: assignment.remarks
                    });
                    setAssignment({ complaintId: "", officerId: "", priorityLevel: "HIGH", remarks: "" });
                    setAssignmentSuccess("Case assigned successfully.");
                    await load();
                  } catch (err) {
                    setAssignmentError(err.response?.data?.message || "Failed to assign case");
                  }
                }}
              >
                Assign Case
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-semibold text-slate-900">Officer workload snapshot</h3>
            <div className="mt-5 space-y-3">
              {officerWorkload.map((officer) => (
                <div key={officer.id} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{officer.fullName}</p>
                      <p className="mt-1 text-sm text-slate-500">{officer.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-slate-900">{officer.activeCases}</p>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Active cases</p>
                    </div>
                  </div>
                </div>
              ))}
              {officerWorkload.length === 0 && <p className="text-sm text-slate-500">No officers available in the system.</p>}
            </div>
          </div>
        </div>
      </section>

      <section id="governance" className="mt-10 scroll-mt-24">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Governance and communication</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Manage alerts, keep public messaging current, and export oversight reports</h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-slate-900">Publish announcement</h3>
              <div className="mt-5 space-y-4">
                <input className="input" placeholder="Title" value={announcement.title} onChange={(event) => setAnnouncement({ ...announcement, title: event.target.value })} />
                <textarea className="input min-h-28" placeholder="Content" value={announcement.content} onChange={(event) => setAnnouncement({ ...announcement, content: event.target.value })} />
                {announcementMessage && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{announcementMessage}</p>}
                <button
                  className="btn-primary"
                  type="button"
                  onClick={async () => {
                    await api.post("/admin/announcements", announcement);
                    setAnnouncement({ title: "", content: "", published: true });
                    setAnnouncementMessage("Announcement published successfully.");
                    await load();
                  }}
                >
                  Publish
                </button>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-semibold text-slate-900">Quick exports</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                <a className="btn-secondary" href="http://localhost:8081/admin/reports/csv" target="_blank" rel="noreferrer">Download CSV</a>
                <a className="btn-secondary" href="http://localhost:8081/admin/reports/pdf" target="_blank" rel="noreferrer">Download PDF</a>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Export current system snapshots for monthly review, leadership reporting, or archival needs.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-slate-900">Published public alerts</h3>
              <div className="mt-5 space-y-3">
                {publicAnnouncements.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <StatusBadge value="HIGH" />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.content}</p>
                  </div>
                ))}
                {publicAnnouncements.length === 0 && <p className="text-sm text-slate-500">No public announcements published yet.</p>}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-semibold text-slate-900">Recent user roster</h3>
              <div className="mt-5 space-y-3">
                {userList.slice(0, 6).map((item) => (
                  <div key={item.id} className="rounded-3xl bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{item.fullName}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.email}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge value={item.role} />
                        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-400">{formatEnumLabel(item.status)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {userList.length === 0 && <p className="text-sm text-slate-500">No users available.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

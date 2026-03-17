import { useEffect, useState } from "react";
import AppShell from "../../components/layout/AppShell";
import ComplaintTable from "../../components/common/ComplaintTable";
import StatsCards from "../../components/common/StatsCards";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../services/api";
import { complaintStatuses, priorities } from "../../utils/constants";
import { useAssignedCases } from "../../hooks/useComplaints";
import { formatEnumLabel } from "../../utils/formatters";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: value.includes?.("T") ? "short" : undefined
  }).format(new Date(value));
}

export default function OfficerDashboardPage() {
  const { data: complaintsData, execute: loadCases } = useAssignedCases();
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");
  const [statusPayload, setStatusPayload] = useState({
    status: "INVESTIGATION_STARTED",
    priorityLevel: "HIGH",
    remarks: "",
    resolutionSummary: ""
  });
  const [note, setNote] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const complaints = Array.isArray(complaintsData) ? complaintsData : [];

  useEffect(() => {
    loadCases().then((items) => {
      if (!selected && Array.isArray(items) && items.length > 0) {
        setSelected(String(items[0].id));
      }
    });
  }, [loadCases]);

  const filteredComplaints = complaints.filter((item) => {
    const searchText = query.trim().toLowerCase();
    if (!searchText) return true;
    return [item.complaintNumber, item.title, item.crimeType, item.status, item.priorityLevel]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(searchText));
  });

  const currentCase = complaints.find((item) => item.id === Number(selected)) || filteredComplaints[0] || complaints[0] || null;
  const activeCases = complaints.filter((item) => !["RESOLVED", "CLOSED"].includes(item.status));
  const evidenceRequested = complaints.filter((item) => item.status === "EVIDENCE_REQUESTED");
  const highPriority = complaints.filter((item) => ["HIGH", "CRITICAL"].includes(item.priorityLevel));

  const links = [
    { href: "#overview", label: "Overview", description: "Investigation workload summary" },
    { href: "#queue", label: "Case Queue", description: "Assigned cases and filters" },
    { href: "#workspace", label: "Workspace", description: "Status updates and notes" },
    { href: "#timeline", label: "Timeline", description: "Evidence, notes, and history" }
  ];

  return (
    <AppShell
      title="Officer Dashboard"
      subtitle="Work your assigned queue with clearer case context, timeline visibility, officer notes, and direct status control."
      links={links}
      actions={[
        { label: "Refresh queue", onClick: loadCases, variant: "primary" },
        { label: "Home", to: "/", variant: "secondary" }
      ]}
    >
      <section id="overview" className="scroll-mt-24">
        <StatsCards
          cards={[
            { label: "Assigned cases", value: complaints.length, helper: "Current investigation queue" },
            { label: "Active investigations", value: activeCases.length, helper: "Cases still needing officer action" },
            { label: "Evidence requested", value: evidenceRequested.length, helper: "Awaiting complainant response" },
            { label: "High priority", value: highPriority.length, helper: "Urgent complaints to review first" }
          ]}
        />

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="card p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Investigation readiness</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Officer action checklist</h2>
            <div className="mt-5 space-y-3">
              {[
                "Confirm priority and incident pattern before contacting the complainant.",
                "Use citizen-visible notes only for updates that help the complainant act.",
                "Request additional evidence only when it materially helps the investigation."
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Selected case snapshot</p>
            {currentCase ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-[1.75rem] bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">{currentCase.complaintNumber}</p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{currentCase.title}</h2>
                    </div>
                    <StatusBadge value={currentCase.status} />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{currentCase.description}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Citizen</p>
                    <p className="mt-2 font-semibold text-slate-900">{currentCase.citizenName}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Crime type</p>
                    <p className="mt-2 font-semibold text-slate-900">{currentCase.crimeType}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Incident date</p>
                    <p className="mt-2 font-semibold text-slate-900">{formatDate(currentCase.incidentDate)}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Priority</p>
                    <div className="mt-2">
                      <StatusBadge value={currentCase.priorityLevel} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-500">No case selected. Choose one from the queue below.</p>
            )}
          </div>
        </div>
      </section>

      <section id="queue" className="mt-10 scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Assigned queue</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Search and open an investigation</h2>
          </div>
          <input
            className="input max-w-md"
            placeholder="Search by complaint number, title, status, or priority"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <ComplaintTable
          complaints={filteredComplaints}
          title="Assigned cases"
          caption="Use the queue to move into a case workspace with the right context."
          emptyMessage="No assigned cases match the search."
          selectedId={currentCase?.id}
          onSelect={(complaint) => setSelected(String(complaint.id))}
        />
      </section>

      <section id="workspace" className="mt-10 scroll-mt-24">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Investigation workspace</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Update status, set priority, and log officer notes</h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-slate-900">Case status controls</h3>
            <div className="mt-5 space-y-4">
              <select className="input" value={currentCase?.id || ""} onChange={(event) => setSelected(event.target.value)}>
                <option value="">Select complaint</option>
                {complaints.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.complaintNumber} - {item.title}
                  </option>
                ))}
              </select>
              <select className="input" value={statusPayload.status} onChange={(event) => setStatusPayload({ ...statusPayload, status: event.target.value })}>
                {complaintStatuses.map((status) => (
                  <option key={status} value={status}>
                    {formatEnumLabel(status)}
                  </option>
                ))}
              </select>
              <select className="input" value={statusPayload.priorityLevel} onChange={(event) => setStatusPayload({ ...statusPayload, priorityLevel: event.target.value })}>
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {formatEnumLabel(priority)}
                  </option>
                ))}
              </select>
              <textarea
                className="input min-h-24"
                placeholder="Internal or citizen-facing remarks for this status update"
                value={statusPayload.remarks}
                onChange={(event) => setStatusPayload({ ...statusPayload, remarks: event.target.value })}
              />
              <textarea
                className="input min-h-28"
                placeholder="Resolution summary for resolved or closed complaints"
                value={statusPayload.resolutionSummary}
                onChange={(event) => setStatusPayload({ ...statusPayload, resolutionSummary: event.target.value })}
              />
              {updateMessage && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{updateMessage}</p>}
              <button
                className="btn-primary"
                type="button"
                disabled={!currentCase}
                onClick={async () => {
                  await api.put(`/cases/update-status/${currentCase.id}`, statusPayload);
                  setUpdateMessage("Case status updated successfully.");
                  await loadCases();
                }}
              >
                Update Status
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-semibold text-slate-900">Investigation notes</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Use concise, factual notes. Keep `visible to citizen` updates supportive and action-oriented if the complainant needs to respond.
            </p>
            <textarea
              className="input mt-5 min-h-32"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add investigation note"
            />
            {noteMessage && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{noteMessage}</p>}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                className="btn-primary"
                type="button"
                disabled={!currentCase || !note.trim()}
                onClick={async () => {
                  await api.post(`/cases/${currentCase.id}/notes`, { note, visibleToCitizen: true });
                  setNote("");
                  setNoteMessage("Citizen-visible note saved.");
                  await loadCases();
                }}
              >
                Save Citizen Note
              </button>
              <button
                className="btn-secondary"
                type="button"
                disabled={!currentCase || !note.trim()}
                onClick={async () => {
                  await api.post(`/cases/${currentCase.id}/notes`, { note, visibleToCitizen: false });
                  setNote("");
                  setNoteMessage("Internal note saved.");
                  await loadCases();
                }}
              >
                Save Internal Note
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="timeline" className="mt-10 scroll-mt-24">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Case history</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Review timeline, notes, and evidence before the next action</h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-slate-900">Status history</h3>
            <div className="mt-5 space-y-4">
              {(currentCase?.timeline || []).map((entry, index) => (
                <div key={`${entry.status}-${index}`} className="flex gap-4">
                  <div className="mt-1 h-3 w-3 rounded-full bg-brand-500" />
                  <div className="flex-1 rounded-3xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <StatusBadge value={entry.status} />
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{formatDate(entry.createdAt)}</p>
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-900">{entry.updatedBy || "System"}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{entry.remarks || "No remarks added."}</p>
                  </div>
                </div>
              ))}
              {(!currentCase?.timeline || currentCase.timeline.length === 0) && (
                <p className="text-sm text-slate-500">Status history will populate as actions are taken.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-slate-900">Officer notes on case</h3>
              <div className="mt-5 space-y-3">
                {(currentCase?.notes || []).map((entry) => (
                  <div key={entry.id} className="rounded-3xl bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-medium text-slate-900">{entry.officerName || "Officer"}</p>
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                        {entry.visibleToCitizen ? "Visible to citizen" : "Internal"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-400">{formatDate(entry.createdAt)}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{entry.note}</p>
                  </div>
                ))}
                {(!currentCase?.notes || currentCase.notes.length === 0) && (
                  <p className="text-sm text-slate-500">No notes added for this case yet.</p>
                )}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-semibold text-slate-900">Evidence files</h3>
              <div className="mt-5 space-y-3">
                {(currentCase?.evidenceFiles || []).map((file) => (
                  <div key={file.id} className="rounded-3xl border border-slate-200 p-4">
                    <p className="font-medium text-slate-900">{file.originalName}</p>
                    <p className="mt-2 text-sm text-slate-500">{file.contentType || "Unknown type"}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">
                      {file.fileSize ? `${Math.round(file.fileSize / 1024)} KB` : "Size unavailable"}
                    </p>
                  </div>
                ))}
                {(!currentCase?.evidenceFiles || currentCase.evidenceFiles.length === 0) && (
                  <p className="text-sm text-slate-500">No evidence files uploaded yet for this case.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

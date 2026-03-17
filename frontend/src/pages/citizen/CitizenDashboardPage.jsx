import { useCallback, useEffect, useState } from "react";
import AppShell from "../../components/layout/AppShell";
import StatsCards from "../../components/common/StatsCards";
import ComplaintTable from "../../components/common/ComplaintTable";
import NotificationList from "../../components/common/NotificationList";
import ComplaintForm from "../../components/common/ComplaintForm";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useUserComplaints } from "../../hooks/useComplaints";
import useNotifications from "../../hooks/useNotifications";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: value.includes?.("T") ? "short" : undefined
  }).format(new Date(value));
}

export default function CitizenDashboardPage() {
  const { user } = useAuth();
  const { data: complaintsData, execute: loadComplaints } = useUserComplaints();
  const [notifications, setNotifications] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState("");
  const [complaintQuery, setComplaintQuery] = useState("");
  const [supportForm, setSupportForm] = useState({ subject: "", message: "" });
  const [feedbackForm, setFeedbackForm] = useState({ complaintId: "", rating: 5, satisfactionScore: 5, comment: "" });
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [supportMessage, setSupportMessage] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [evidenceMessage, setEvidenceMessage] = useState("");
  const complaints = Array.isArray(complaintsData) ? complaintsData : [];
  const notificationList = Array.isArray(notifications) ? notifications : [];
  const ticketList = Array.isArray(supportTickets) ? supportTickets : [];
  const publishedAnnouncements = Array.isArray(announcements) ? announcements : [];

  const loadNotifications = useCallback(async () => {
    const notificationRes = await api.get("/notifications");
    setNotifications(Array.isArray(notificationRes.data.data) ? notificationRes.data.data : []);
  }, []);

  const loadSupportTickets = useCallback(async () => {
    const supportRes = await api.get("/support");
    setSupportTickets(Array.isArray(supportRes.data.data) ? supportRes.data.data : []);
  }, []);

  const loadAnnouncements = useCallback(async () => {
    const announcementRes = await api.get("/announcements/public", { headers: { Authorization: undefined } });
    setAnnouncements(Array.isArray(announcementRes.data.data) ? announcementRes.data.data : []);
  }, []);

  useEffect(() => {
    loadComplaints().then((items) => {
      if (!selectedComplaintId && Array.isArray(items) && items.length > 0) {
        setSelectedComplaintId(String(items[0].id));
      }
    });
    loadNotifications();
    loadSupportTickets();
    loadAnnouncements();
  }, [loadAnnouncements, loadComplaints, loadNotifications, loadSupportTickets]);

  useNotifications(
    user?.email,
    useCallback((item) => setNotifications((prev) => [item, ...prev]), [])
  );

  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = complaintQuery.trim().toLowerCase();
    if (!searchText) return true;
    return [complaint.complaintNumber, complaint.title, complaint.crimeType, complaint.status]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(searchText));
  });

  const selectedComplaint =
    complaints.find((item) => item.id === Number(selectedComplaintId)) ||
    filteredComplaints[0] ||
    complaints[0] ||
    null;

  const openComplaints = complaints.filter((item) => !["RESOLVED", "CLOSED"].includes(item.status));
  const resolvedComplaints = complaints.filter((item) => ["RESOLVED", "CLOSED"].includes(item.status));
  const unreadNotifications = notificationList.filter((item) => !item.read);

  const links = [
    { href: "#overview", label: "Overview", description: "Personal case snapshot" },
    { href: "#reporting", label: "Reporting", description: "File and enrich complaints" },
    { href: "#tracker", label: "Case Tracker", description: "Timeline, notes, and evidence" },
    { href: "#support", label: "Support", description: "Notifications, tickets, and feedback" }
  ];

  return (
    <AppShell
      title="Citizen Dashboard"
      subtitle="Manage complaints, upload supporting proof, follow every case update, and reach support without leaving your workflow."
      links={links}
      actions={[
        { label: "Go to report page", to: "/report-crime", variant: "primary" },
        { label: "Home", to: "/", variant: "secondary" }
      ]}
    >
      <section id="overview" className="scroll-mt-24">
        <StatsCards
          cards={[
            { label: "My complaints", value: complaints.length, helper: "Submitted cyber incidents linked to your account" },
            { label: "Open cases", value: openComplaints.length, helper: "Still under review or investigation" },
            { label: "Resolved", value: resolvedComplaints.length, helper: "Ready for closure feedback" },
            { label: "Unread notifications", value: unreadNotifications.length, helper: "Live updates waiting for your attention" }
          ]}
        />

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Current focus</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Complaint activity summary</h2>
              </div>
              {selectedComplaint && <StatusBadge value={selectedComplaint.status} />}
            </div>
            {selectedComplaint ? (
              <div className="mt-6 space-y-5">
                <div className="rounded-[1.75rem] bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">{selectedComplaint.complaintNumber}</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">{selectedComplaint.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{selectedComplaint.description}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Crime type</p>
                    <p className="mt-2 font-semibold text-slate-900">{selectedComplaint.crimeType}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Assigned officer</p>
                    <p className="mt-2 font-semibold text-slate-900">{selectedComplaint.assignedOfficerName || "Pending assignment"}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Incident date</p>
                    <p className="mt-2 font-semibold text-slate-900">{formatDate(selectedComplaint.incidentDate)}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Priority</p>
                    <div className="mt-2">
                      <StatusBadge value={selectedComplaint.priorityLevel} />
                    </div>
                  </div>
                </div>
                {selectedComplaint.resolutionSummary && (
                  <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm font-medium text-emerald-800">Resolution summary</p>
                    <p className="mt-2 text-sm leading-6 text-emerald-900">{selectedComplaint.resolutionSummary}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-500">No complaints submitted yet. Use the reporting section below to file your first incident.</p>
            )}
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Public safety alerts</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Latest announcements</h2>
              <div className="mt-5 space-y-3">
                {publishedAnnouncements.length === 0 && <p className="text-sm text-slate-500">No active announcements.</p>}
                {publishedAnnouncements.slice(0, 3).map((item) => (
                  <div key={item.id} className="rounded-3xl bg-slate-50 p-4">
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-700">What to do next</p>
              <div className="mt-5 space-y-3">
                {[
                  "Keep timelines factual and consistent when officers request clarifications.",
                  "Upload screenshots, receipts, and links as soon as new proof becomes available.",
                  "Review unread notifications so evidence requests do not stall the investigation."
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

      <section id="reporting" className="mt-10 scroll-mt-24">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Reporting desk</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Create a complaint and attach supporting evidence</h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <ComplaintForm
            onSubmit={async (payload) => {
              await api.post("/complaints/create", payload);
              const items = await loadComplaints();
              await loadNotifications();
              if (Array.isArray(items) && items.length > 0) {
                setSelectedComplaintId(String(items[0].id));
              }
            }}
          />
          <div className="space-y-6">
            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Evidence upload</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">Attach files to an existing complaint</h3>
              <div className="mt-5 space-y-4">
                <select
                  className="input"
                  value={selectedComplaint?.id || ""}
                  onChange={(event) => setSelectedComplaintId(event.target.value)}
                >
                  <option value="">Select complaint</option>
                  {complaints.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.complaintNumber} - {item.title}
                    </option>
                  ))}
                </select>
                <input
                  className="input"
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.mp4"
                  onChange={(event) => setEvidenceFiles(Array.from(event.target.files || []))}
                />
                {evidenceMessage && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{evidenceMessage}</p>}
                <button
                  className="btn-primary"
                  type="button"
                  disabled={!selectedComplaint || evidenceFiles.length === 0}
                  onClick={async () => {
                    const formData = new FormData();
                    formData.append("complaintId", selectedComplaint.id);
                    evidenceFiles.forEach((file) => formData.append("files", file));
                    await api.post("/evidence/upload", formData);
                    setEvidenceFiles([]);
                    setEvidenceMessage("Evidence uploaded successfully.");
                    await loadComplaints();
                  }}
                >
                  Upload Evidence
                </button>
              </div>
            </div>

            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Accepted file types</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {["JPG", "PNG", "PDF", "DOC", "DOCX", "MP4"].map((type) => (
                  <span key={type} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                    {type}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-600">
                If your officer requests more proof, return here or use the case tracker section to keep the complaint updated.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="tracker" className="mt-10 scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Case tracker</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Follow timelines, notes, and evidence inventory</h2>
          </div>
          <input
            className="input max-w-md"
            placeholder="Search by complaint number, title, type, or status"
            value={complaintQuery}
            onChange={(event) => setComplaintQuery(event.target.value)}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <ComplaintTable
            complaints={filteredComplaints}
            title="My complaints"
            caption="Open a complaint to inspect status history, evidence, and officer notes."
            emptyMessage="No complaints match your search."
            selectedId={selectedComplaint?.id}
            onSelect={(complaint) => setSelectedComplaintId(String(complaint.id))}
          />
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Selected case</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-900">
                    {selectedComplaint ? selectedComplaint.complaintNumber : "Choose a complaint"}
                  </h3>
                </div>
                {selectedComplaint && <StatusBadge value={selectedComplaint.status} />}
              </div>
              {selectedComplaint ? (
                <div className="mt-5 space-y-4">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Suspect reference</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{selectedComplaint.suspectReference || "Not provided"}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Incident location</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{selectedComplaint.incidentLocation || "Not provided"}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Contact details</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{selectedComplaint.contactDetails || "Not provided"}</p>
                  </div>
                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-500">Select a complaint from the table to inspect it in detail.</p>
              )}
            </div>

            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Status timeline</p>
              <div className="mt-5 space-y-4">
                {(selectedComplaint?.timeline || []).map((entry, index) => (
                  <div key={`${entry.status}-${index}`} className="flex gap-4">
                    <div className="mt-1 h-3 w-3 rounded-full bg-brand-500" />
                    <div className="flex-1 rounded-3xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <StatusBadge value={entry.status} />
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{formatDate(entry.createdAt)}</p>
                      </div>
                      <p className="mt-3 text-sm font-medium text-slate-900">{entry.updatedBy || "System update"}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{entry.remarks || "No remarks added."}</p>
                    </div>
                  </div>
                ))}
                {(!selectedComplaint?.timeline || selectedComplaint.timeline.length === 0) && (
                  <p className="text-sm text-slate-500">Status history will appear here once the complaint starts moving.</p>
                )}
              </div>
            </div>

            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Officer notes and evidence</p>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-slate-900">Visible notes</h4>
                  <div className="mt-3 space-y-3">
                    {(selectedComplaint?.notes || []).filter((note) => note.visibleToCitizen).map((note) => (
                      <div key={note.id} className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-900">{note.officerName || "Officer"}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">{formatDate(note.createdAt)}</p>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{note.note}</p>
                      </div>
                    ))}
                    {(!(selectedComplaint?.notes || []).filter((note) => note.visibleToCitizen).length) && (
                      <p className="text-sm text-slate-500">No citizen-visible notes yet.</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Evidence inventory</h4>
                  <div className="mt-3 space-y-3">
                    {(selectedComplaint?.evidenceFiles || []).map((file) => (
                      <div key={file.id} className="rounded-3xl border border-slate-200 p-4">
                        <p className="font-medium text-slate-900">{file.originalName}</p>
                        <p className="mt-2 text-sm text-slate-500">{file.contentType || "Stored evidence file"}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">
                          {file.fileSize ? `${Math.round(file.fileSize / 1024)} KB` : "Size unavailable"}
                        </p>
                      </div>
                    ))}
                    {(!selectedComplaint?.evidenceFiles || selectedComplaint.evidenceFiles.length === 0) && (
                      <p className="text-sm text-slate-500">No evidence files uploaded for this complaint yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="support" className="mt-10 scroll-mt-24">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Support and follow-up</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Stay informed, raise support tickets, and close the loop with feedback</h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <NotificationList
            notifications={notificationList}
            onMarkRead={async (id) => {
              await api.patch(`/notifications/${id}/read`);
              setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
            }}
            onMarkAllRead={async () => {
              const unreadItems = notificationList.filter((item) => !item.read);
              await Promise.all(unreadItems.map((item) => api.patch(`/notifications/${item.id}/read`)));
              setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
            }}
            title="Case notifications"
          />
          <div className="space-y-6">
            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Support tickets</p>
              <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
                <form
                  className="space-y-4"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    await api.post("/support", supportForm);
                    setSupportForm({ subject: "", message: "" });
                    setSupportMessage("Support ticket created successfully.");
                    await loadSupportTickets();
                  }}
                >
                  <input
                    className="input"
                    placeholder="Ticket subject"
                    value={supportForm.subject}
                    onChange={(event) => setSupportForm((prev) => ({ ...prev, subject: event.target.value }))}
                  />
                  <textarea
                    className="input min-h-32"
                    placeholder="Describe the issue you need help with"
                    value={supportForm.message}
                    onChange={(event) => setSupportForm((prev) => ({ ...prev, message: event.target.value }))}
                  />
                  {supportMessage && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{supportMessage}</p>}
                  <button className="btn-primary" type="submit">Submit Ticket</button>
                </form>
                <div>
                  <h3 className="font-semibold text-slate-900">Recent tickets</h3>
                  <div className="mt-3 space-y-3">
                    {ticketList.map((ticket) => (
                      <div key={ticket.id} className="rounded-3xl border border-slate-200 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-medium text-slate-900">{ticket.subject}</p>
                          <StatusBadge value={ticket.status} />
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{ticket.message}</p>
                        <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-400">{formatDate(ticket.updatedAt || ticket.createdAt)}</p>
                      </div>
                    ))}
                    {ticketList.length === 0 && <p className="text-sm text-slate-500">You have not opened any support tickets yet.</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Closure feedback</p>
              <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                  Once a case is resolved or closed, you can rate the investigation experience and share what worked well or what felt unclear.
                </div>
                <form
                  className="space-y-4"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    await api.post(`/feedback/${feedbackForm.complaintId}`, {
                      rating: Number(feedbackForm.rating),
                      satisfactionScore: Number(feedbackForm.satisfactionScore),
                      comment: feedbackForm.comment
                    });
                    setFeedbackForm({ complaintId: "", rating: 5, satisfactionScore: 5, comment: "" });
                    setFeedbackMessage("Feedback submitted successfully.");
                  }}
                >
                  <select
                    className="input"
                    value={feedbackForm.complaintId}
                    onChange={(event) => setFeedbackForm((prev) => ({ ...prev, complaintId: event.target.value }))}
                  >
                    <option value="">Select resolved complaint</option>
                    {resolvedComplaints.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.complaintNumber} - {item.title}
                      </option>
                    ))}
                  </select>
                  <div className="grid gap-4 md:grid-cols-2">
                    <select
                      className="input"
                      value={feedbackForm.rating}
                      onChange={(event) => setFeedbackForm((prev) => ({ ...prev, rating: event.target.value }))}
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>Rating: {value}</option>
                      ))}
                    </select>
                    <select
                      className="input"
                      value={feedbackForm.satisfactionScore}
                      onChange={(event) => setFeedbackForm((prev) => ({ ...prev, satisfactionScore: event.target.value }))}
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>Satisfaction: {value}</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    className="input min-h-28"
                    placeholder="Share your experience"
                    value={feedbackForm.comment}
                    onChange={(event) => setFeedbackForm((prev) => ({ ...prev, comment: event.target.value }))}
                  />
                  {feedbackMessage && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedbackMessage}</p>}
                  <button className="btn-primary" type="submit" disabled={!feedbackForm.complaintId}>
                    Submit Feedback
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

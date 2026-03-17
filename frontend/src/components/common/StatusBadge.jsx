import { formatEnumLabel } from "../../utils/formatters";

const statusColors = {
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-indigo-100 text-indigo-700",
  ASSIGNED_TO_OFFICER: "bg-cyan-100 text-cyan-700",
  INVESTIGATION_STARTED: "bg-amber-100 text-amber-700",
  EVIDENCE_REQUESTED: "bg-orange-100 text-orange-700",
  INVESTIGATION_ONGOING: "bg-purple-100 text-purple-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-slate-200 text-slate-700",
  OPEN: "bg-sky-100 text-sky-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  ACTIVE: "bg-emerald-100 text-emerald-700",
  INACTIVE: "bg-slate-200 text-slate-700",
  SUSPENDED: "bg-red-100 text-red-700",
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-700",
  ROLE_ADMIN: "bg-slate-900 text-white",
  ROLE_OFFICER: "bg-cyan-100 text-cyan-800",
  ROLE_CITIZEN: "bg-brand-100 text-brand-700",
  CITIZEN: "bg-brand-100 text-brand-700",
  OFFICER: "bg-cyan-100 text-cyan-800",
  ADMIN: "bg-slate-900 text-white",
  COMPLAINT_SUBMITTED: "bg-blue-100 text-blue-700",
  CASE_ASSIGNED: "bg-cyan-100 text-cyan-700",
  CASE_STATUS_UPDATED: "bg-emerald-100 text-emerald-700",
  INVESTIGATION_UPDATED: "bg-purple-100 text-purple-700",
  SUPPORT_UPDATE: "bg-amber-100 text-amber-700",
  SYSTEM: "bg-slate-100 text-slate-700"
};

export default function StatusBadge({ value }) {
  return (
    <span className={`badge ${statusColors[value] || "bg-slate-100 text-slate-700"}`}>
      {formatEnumLabel(value)}
    </span>
  );
}

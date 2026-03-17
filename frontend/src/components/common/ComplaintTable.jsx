import StatusBadge from "./StatusBadge";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
}

export default function ComplaintTable({
  complaints,
  title = "Complaint Queue",
  caption = "Reported complaints and assigned workflow.",
  emptyMessage = "No complaints available.",
  selectedId,
  onSelect
}) {
  const complaintList = Array.isArray(complaints) ? complaints : [];

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{caption}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Complaint No</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Reported</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Citizen</th>
              <th className="px-4 py-3">Officer</th>
              {onSelect && <th className="px-4 py-3 text-right">Action</th>}
            </tr>
          </thead>
          <tbody>
            {complaintList.map((complaint) => (
              <tr
                key={complaint.id}
                className={`border-t border-slate-100 ${selectedId === complaint.id ? "bg-brand-50/60" : "bg-white"}`}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{complaint.complaintNumber}</p>
                  <p className="mt-1 max-w-xs truncate text-xs text-slate-500">{complaint.title}</p>
                </td>
                <td className="px-4 py-3">{complaint.crimeType}</td>
                <td className="px-4 py-3">{formatDate(complaint.createdAt || complaint.incidentDate)}</td>
                <td className="px-4 py-3">
                  <StatusBadge value={complaint.priorityLevel} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge value={complaint.status} />
                </td>
                <td className="px-4 py-3">{complaint.citizenName || "-"}</td>
                <td className="px-4 py-3">{complaint.assignedOfficerName || "-"}</td>
                {onSelect && (
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="text-sm font-medium text-brand-700 transition hover:text-brand-900"
                      onClick={() => onSelect(complaint)}
                    >
                      Open
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {complaintList.length === 0 && (
              <tr className="border-t border-slate-100">
                <td className="px-4 py-6 text-slate-500" colSpan={onSelect ? "8" : "7"}>{emptyMessage}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

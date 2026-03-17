import StatusBadge from "./StatusBadge";

function formatDate(value) {
  if (!value) return "Just now";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default function NotificationList({ notifications, onMarkRead, onMarkAllRead, title = "Notifications" }) {
  const items = Array.isArray(notifications) ? notifications : [];

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{items.length} items</span>
          {onMarkAllRead && items.some((item) => !item.read) && (
            <button
              type="button"
              className="text-sm font-medium text-brand-700 transition hover:text-brand-900"
              onClick={onMarkAllRead}
            >
              Mark all read
            </button>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {items.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-2xl border p-4 transition ${notification.read ? "border-slate-200 bg-white" : "border-brand-200 bg-brand-50/50"}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="font-medium text-slate-900">{notification.title}</h4>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">{formatDate(notification.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                {!notification.read && <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />}
                <StatusBadge value={notification.type} />
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-600">{notification.message}</p>
            {onMarkRead && !notification.read && (
              <button
                type="button"
                className="mt-4 text-sm font-medium text-brand-700 transition hover:text-brand-900"
                onClick={() => onMarkRead(notification.id)}
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">No notifications yet.</p>}
      </div>
    </div>
  );
}

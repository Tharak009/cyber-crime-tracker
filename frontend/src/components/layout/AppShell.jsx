import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { dashboardRouteForRole, formatEnumLabel } from "../../utils/formatters";

function ActionButton({ action }) {
  const baseClassName = action.variant === "secondary" ? "btn-secondary" : "btn-primary";

  if (action.to) {
    return (
      <Link className={baseClassName} to={action.to}>
        {action.label}
      </Link>
    );
  }

  if (action.href) {
    return (
      <a className={baseClassName} href={action.href} target={action.target} rel={action.rel}>
        {action.label}
      </a>
    );
  }

  return (
    <button className={baseClassName} type="button" onClick={action.onClick}>
      {action.label}
    </button>
  );
}

function SidebarItem({ link }) {
  if (link.href) {
    return (
      <a
        href={link.href}
        className="block rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        <span className="block font-medium text-white">{link.label}</span>
        {link.description && <span className="mt-1 block text-xs text-slate-400">{link.description}</span>}
      </a>
    );
  }

  return (
    <NavLink
      to={link.to}
      className={({ isActive }) =>
        `block rounded-2xl px-4 py-3 text-sm transition ${isActive ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`
      }
    >
      <span className="block font-medium">{link.label}</span>
      {link.description && <span className="mt-1 block text-xs text-slate-300/80">{link.description}</span>}
    </NavLink>
  );
}

export default function AppShell({
  title,
  subtitle,
  eyebrow = "Dashboard",
  links = [],
  actions = [],
  children
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dashboardHome = dashboardRouteForRole(user?.role);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,143,105,0.10),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_48%,#e2e8f0_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden w-80 flex-col rounded-[2rem] bg-slateX p-6 text-white lg:flex">
          <Link to="/" className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-center gap-4">
              <img src="/logo-mark.svg" alt="Cyber Crime Tracker" className="h-14 w-14 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-100">Cyber Crime</p>
                <p className="mt-1 text-xl font-semibold leading-tight text-white">Tracker</p>
              </div>
            </div>
            <span className="mt-4 block text-sm font-normal leading-6 text-slate-300">Secure reporting, case tracking, evidence flow, and officer coordination.</span>
          </Link>
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Workspace</p>
          </div>
          <nav className="space-y-2">
            {links.map((link) => (
              <SidebarItem key={link.to || link.href || link.label} link={link} />
            ))}
          </nav>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Active session</p>
            <p className="mt-3 font-semibold text-white">{user?.fullName}</p>
            <p className="mt-1 break-all text-slate-300">{user?.email}</p>
            <p className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
              {formatEnumLabel(user?.role || "USER")}
            </p>
            <div className="mt-5 grid gap-2">
              <Link className="rounded-2xl border border-white/15 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10" to={dashboardHome}>
                Dashboard Home
              </Link>
              <Link className="rounded-2xl border border-white/15 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10" to="/profile">
                My Profile
              </Link>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="mt-5 w-full rounded-2xl bg-white px-4 py-3 font-medium text-slate-900 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
          <div className="mt-auto rounded-3xl border border-brand-500/30 bg-brand-500/15 p-5 text-sm text-slate-200">
            <p className="font-semibold text-white">Operational note</p>
            <p className="mt-2 text-slate-300">
              Use the sections in this sidebar to move between oversight, case activity, support work, and communications without leaving the dashboard.
            </p>
          </div>
        </aside>
        <main className="flex-1">
          <header className="card mb-6 overflow-hidden">
            <div className="grid gap-6 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(15,118,110,0.88))] p-6 text-white lg:grid-cols-[1.3fr_0.7fr] lg:p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-brand-100">{eyebrow}</p>
                <h1 className="mt-4 text-3xl font-semibold leading-tight lg:text-4xl">{title}</h1>
                {subtitle && <p className="mt-4 max-w-2xl text-sm text-slate-200 lg:text-base">{subtitle}</p>}
              </div>
              <div className="grid gap-3 self-start sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Today</p>
                  <p className="mt-3 text-lg font-semibold">
                    {new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(new Date())}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Focus</p>
                  <p className="mt-3 text-sm leading-6 text-slate-100">
                    Keep reports actionable, evidence complete, and status updates visible to the right audience.
                  </p>
                </div>
              </div>
            </div>
          </header>

          {links.length > 0 && (
            <div className="mb-6 flex gap-3 overflow-x-auto rounded-3xl border border-slate-200 bg-white p-3 shadow-panel lg:hidden">
              {links.map((link) =>
                link.href ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="whitespace-nowrap rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    {link.label}
                  </a>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-medium ${isActive ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-700"}`
                    }
                  >
                    {link.label}
                  </NavLink>
                )
              )}
            </div>
          )}

          {actions.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-3">
              {actions.map((action) => (
                <ActionButton key={action.label} action={action} />
              ))}
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}

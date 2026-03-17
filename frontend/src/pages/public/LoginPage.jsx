import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="card overflow-hidden">
          <div className="h-full bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(14,143,105,0.88))] p-8 text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-100">Secure access</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">Sign in to continue tracking complaints, investigations, and system updates.</h1>
            <div className="mt-8 space-y-4">
              {[
                "Citizens track status, upload evidence, and receive notifications.",
                "Officers manage assigned investigations, notes, and evidence requests.",
                "Admins oversee operations, assignments, alerts, and reports."
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-white/10 p-4 text-sm leading-6 text-slate-100">
                  {item}
                </div>
              ))}
            </div>
            <Link className="btn-secondary mt-8 border-white/20 bg-white/10 text-white hover:bg-white/20" to="/">
              Back to home
            </Link>
          </div>
        </section>

        <form
          className="card p-8"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              const result = await login(form);
              if (result.role === "ROLE_ADMIN") navigate("/admin");
              else if (result.role === "ROLE_OFFICER") navigate("/officer");
              else navigate("/citizen");
            } catch (err) {
              setError(err.response?.data?.message || "Login failed");
            }
          }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Login</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">Use your registered account to access the right dashboard for your role.</p>
          {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
          <div className="mt-6 space-y-4">
            <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <div className="flex gap-3">
              <input
                className="input"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button className="btn-secondary" type="button" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button className="btn-primary w-full" type="submit">Login</button>
          </div>
          <div className="mt-8 rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            Need an account first? Citizens can self-register here. Officer and admin access should be issued through system administration.
          </div>
          <p className="mt-4 text-sm text-slate-500">
            New user? <Link to="/register" className="text-brand-700">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

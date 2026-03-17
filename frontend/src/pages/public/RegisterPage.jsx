import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "ROLE_CITIZEN"
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="card overflow-hidden">
          <div className="h-full bg-[linear-gradient(135deg,rgba(14,143,105,0.92),rgba(15,23,42,0.95))] p-8 text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-100">Create access</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">Start with a secure account so every case update stays attached to the right person.</h1>
            <div className="mt-8 space-y-4">
              {[
                "Citizens use this account to report complaints, upload evidence, and rate resolved cases.",
                "Officers can sign in to manage assigned investigations and publish case notes.",
                "Email verification and stronger password rules help reduce misuse."
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
            setError("");
            setMessage("");
            try {
              await register(form);
              setMessage("Registration successful. Use the verification token sent by email through the backend mail provider.");
              setTimeout(() => navigate("/login"), 1200);
            } catch (err) {
              setError(err.response?.data?.message || "Registration failed");
            }
          }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-brand-700">Registration</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Create your account</h2>
          {message && <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
          {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input className="input md:col-span-2" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
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
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Public sign-up creates a citizen account. Officer and admin accounts are managed separately by the system.
            </div>
            <button className="btn-primary md:col-span-2" type="submit">Create Account</button>
          </div>
          <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-brand-700">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

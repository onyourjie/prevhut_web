import { showErrorAlert, Toast } from "@/lib/swal";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import { AuthHeroCarousel } from "@/components/auth/auth-hero-carousel";
import { useAuthStore } from "@/store/auth.store";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!form.identifier.trim()) {
      const msg = "Email atau username wajib diisi.";
      setErrorMessage(msg);
      showErrorAlert("Validasi Gagal", msg);
      return;
    }
    if (!form.password) {
      const msg = "Kata sandi wajib diisi.";
      setErrorMessage(msg);
      showErrorAlert("Validasi Gagal", msg);
      return;
    }

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: form.identifier.trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = Array.isArray(data.message) ? data.message.join(", ") : data.message;
        throw new Error(msg || "Email, username, atau kata sandi tidak valid");
      }

      setAuth(data.user, data.access_token);
      setSuccessMessage(`Selamat datang kembali, ${data.user.name}!`);

      Toast.fire({
        icon: "success",
        title: `Selamat datang kembali, ${data.user.name}!`,
      });

      setTimeout(() => {
        navigate({ to: "/" });
      }, 800);
    } catch (err: any) {
      const msg = err.message || "Terjadi kesalahan saat masuk. Silakan periksa kembali kredensial Anda.";
      setErrorMessage(msg);
      showErrorAlert("Gagal Masuk", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-900">
      {/* Left panel: Hero Carousel with public/assets/auth */}
      <AuthHeroCarousel />

      {/* Right panel: Modern Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-8 sm:py-12 overflow-y-auto">
        <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200/80 shadow-lg shadow-black/5 p-6 sm:p-10">
          {/* Header without icon box */}
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-1">
              FIREZONE PLATFORM
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-1000">
              Masuk ke Akun
            </h1>
          </div>

          <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
            Pantau kondisi kebakaran lahan sekitar dan tetap terhubung dengan relawan & posko se-Pulau Kalimantan.
          </p>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-error-50 border border-error-200 text-error-800 text-sm">
              <AlertCircle className="w-5 h-5 text-error-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or Username */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                Email atau Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Contoh: sarahwijiyatno atau email"
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-neutral-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 transition bg-white"
                />
              </div>
            </div>

            {/* Kata Sandi */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Kata Sandi
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Silakan hubungi posko untuk bantuan akses akun Anda.");
                  }}
                  className="text-xs font-medium text-brand-700 hover:text-brand-800 hover:underline"
                >
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi akun"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full pl-10 pr-11 py-2.5 sm:py-3 border border-neutral-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 transition bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-xs text-neutral-600">Ingat sesi saya</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition duration-150 shadow-md shadow-brand-600/25 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-sm text-neutral-600">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-brand-700 hover:text-brand-800 font-bold hover:underline"
              >
                Daftar di sini
              </Link>
            </p>
            <p className="text-xs text-neutral-400">
              © 2026 FIREZONE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

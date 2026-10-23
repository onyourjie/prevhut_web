import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  User,
  Mail,
  AtSign,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Check,
  Shield,
  Home,
  ShieldAlert,
  ArrowRight,
  ChevronLeft,
  ChevronDown,
  Loader2,
  Crosshair,
} from "lucide-react";
import { AuthHeroCarousel } from "@/components/auth/auth-hero-carousel";
import { useAuthStore } from "@/store/auth.store";
import { showSuccessAlert, showErrorAlert } from "@/lib/swal";
import { KALIMANTAN_PROVINCES } from "@/lib/kalimantan-locations";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

const PASSWORD_RULES = [
  { key: "len", label: "Minimal 8 karakter", test: (p: string) => p.length >= 8 },
  {
    key: "case",
    label: "Huruf besar & huruf kecil",
    test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  },
  { key: "num", label: "Mengandung angka (0-9)", test: (p: string) => /\d/.test(p) },
  {
    key: "sym",
    label: "Karakter unik/simbol (!@#$%^&*...)",
    test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
  },
];

function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  // Stepper: 1 (Kenalan), 2 (Kata Sandi), 3 (Peran), 4 (Lokasi Domisili), 5 (Welcoming)
  const [step, setStep] = useState<number>(1);

  // Form State
  const [form, setForm] = useState({
    name: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "WARGA" as "WARGA" | "RELAWAN",
    province: "Kalimantan Barat",
    kabupaten: "Kabupaten Sintang",
    kecamatan: "Kecamatan Sintang",
    latitude: -0.0712,
    longitude: 111.4981,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);

  // Cascading location options
  const selectedProvinceData = useMemo(() => {
    return KALIMANTAN_PROVINCES.find((p) => p.name === form.province) || KALIMANTAN_PROVINCES[0];
  }, [form.province]);

  const availableRegencies = useMemo(() => {
    return selectedProvinceData.regencies;
  }, [selectedProvinceData]);

  const selectedRegencyData = useMemo(() => {
    return (
      availableRegencies.find((r) => r.name === form.kabupaten) || availableRegencies[0] || null
    );
  }, [availableRegencies, form.kabupaten]);

  const availableDistricts = useMemo(() => {
    return selectedRegencyData ? selectedRegencyData.districts : [];
  }, [selectedRegencyData]);

  // Handle province change: reset regency and district
  const handleProvinceChange = (provName: string) => {
    const prov = KALIMANTAN_PROVINCES.find((p) => p.name === provName) || KALIMANTAN_PROVINCES[0];
    const firstReg = prov.regencies[0];
    setForm((prev) => ({
      ...prev,
      province: prov.name,
      kabupaten: firstReg ? firstReg.name : "",
      kecamatan: firstReg && firstReg.districts[0] ? firstReg.districts[0] : "",
    }));
  };

  // Handle regency change: reset district
  const handleRegencyChange = (regName: string) => {
    const reg = availableRegencies.find((r) => r.name === regName);
    setForm((prev) => ({
      ...prev,
      kabupaten: regName,
      kecamatan: reg && reg.districts[0] ? reg.districts[0] : "",
    }));
  };

  // Password validity
  const isPasswordValid = useMemo(() => {
    return PASSWORD_RULES.every((r) => r.test(form.password));
  }, [form.password]);

  const isPasswordMatch = form.password && form.password === form.confirmPassword;

  // Step 1 Validation -> Next
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showErrorAlert("Nama Belum Diisi", "Silakan masukkan nama lengkap Anda.");
      return;
    }
    if (!form.username.trim() || form.username.length < 3) {
      showErrorAlert("Username Tidak Valid", "Username minimal 3 karakter (huruf, angka, underscore).");
      return;
    }
    const cleanedPhone = form.phone.replace(/[\s-]/g, "");
    const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{7,11}$/;
    if (!cleanedPhone) {
      showErrorAlert("Nomor Telepon Belum Diisi", "Silakan masukkan nomor telepon aktif Anda.");
      return;
    }
    if (!phoneRegex.test(cleanedPhone)) {
      showErrorAlert(
        "Nomor Telepon Tidak Valid",
        "Masukkan nomor seluler Indonesia yang valid (contoh: 081234567890 atau +6281234567890)."
      );
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!form.email.trim()) {
      showErrorAlert("Email Belum Diisi", "Silakan masukkan alamat email aktif Anda.");
      return;
    }
    if (!emailRegex.test(form.email.trim())) {
      showErrorAlert(
        "Format Email Tidak Valid",
        "Masukkan alamat email yang valid dengan domain lengkap (contoh: nama@email.com, .id, atau .go.id)."
      );
      return;
    }
    setStep(2);
  };

  // Step 2 Validation -> Next
  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      showErrorAlert(
        "Kata Sandi Belum Aman",
        "Kata sandi wajib minimal 8 karakter dengan kombinasi huruf besar, kecil, angka, dan karakter unik/simbol."
      );
      return;
    }
    if (!isPasswordMatch) {
      showErrorAlert("Kata Sandi Tidak Cocok", "Konfirmasi kata sandi tidak sama dengan kata sandi yang Anda buat.");
      return;
    }
    setStep(3);
  };

  // Step 3 Validation -> Next
  const handleNextStep3 = () => {
    setStep(4);
  };

  // Auto detect GPS
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      showErrorAlert("GPS Tidak Didukung", "Browser Anda tidak mendukung deteksi lokasi otomatis.");
      return;
    }

    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingGps(false);
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
        showSuccessAlert(
          "Lokasi Terdeteksi",
          `Koordinat perangkat berhasil disematkan (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}).`
        );
      },
      () => {
        setDetectingGps(false);
        showErrorAlert(
          "Gagal Mendeteksi Lokasi",
          "Izin lokasi perangkat ditolak atau tidak tersedia. Anda tetap dapat memilih domisili secara manual dari daftar."
        );
      },
      { timeout: 10000 }
    );
  };

  // Step 4 Final Submit -> Register API -> Step 5 Welcoming
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agree) {
      showErrorAlert("Persetujuan Diperlukan", "Harap centang persetujuan Syarat & Ketentuan serta Kebijakan Privasi.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          username: form.username.toLowerCase().trim(),
          phone: form.phone.trim(),
          email: form.email.toLowerCase().trim(),
          password: form.password,
          role: form.role,
          province: form.province,
          kabupaten: form.kabupaten,
          kecamatan: form.kecamatan,
          latitude: form.latitude,
          longitude: form.longitude,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = Array.isArray(data.message) ? data.message.join(", ") : data.message;
        throw new Error(msg || "Gagal melakukan pendaftaran akun.");
      }

      setAuth(data.user, data.access_token);
      // Pindah ke step 5: Welcoming Screen!
      setStep(5);
    } catch (err: any) {
      showErrorAlert("Pendaftaran Gagal", err.message || "Terjadi kesalahan pada server saat mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-900">
      {/* Left panel: Hero Carousel with public/assets/auth */}
      <AuthHeroCarousel />

      {/* Right panel: Multi-Step Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-8 sm:py-12 overflow-y-auto">
        <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-200/80 shadow-xl shadow-black/5 p-6 sm:p-9 relative">
          
          {/* Stepper Progress Indicator (Steps 1 to 4) */}
          {step <= 4 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                    className="flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-brand-700 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Kembali</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                    FIREZONE ONBOARDING
                  </span>
                )}
                <span className="text-xs font-semibold text-neutral-400 font-mono">
                  Langkah {step} dari 4
                </span>
              </div>

              {/* 4 Segmented Progress Bars */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i <= step ? "bg-accent-900" : "bg-neutral-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 1: Kenalan dulu, yuk! ================= */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-extrabold text-neutral-1000 tracking-tight">
                  Kenalan dulu, yuk!
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                  Isi data dirimu untuk mulai menggunakan FIREZONE.
                </p>
              </div>

              <form onSubmit={handleNextStep1} className="space-y-3.5">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nama
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Masukkan nama kamu"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 transition"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Contoh: sarahwijiyatno"
                      value={form.username}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                        })
                      }
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 transition font-mono"
                    />
                  </div>
                </div>

                {/* Nomor Telepon */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nomor Telepon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="tel"
                      placeholder="081234567890 atau +62 812-3456-7890"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 transition"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Bisa diawali 08 atau +62 (10-13 digit nomor seluler)
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      placeholder="nama@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 transition"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Gunakan email aktif (Gmail, Yahoo, instansi .go.id, dll)
                  </p>
                </div>

                {/* Tombol Selanjutnya */}
                <button
                  type="submit"
                  className="w-full mt-4 bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-white font-bold py-3 rounded-xl transition shadow-md shadow-brand-700/25 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <span>Selanjutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <p className="text-center text-xs text-neutral-500 mt-5">
                Sudah punya akun?{" "}
                <Link to="/login" className="text-brand-700 hover:text-brand-800 font-bold hover:underline">
                  Masuk
                </Link>
              </p>
            </div>
          )}

          {/* ================= STEP 2: Buat kata sandi ================= */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-extrabold text-neutral-1000 tracking-tight">
                  Buat kata sandi
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                  Gunakan kata sandi ini untuk masuk ke akun FIREZONE.
                </p>
              </div>

              <form onSubmit={handleNextStep2} className="space-y-4">
                {/* Kata Sandi */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Kata sandi
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan kata sandi"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      className="w-full pl-10 pr-11 py-2.5 border border-neutral-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Kriteria Sandi */}
                  {form.password && (
                    <div className="mt-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                      <p className="text-[11px] font-semibold text-neutral-600 mb-1.5">
                        Kriteria Keamanan Kata Sandi:
                      </p>
                      <ul className="grid grid-cols-1 gap-1.5">
                        {PASSWORD_RULES.map((rule) => {
                          const ok = rule.test(form.password);
                          return (
                            <li
                              key={rule.key}
                              className={`flex items-center gap-2 text-xs ${
                                ok ? "text-emerald-700 font-medium" : "text-neutral-500"
                              }`}
                            >
                              <span
                                className={`flex items-center justify-center w-3.5 h-3.5 rounded-full ${
                                  ok ? "bg-emerald-600 text-white" : "bg-neutral-200 text-neutral-400"
                                }`}
                              >
                                {ok && <Check className="w-2.5 h-2.5" />}
                              </span>
                              <span>{rule.label}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Konfirmasi Kata Sandi */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Konfirmasi kata sandi
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Ulangi kata sandi Anda"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      required
                      className="w-full pl-10 pr-11 py-2.5 border border-neutral-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Tombol Selanjutnya */}
                <button
                  type="submit"
                  className="w-full mt-4 bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-white font-bold py-3 rounded-xl transition shadow-md shadow-brand-700/25 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <span>Selanjutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* ================= STEP 3: Apa peran kamu? ================= */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-extrabold text-neutral-1000 tracking-tight">
                  Apa peran kamu?
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                  Kami akan menyesuaikan informasi dengan peran yang kamu pilih.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {/* Card Warga */}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "WARGA" })}
                  className={`w-full flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition ${
                    form.role === "WARGA"
                      ? "border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      form.role === "WARGA"
                        ? "bg-brand-700 text-white"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900">Warga</h3>
                    <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                      Pantau kondisi sekitar dan berbagi informasi.
                    </p>
                  </div>
                </button>

                {/* Card Relawan */}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "RELAWAN" })}
                  className={`w-full flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition ${
                    form.role === "RELAWAN"
                      ? "border-accent-700 bg-accent-50/70 ring-2 ring-accent-600/20"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      form.role === "RELAWAN"
                        ? "bg-accent-800 text-white"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900">Relawan</h3>
                    <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                      Pantau kondisi sekitar dan terima pembaruan prioritas.
                    </p>
                  </div>
                </button>
              </div>

              {/* Otoritas Note */}
              <div className="mb-6 flex items-start gap-2.5 p-3 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-600">
                <ShieldAlert className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Akses Otoritas:</strong> Akun Admin Posko (BPBD) dikelola secara internal oleh instansi dan tidak dibuka untuk pendaftaran publik.
                </span>
              </div>

              {/* Tombol Selanjutnya */}
              <button
                type="button"
                onClick={handleNextStep3}
                className="w-full bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-white font-bold py-3 rounded-xl transition shadow-md shadow-brand-700/25 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Selanjutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= STEP 4: Di mana kamu tinggal? ================= */}
          {step === 4 && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-extrabold text-neutral-1000 tracking-tight">
                  Di mana kamu tinggal?
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                  Domisili digunakan saat lokasi perangkat tidak ditemukan.
                </p>
              </div>

              <form onSubmit={handleFinalSubmit} className="space-y-3.5">
                {/* Dropdown Provinsi (5 Provinsi Kalimantan) */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                    Provinsi (Pulau Kalimantan)
                  </label>
                  <div className="relative">
                    <select
                      value={form.province}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className="w-full appearance-none h-12 pl-4 pr-11 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 shadow-xs transition-all duration-150 hover:border-neutral-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/15 focus:outline-none cursor-pointer"
                    >
                      {KALIMANTAN_PROVINCES.map((prov) => (
                        <option key={prov.name} value={prov.name}>
                          {prov.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-neutral-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Dropdown Kabupaten/Kota */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                    Kabupaten / Kota
                  </label>
                  <div className="relative">
                    <select
                      value={form.kabupaten}
                      onChange={(e) => handleRegencyChange(e.target.value)}
                      className="w-full appearance-none h-12 pl-4 pr-11 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 shadow-xs transition-all duration-150 hover:border-neutral-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/15 focus:outline-none cursor-pointer"
                    >
                      {availableRegencies.map((reg) => (
                        <option key={reg.name} value={reg.name}>
                          {reg.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-neutral-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Dropdown Kecamatan */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                    Kecamatan
                  </label>
                  <div className="relative">
                    <select
                      value={form.kecamatan}
                      onChange={(e) => setForm({ ...form, kecamatan: e.target.value })}
                      className="w-full appearance-none h-12 pl-4 pr-11 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 shadow-xs transition-all duration-150 hover:border-neutral-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/15 focus:outline-none cursor-pointer"
                    >
                      {availableDistricts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-neutral-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Divider ATAU */}
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-neutral-200" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    ATAU
                  </span>
                  <div className="flex-1 h-px bg-neutral-200" />
                </div>

                {/* Tombol Gunakan Lokasi GPS Saat Ini */}
                <button
                  type="button"
                  onClick={handleDetectGps}
                  disabled={detectingGps}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 border-accent-300 bg-accent-50/60 hover:bg-accent-50 text-left transition"
                >
                  <div className="w-9 h-9 rounded-xl bg-accent-800 text-white flex items-center justify-center shrink-0">
                    {detectingGps ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Crosshair className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-neutral-900">
                      Gunakan lokasi saya saat ini
                    </h4>
                    <p className="text-[11px] text-neutral-600">
                      Isi koordinat secara otomatis berdasarkan sensor perangkat.
                    </p>
                  </div>
                </button>

                {/* Persetujuan Checkbox */}
                <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-300 text-brand-700 focus:ring-brand-500"
                  />
                  <span className="text-[11px] text-neutral-600 leading-relaxed">
                    Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi data kebencanaan se-Pulau Kalimantan.
                  </span>
                </label>

                {/* Tombol Submit Final */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-white font-bold py-3 rounded-xl transition shadow-md shadow-brand-700/25 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mendaftarkan akun...</span>
                    </>
                  ) : (
                    <>
                      <span>Selesaikan Pendaftaran</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ================= STEP 5: Welcoming Screen ================= */}
          {step === 5 && (
            <div className="text-center py-6 sm:py-8">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-5">
                Akun Berhasil Dibuat
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-1000 tracking-tight mb-2">
                Selamat datang, {form.name.split(" ")[0]}!
              </h2>

              <p className="text-sm text-neutral-600 max-w-xs mx-auto leading-relaxed mb-8">
                Mulai pantau sekitar dan terhubung dengan komunitas di {form.kabupaten || "Kalimantan"}, yuk!
              </p>

              <div>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/" })}
                  className="w-full bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-brand-700/30 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <span>Buka Beranda</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

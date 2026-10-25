import { useState, useMemo } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { showErrorAlert, showSuccessAlert } from '@/lib/swal'
import { KALIMANTAN_PROVINCES } from '@/lib/kalimantan-locations'
import { PASSWORD_RULES, type RegisterFormState } from './register.types'

export function useRegisterForm() {
  const setAuth = useAuthStore((s) => s.setAuth)

  // Stepper: 1 (Kenalan), 2 (Kata Sandi), 3 (Peran), 4 (Lokasi Domisili), 5 (Welcoming)
  const [step, setStep] = useState<number>(1)

  // Form State
  const [form, setForm] = useState<RegisterFormState>({
    name: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'WARGA',
    province: 'Kalimantan Barat',
    kabupaten: 'Kabupaten Sintang',
    kecamatan: 'Kecamatan Sintang',
    latitude: -0.0712,
    longitude: 111.4981,
  })

  const [agree, setAgree] = useState(true)
  const [loading, setLoading] = useState(false)
  const [detectingGps, setDetectingGps] = useState(false)

  // Helper to update form fields
  const updateForm = (fields: Partial<RegisterFormState>) => {
    setForm((prev) => ({ ...prev, ...fields }))
  }

  // Cascading location options
  const selectedProvinceData = useMemo(() => {
    return KALIMANTAN_PROVINCES.find((p) => p.name === form.province) || KALIMANTAN_PROVINCES[0]
  }, [form.province])

  const availableRegencies = useMemo(() => {
    return selectedProvinceData.regencies
  }, [selectedProvinceData])

  const selectedRegencyData = useMemo(() => {
    return (
      availableRegencies.find((r) => r.name === form.kabupaten) || availableRegencies[0] || null
    )
  }, [availableRegencies, form.kabupaten])

  const availableDistricts = useMemo(() => {
    return selectedRegencyData ? selectedRegencyData.districts : []
  }, [selectedRegencyData])

  // Handle province change: reset regency and district
  const handleProvinceChange = (provName: string) => {
    const prov = KALIMANTAN_PROVINCES.find((p) => p.name === provName) || KALIMANTAN_PROVINCES[0]
    const firstReg = prov.regencies[0]
    setForm((prev) => ({
      ...prev,
      province: prov.name,
      kabupaten: firstReg ? firstReg.name : '',
      kecamatan: firstReg && firstReg.districts[0] ? firstReg.districts[0] : '',
    }))
  }

  // Handle regency change: reset district
  const handleRegencyChange = (regName: string) => {
    const reg = availableRegencies.find((r) => r.name === regName)
    setForm((prev) => ({
      ...prev,
      kabupaten: regName,
      kecamatan: reg && reg.districts[0] ? reg.districts[0] : '',
    }))
  }

  const handleDistrictChange = (kecName: string) => {
    setForm((prev) => ({
      ...prev,
      kecamatan: kecName,
    }))
  }

  // Password validity
  const isPasswordValid = useMemo(() => {
    return PASSWORD_RULES.every((r) => r.test(form.password))
  }, [form.password])

  const isPasswordMatch = Boolean(form.password && form.password === form.confirmPassword)

  // Step 1 Validation -> Next
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      showErrorAlert('Nama Belum Diisi', 'Silakan masukkan nama lengkap Anda.')
      return
    }
    if (!form.username.trim() || form.username.length < 3) {
      showErrorAlert('Username Tidak Valid', 'Username minimal 3 karakter (huruf, angka, underscore).')
      return
    }
    const cleanedPhone = form.phone.replace(/[\s-]/g, '')
    const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{7,11}$/
    if (!cleanedPhone) {
      showErrorAlert('Nomor Telepon Belum Diisi', 'Silakan masukkan nomor telepon aktif Anda.')
      return
    }
    if (!phoneRegex.test(cleanedPhone)) {
      showErrorAlert(
        'Nomor Telepon Tidak Valid',
        'Masukkan nomor seluler Indonesia yang valid (contoh: 081234567890 atau +6281234567890).'
      )
      return
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!form.email.trim()) {
      showErrorAlert('Email Belum Diisi', 'Silakan masukkan alamat email aktif Anda.')
      return
    }
    if (!emailRegex.test(form.email.trim())) {
      showErrorAlert(
        'Format Email Tidak Valid',
        'Masukkan alamat email yang valid dengan domain lengkap (contoh: nama@email.com, .id, atau .go.id).'
      )
      return
    }
    setStep(2)
  }

  // Step 2 Validation -> Next
  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPasswordValid) {
      showErrorAlert(
        'Kata Sandi Belum Aman',
        'Kata sandi wajib minimal 8 karakter dengan kombinasi huruf besar, kecil, angka, dan karakter unik/simbol.'
      )
      return
    }
    if (!isPasswordMatch) {
      showErrorAlert('Kata Sandi Tidak Cocok', 'Konfirmasi kata sandi tidak sama dengan kata sandi yang Anda buat.')
      return
    }
    setStep(3)
  }

  // Step 3 Validation -> Next
  const handleNextStep3 = () => {
    setStep(4)
  }

  // Auto detect GPS
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      showErrorAlert('GPS Tidak Didukung', 'Browser Anda tidak mendukung deteksi lokasi otomatis.')
      return
    }

    setDetectingGps(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingGps(false)
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }))
        showSuccessAlert(
          'Lokasi Terdeteksi',
          `Koordinat perangkat berhasil disematkan (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}).`
        )
      },
      () => {
        setDetectingGps(false)
        showErrorAlert(
          'Gagal Mendeteksi Lokasi',
          'Izin lokasi perangkat ditolak atau tidak tersedia. Anda tetap dapat memilih domisili secara manual dari daftar.'
        )
      },
      { timeout: 10000 }
    )
  }

  // Step 4 Final Submit -> Register API -> Step 5 Welcoming
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agree) {
      showErrorAlert('Persetujuan Diperlukan', 'Harap centang persetujuan Syarat & Ketentuan serta Kebijakan Privasi.')
      return
    }

    setLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      })

      const data = await res.json()

      if (!res.ok) {
        const msg = Array.isArray(data.message) ? data.message.join(', ') : data.message
        throw new Error(msg || 'Gagal melakukan pendaftaran akun.')
      }

      setAuth(data.user, data.access_token)
      setStep(5)
    } catch (err: any) {
      showErrorAlert('Pendaftaran Gagal', err.message || 'Terjadi kesalahan pada server saat mendaftar.')
    } finally {
      setLoading(false)
    }
  }

  return {
    step,
    setStep,
    form,
    updateForm,
    agree,
    setAgree,
    loading,
    detectingGps,
    availableRegencies,
    availableDistricts,
    handleProvinceChange,
    handleRegencyChange,
    handleDistrictChange,
    handleNextStep1,
    handleNextStep2,
    handleNextStep3,
    handleDetectGps,
    handleFinalSubmit,
  }
}

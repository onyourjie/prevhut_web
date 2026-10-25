export interface RegisterFormState {
  name: string
  username: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  role: 'WARGA' | 'RELAWAN'
  province: string
  kabupaten: string
  kecamatan: string
  latitude?: number
  longitude?: number
}

export interface PasswordRule {
  label: string
  test: (p: string) => boolean
}

export const PASSWORD_RULES: PasswordRule[] = [
  { label: 'Minimal 8 karakter', test: (p) => p.length >= 8 },
  { label: 'Mengandung huruf besar (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { label: 'Mengandung huruf kecil (a-z)', test: (p) => /[a-z]/.test(p) },
  { label: 'Mengandung angka (0-9)', test: (p) => /[0-9]/.test(p) },
]

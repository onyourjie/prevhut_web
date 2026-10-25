import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { AuthHeroCarousel } from '@/components/auth/auth-hero-carousel'
import { RegisterStep1Personal } from '@/components/auth/RegisterStep1Personal'
import { RegisterStep2Password } from '@/components/auth/RegisterStep2Password'
import { RegisterStep3Role } from '@/components/auth/RegisterStep3Role'
import { RegisterStep4Location } from '@/components/auth/RegisterStep4Location'
import { RegisterStep5Welcome } from '@/components/auth/RegisterStep5Welcome'
import { useRegisterForm } from '@/components/auth/useRegisterForm'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const {
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
  } = useRegisterForm()

  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-900">
      {/* Left panel: Hero Carousel with public/assets/auth */}
      <AuthHeroCarousel />

      {/* Right panel: Multi-Step Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-8 sm:py-12 overflow-y-auto">
        <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-200/80 shadow-xl shadow-black/5 p-6 sm:p-9 relative">
          {/* Header & Back Action */}
          <div className="mb-6 flex items-center justify-between">
            {step > 1 && step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate({ to: '/login' })}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Masuk Akun
              </button>
            )}

            {step < 5 && (
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      step === i
                        ? 'w-6 bg-amber-500'
                        : step > i
                        ? 'w-2 bg-emerald-500'
                        : 'w-2 bg-neutral-200'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Step 1: Data Diri */}
          {step === 1 && (
            <RegisterStep1Personal
              form={form}
              onChange={updateForm}
              onSubmit={handleNextStep1}
            />
          )}

          {/* Step 2: Kata Sandi */}
          {step === 2 && (
            <RegisterStep2Password
              form={form}
              onChange={updateForm}
              onSubmit={handleNextStep2}
            />
          )}

          {/* Step 3: Peran */}
          {step === 3 && (
            <RegisterStep3Role
              form={form}
              onChange={updateForm}
              onNext={handleNextStep3}
            />
          )}

          {/* Step 4: Lokasi Domisili & Submit */}
          {step === 4 && (
            <RegisterStep4Location
              form={form}
              agree={agree}
              loading={loading}
              detectingGps={detectingGps}
              availableRegencies={availableRegencies}
              availableDistricts={availableDistricts}
              onProvinceChange={handleProvinceChange}
              onRegencyChange={handleRegencyChange}
              onDistrictChange={handleDistrictChange}
              onAgreeChange={setAgree}
              onDetectGps={handleDetectGps}
              onSubmit={handleFinalSubmit}
            />
          )}

          {/* Step 5: Welcoming Screen */}
          {step === 5 && (
            <RegisterStep5Welcome
              name={form.name}
              kabupaten={form.kabupaten}
              onComplete={() => {
                if (form.role === 'RELAWAN') {
                  navigate({ to: '/assignments' })
                } else {
                  navigate({ to: '/' })
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

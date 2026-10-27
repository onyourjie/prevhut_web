import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'
import { apiRequest } from '@/lib/api'
import { showSuccessToast, showErrorToast, showSuccessAlert } from '@/lib/swal'
import { uploadImageToCloudinary } from '@/lib/cloudinary'
import type { Assignment, AssignmentStatus } from './assignment.types'
import type { VolunteerItem } from './VolunteerDirectoryPanel'
import type { AssignmentTabId } from './AssignmentTabs'

export function useVolunteerAssignments() {
  const { user, isAuthenticated, updateUser } = useAuthStore()
  const navigate = useNavigate()

  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<AssignmentTabId>('active')
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)

  // Availability state
  const [isAvailable, setIsAvailable] = useState<boolean>(user?.isAvailable ?? true)
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false)

  // Modal States
  const [rejectingTask, setRejectingTask] = useState<Assignment | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isSubmittingReject, setIsSubmittingReject] = useState(false)

  const [verifyingTask, setVerifyingTask] = useState<Assignment | null>(null)
  const [verificationPhoto, setVerificationPhoto] = useState<string>('')
  const [verificationLat, setVerificationLat] = useState<number | null>(null)
  const [verificationLon, setVerificationLon] = useState<number | null>(null)
  const [isDetectingGps, setIsDetectingGps] = useState(false)
  const [completionNotes, setCompletionNotes] = useState('')
  const [isSubmittingVerify, setIsSubmittingVerify] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)

  // TanStack Query untuk daftar penugasan (deduplikasi & caching instan)
  const {
    data: assignments = [],
    isLoading,
    refetch: fetchAssignments,
  } = useQuery<Assignment[]>({
    queryKey: ['assignments-list', user?.role],
    queryFn: async () => {
      const endpoint = user?.role === 'ADMIN' ? '/assignments' : '/assignments/my-tasks'
      const res = await apiRequest(endpoint)
      return res || []
    },
    enabled: isAuthenticated,
  })

  // TanStack Query untuk direktori relawan (khusus admin)
  const {
    data: volunteers = [],
    isLoading: isLoadingVolunteers,
    refetch: fetchVolunteers,
  } = useQuery<VolunteerItem[]>({
    queryKey: ['volunteers-list'],
    queryFn: async () => {
      const res = await apiRequest<VolunteerItem[]>('/users/volunteers')
      return res || []
    },
    enabled: isAuthenticated && user?.role === 'ADMIN',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, navigate])

  // Toggle Availability
  const handleToggleAvailability = async () => {
    const nextVal = !isAvailable
    setIsTogglingAvailability(true)
    try {
      await apiRequest('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable: nextVal }),
      })
      setIsAvailable(nextVal)
      updateUser({ isAvailable: nextVal })
      showSuccessToast(
        nextVal
          ? 'Status: Siap Siaga Bertugas (Available)'
          : 'Status: Sedang Istirahat / Off Duty'
      )
    } catch {
      showErrorToast('Gagal memperbarui status kesiapan')
    } finally {
      setIsTogglingAvailability(false)
    }
  }

  // Update Status Machine
  const handleUpdateStatus = async (taskId: string, nextStatus: AssignmentStatus) => {
    try {
      setUpdatingTaskId(taskId)
      await apiRequest(`/assignments/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      })

      const labelMap: Record<string, string> = {
        ACCEPTED: 'Tugas Diterima',
        ON_THE_WAY: 'Menuju Lokasi',
        ON_SITE: 'Tiba di Lokasi Lapangan',
        COMPLETED: 'Tugas Selesai',
      }

      showSuccessToast(`Status penugasan diperbarui: ${labelMap[nextStatus] || nextStatus}`)
      await fetchAssignments()
      queryClient.invalidateQueries({ queryKey: ['my-active-tasks'] })
    } catch (err: any) {
      showErrorToast(err.message || 'Gagal memperbarui status')
    } finally {
      setUpdatingTaskId(null)
    }
  }

  // Handle Reject
  const handleSubmitReject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectingTask || !rejectionReason.trim()) {
      showErrorToast('Mohon cantumkan alasan penolakan penugasan')
      return
    }

    try {
      setIsSubmittingReject(true)
      await apiRequest(`/assignments/${rejectingTask.id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ rejectionReason: rejectionReason.trim() }),
      })
      showSuccessAlert(
        'Penugasan Ditolak',
        'Alasan penolakan Anda telah dicatat dan Admin Posko BPBD telah dinotifikasi untuk mengalihkan penugasan.'
      )
      setRejectingTask(null)
      setRejectionReason('')
      await fetchAssignments()
    } catch (err: any) {
      showErrorToast(err.message || 'Gagal menolak tugas')
    } finally {
      setIsSubmittingReject(false)
    }
  }

  // Handle Verify & Complete
  const handleSubmitVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verifyingTask) return
    if (!verificationPhoto) {
      showErrorToast('Harap unggah foto bukti verifikasi pemadaman')
      return
    }

    if (
      verificationLat == null || verificationLon == null ||
      !Number.isFinite(verificationLat) || !Number.isFinite(verificationLon) ||
      Math.abs(verificationLat) > 90 || Math.abs(verificationLon) > 180
    ) {
      showErrorToast('Deteksi GPS atau masukkan koordinat verifikasi yang valid terlebih dahulu')
      return
    }

    try {
      setIsSubmittingVerify(true)
      await apiRequest(`/assignments/${verifyingTask.id}/verify`, {
        method: 'POST',
        body: JSON.stringify({
          verificationPhoto,
          verificationGpsLat: verificationLat,
          verificationGpsLon: verificationLon,
          completionNotes: completionNotes.trim() || undefined,
        }),
      })

      showSuccessAlert(
        'Verifikasi Berhasil Disimpan!',
        'Laporan verifikasi lapangan & bukti foto pemadaman telah diterima posko BPBD. Penugasan dinyatakan selesai.'
      )
      setVerifyingTask(null)
      setVerificationPhoto('')
      setCompletionNotes('')
      await fetchAssignments()
    } catch (err: any) {
      showErrorToast(err.message || 'Gagal memverifikasi tugas')
    } finally {
      setIsSubmittingVerify(false)
    }
  }

  // GPS Acquisition
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      showErrorToast('Geolocation tidak didukung pada browser ini')
      return
    }
    setIsDetectingGps(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setVerificationLat(Number(pos.coords.latitude.toFixed(5)))
        setVerificationLon(Number(pos.coords.longitude.toFixed(5)))
        setIsDetectingGps(false)
        showSuccessToast('Koordinat GPS lapangan berhasil diperbarui!')
      },
      (err) => {
        setIsDetectingGps(false)
        showErrorToast('Gagal mendeteksi GPS lapangan: ' + err.message)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Upload photo
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploadingPhoto(true)
      const url = await uploadImageToCloudinary(file, 'firezone_verifications')
      setVerificationPhoto(url)
      showSuccessToast('Foto bukti verifikasi berhasil diunggah!')
    } catch {
      showErrorToast('Gagal mengunggah foto, silakan coba lagi')
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  // Filtering
  const activeAssignments = assignments.filter((a) =>
    ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ON_SITE'].includes(a.status)
  )
  const completedAssignments = assignments.filter((a) => a.status === 'COMPLETED')
  const rejectedAssignments = assignments.filter((a) => a.status === 'REJECTED')

  const displayedAssignments =
    activeTab === 'active'
      ? activeAssignments
      : activeTab === 'completed'
      ? completedAssignments
      : activeTab === 'rejected'
      ? rejectedAssignments
      : assignments

  return {
    assignments,
    isLoading,
    activeTab,
    setActiveTab,
    updatingTaskId,
    isAvailable,
    isTogglingAvailability,
    handleToggleAvailability,
    handleUpdateStatus,
    rejectingTask,
    setRejectingTask,
    rejectionReason,
    setRejectionReason,
    isSubmittingReject,
    handleSubmitReject,
    verifyingTask,
    setVerifyingTask,
    verificationPhoto,
    setVerificationPhoto,
    verificationLat,
    setVerificationLat,
    verificationLon,
    setVerificationLon,
    isDetectingGps,
    completionNotes,
    setCompletionNotes,
    isSubmittingVerify,
    isUploadingPhoto,
    handleSubmitVerify,
    handleDetectGps,
    handlePhotoUpload,
    fetchAssignments,
    activeAssignments,
    completedAssignments,
    rejectedAssignments,
    displayedAssignments,
    volunteers,
    isLoadingVolunteers,
    fetchVolunteers,
  }
}

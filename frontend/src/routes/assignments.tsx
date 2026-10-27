import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Flame, UserPlus } from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { AssignmentStatsGrid } from '@/components/assignments/AssignmentStatsGrid'
import { AssignmentCard, type AssignmentLightboxData } from '@/components/assignments/AssignmentCard'
import { MediaLightboxModal } from '@/components/community/media-lightbox-modal'
import { RejectTaskModal } from '@/components/assignments/RejectTaskModal'
import { VerifyTaskModal } from '@/components/assignments/VerifyTaskModal'
import { CreateAssignmentModal } from '@/components/assignments/CreateAssignmentModal'
import { AssignmentTabs } from '@/components/assignments/AssignmentTabs'
import {
  VolunteerDirectoryPanel,
  type VolunteerItem,
} from '@/components/assignments/VolunteerDirectoryPanel'
import { useVolunteerAssignments } from '@/components/assignments/useVolunteerAssignments'
import { useAuthStore } from '@/store/auth.store'

export const Route = createFileRoute('/assignments')({
  component: VolunteerAssignmentsPage,
})

function VolunteerAssignmentsPage() {
  const { user, isAuthenticated, hasHydrated } = useAuthStore()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    if (hasHydrated) {
      if (!isAuthenticated) {
        navigate({ to: '/login' })
      } else if (user?.role === 'WARGA') {
        navigate({ to: '/' })
      }
    }
  }, [hasHydrated, isAuthenticated, user, navigate])

  // Modal assign states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [targetVolunteer, setTargetVolunteer] = useState<VolunteerItem | null>(null)
  const [lightboxData, setLightboxData] = useState<AssignmentLightboxData | null>(null)

  const {
    assignments,
    isLoading,
    activeTab,
    setActiveTab,
    updatingTaskId,
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
  } = useVolunteerAssignments()

  const handleOpenAssign = (volunteer: VolunteerItem) => {
    setTargetVolunteer(volunteer)
    setIsCreateModalOpen(true)
  }

  const handleAssignmentCreated = () => {
    fetchAssignments()
    if (isAdmin) {
      fetchVolunteers()
    }
    setActiveTab('active')
  }

  if (!isAuthenticated || user?.role === 'WARGA') {
    return null
  }

  return (
    <AppLayout title="Penugasan Relawan">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">


        {/* Stats Grid */}
        <AssignmentStatsGrid
          activeCount={activeAssignments.length}
          completedCount={completedAssignments.length}
          rejectedCount={rejectedAssignments.length}
          totalCount={assignments.length}
        />

        {/* Status Tabs Navigation */}
        <div className="pt-2">
          <AssignmentTabs
            activeTab={activeTab}
            counts={{
              active: activeAssignments.length,
              volunteers: volunteers.length,
              all: assignments.length,
              completed: completedAssignments.length,
              rejected: rejectedAssignments.length,
            }}
            showVolunteersTab={isAdmin}
            onSelectTab={setActiveTab}
          />
        </div>

        {/* Content View: Tab Daftar Relawan vs Tab Daftar Tugas */}
        {isAdmin && activeTab === 'volunteers' ? (
          /* HANYA MUNCUL DI TAB DAFTAR RELAWAN (Dengan Fitur Search & Pagination 10) */
          <div className="space-y-4 animate-in fade-in duration-150">
            <VolunteerDirectoryPanel
              volunteers={volunteers}
              isLoading={isLoadingVolunteers}
              onAssignVolunteer={handleOpenAssign}
            />
          </div>
        ) : (
          /* TAB TUGAS LAINNYA (Tugas Aktif, Semua, Selesai, Ditolak): Bersih, fokus hanya daftar tugas tanpa side panel */
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200/80">
                <div className="inline-block w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm font-medium text-neutral-500">
                  Memuat penugasan lapangan...
                </p>
              </div>
            ) : displayedAssignments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-12 text-center shadow-xs">
                <div className="w-14 h-14 bg-neutral-100 text-neutral-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Flame className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-1">
                  Tidak Ada Tugas di Tab Ini
                </h3>
                <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-4">
                  {activeTab === 'active'
                    ? 'Saat ini belum ada penugasan karhutla yang sedang berjalan.'
                    : activeTab === 'completed'
                    ? 'Belum ada riwayat penugasan yang selesai diverifikasi.'
                    : activeTab === 'rejected'
                    ? 'Belum ada riwayat penugasan yang ditolak.'
                    : 'Belum ada penugasan.'}
                </p>
                {isAdmin && activeTab === 'active' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('volunteers')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition shadow-xs cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Buka Tab Daftar Relawan untuk Tugaskan</span>
                  </button>
                )}
              </div>
            ) : (
              displayedAssignments.map((task) => (
                <AssignmentCard
                  key={task.id}
                  task={task}
                  updatingTaskId={updatingTaskId}
                  onAccept={(id: string) => handleUpdateStatus(id, 'ACCEPTED')}
                  onStartTrip={(id: string) => handleUpdateStatus(id, 'ON_THE_WAY')}
                  onArrive={(id: string) => handleUpdateStatus(id, 'ON_SITE')}
                  onOpenReject={(t) => {
                    setRejectingTask(t)
                    setRejectionReason('')
                  }}
                  onOpenVerify={(t) => {
                    setVerifyingTask(t)
                    setVerificationPhoto('')
                    setCompletionNotes('')
                    setVerificationLat(t.post?.latitude ?? null)
                    setVerificationLon(t.post?.longitude ?? null)
                  }}
                  onOpenLightbox={setLightboxData}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* CREATE ASSIGNMENT MODAL (DIPICU DARI TOMBOL ASSIGN PADA LIST RELAWAN) */}
      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        targetVolunteer={targetVolunteer}
        volunteersList={volunteers}
        onClose={() => {
          setIsCreateModalOpen(false)
          setTargetVolunteer(null)
        }}
        onSuccess={handleAssignmentCreated}
      />

      {/* REJECT TASK MODAL */}
      <RejectTaskModal
        task={rejectingTask}
        reason={rejectionReason}
        isSubmitting={isSubmittingReject}
        onReasonChange={setRejectionReason}
        onClose={() => setRejectingTask(null)}
        onSubmit={handleSubmitReject}
      />

      {/* VERIFICATION MODAL */}
      <VerifyTaskModal
        task={verifyingTask}
        photo={verificationPhoto}
        lat={verificationLat}
        lon={verificationLon}
        notes={completionNotes}
        isUploading={isUploadingPhoto}
        isDetectingGps={isDetectingGps}
        isSubmitting={isSubmittingVerify}
        onPhotoChange={setVerificationPhoto}
        onLatChange={setVerificationLat}
        onLonChange={setVerificationLon}
        onNotesChange={setCompletionNotes}
        onDetectGps={handleDetectGps}
        onFileUpload={handlePhotoUpload}
        onClose={() => setVerifyingTask(null)}
        onSubmit={handleSubmitVerify}
      />

      {/* MEDIA LIGHTBOX MODAL */}
      {lightboxData && (
        <MediaLightboxModal
          isOpen={!!lightboxData}
          onClose={() => setLightboxData(null)}
          mediaUrl={lightboxData.url}
          category={lightboxData.category || 'DARURAT'}
          authorName={lightboxData.authorName}
          authorRole={lightboxData.authorRole}
          address={lightboxData.address}
          dateStr={lightboxData.dateStr}
          isLiveCamera={true}
        />
      )}
    </AppLayout>
  )
}

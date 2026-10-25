import React, { useState, useEffect, useRef } from 'react';
import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { ArrowLeft, MoreVertical, Flag, RefreshCw } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { FlagModal } from '@/components/community/flag-modal';
import { PostDetailMainCard } from '@/components/community/post-detail-main-card';
import { ResponseTrackingSection } from '@/components/community/response-tracking-section';
import { PostUpdatesSection } from '@/components/community/post-updates-section';
import { PostCommentsSection } from '@/components/community/post-comments-section';
import { PostCommentInputBar } from '@/components/community/post-comment-input-bar';
import { UpdateModal } from '@/components/community/update-modal';
import { MediaLightboxModal } from '@/components/community/media-lightbox-modal';
import { apiRequest } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { formatDateTimeIndo } from '@/lib/utils';
import { LiveCameraViewfinder } from '@/components/camera/live-camera-viewfinder';
import { uploadMediaToCloudinary } from '@/lib/cloudinary';
import { showSuccessToast, showErrorToast } from '@/lib/swal';

export const Route = createFileRoute('/community/$postId')({
  component: PostDetailPage,
});

function PostDetailPage() {
  const { postId } = useParams({ from: '/community/$postId' });
  const { user, isAuthenticated } = useAuthStore();

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showMenu, setShowMenu] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [lightboxMediaUrl, setLightboxMediaUrl] = useState<string | null>(null);

  // New Comment State
  const [commentText, setCommentText] = useState('');
  const [commentImage, setCommentImage] = useState('');
  const [commentMediaType, setCommentMediaType] = useState<'video' | 'image' | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const commentFileRef = useRef<HTMLInputElement>(null);

  const fetchPostDetail = async () => {
    try {
      setIsLoading(true);
      const data = await apiRequest(`/community/posts/${postId}`);
      setPost(data);
    } catch (err: any) {
      console.error('Failed to fetch post detail:', err);
      showErrorToast('Postingan tidak ditemukan atau telah dihapus');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  const handleCommentCameraCaptured = async (file: File) => {
    try {
      setIsUploadingMedia(true);
      const isVideo = file.type.startsWith('video/');
      setCommentMediaType(isVideo ? 'video' : 'image');
      const url = await uploadMediaToCloudinary(file, 'firezone_comments');
      setCommentImage(url);
      setCommentMediaType(null);
      setIsCameraOpen(false);
    } catch (err: any) {
      showErrorToast(err.message || 'Gagal mengunggah media kamera');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleCommentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingMedia(true);
      const isVideo = file.type.startsWith('video/');
      setCommentMediaType(isVideo ? 'video' : 'image');
      const url = await uploadMediaToCloudinary(file, 'firezone_comments');
      setCommentImage(url);
    } catch (err: any) {
      showErrorToast(err.message || 'Gagal memproses file komentar');
    } finally {
      setIsUploadingMedia(false);
      if (commentFileRef.current) commentFileRef.current.value = '';
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!isAuthenticated) {
      showErrorToast('Silakan masuk terlebih dahulu untuk mengirim komentar');
      return;
    }

    try {
      setIsSubmittingComment(true);
      await apiRequest(`/community/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          content: commentText.trim(),
          imageUrl: commentImage || undefined,
        }),
      });

      setCommentText('');
      setCommentImage('');
      showSuccessToast('Komentar berhasil dipublikasikan');
      fetchPostDetail();
    } catch (err: any) {
      showErrorToast(err.message || 'Gagal mengirim komentar');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout title="Detail Postingan">
        <div className="py-20 flex flex-col items-center justify-center text-neutral-400 gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-brand-600" />
          <span className="text-xs font-semibold">Memuat detail postingan...</span>
        </div>
      </AppLayout>
    );
  }

  if (!post) {
    return (
      <AppLayout title="Detail Postingan">
        <div className="py-16 text-center max-w-sm mx-auto">
          <h3 className="font-bold text-sm text-neutral-800 mb-2">
            Postingan Tidak Ditemukan
          </h3>
          <Link
            to="/community"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Komunitas</span>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const isAuthor = user?.id === post.authorId || user?.role === 'ADMIN';

  return (
    <AppLayout title="Detail Postingan" subtitle="Kabar dan verifikasi warga">
      <div className="max-w-2xl mx-auto space-y-4 pb-40 lg:pb-28 text-left">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/community"
            className="flex items-center gap-2 text-xs font-bold text-neutral-700 hover:text-neutral-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Detail Postingan</span>
          </Link>

          {/* More options menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
              aria-label="Opsi Postingan"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-neutral-200 py-1.5 z-30 animate-in fade-in zoom-in-95">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setShowFlagModal(true);
                    }}
                    className="flex items-center gap-2 w-full px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left transition"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Laporkan postingan</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Post Card */}
        <PostDetailMainCard
          post={post}
          onMediaClick={(url) => setLightboxMediaUrl(url)}
        />

        {/* SECTION: Lacak Progres Penanganan Transparan */}
        {post.category === 'DARURAT' ? (
          <ResponseTrackingSection
            post={post}
            onMediaClick={(url) => setLightboxMediaUrl(url)}
          />
        ) : (
          <div className="p-5 bg-white rounded-2xl border border-neutral-200 text-sm text-neutral-600">
            Informasi komunitas telah dipublikasikan.
          </div>
        )}

        {/* SECTION: Update Pengirim */}
        <PostUpdatesSection
          updates={post.updates}
          isAuthor={isAuthor}
          onAddUpdateClick={() => setShowUpdateModal(true)}
          onMediaClick={(url) => setLightboxMediaUrl(url)}
        />

        {/* SECTION: Komentar */}
        <PostCommentsSection
          comments={post.comments}
          onMediaClick={(url) => setLightboxMediaUrl(url)}
        />

        {/* Sticky Bottom Comment Input Bar */}
        <PostCommentInputBar
          commentText={commentText}
          setCommentText={setCommentText}
          commentImage={commentImage}
          setCommentImage={setCommentImage}
          commentMediaType={commentMediaType}
          setCommentMediaType={setCommentMediaType}
          isCameraOpen={isCameraOpen}
          setIsCameraOpen={setIsCameraOpen}
          isUploadingMedia={isUploadingMedia}
          isSubmittingComment={isSubmittingComment}
          onSendComment={handleSendComment}
          onCameraCaptured={handleCommentCameraCaptured}
          onFileChange={handleCommentImageUpload}
        />
      </div>

      {/* MODALS */}
      {showFlagModal && (
        <FlagModal postId={post.id} onClose={() => setShowFlagModal(false)} />
      )}

      {showUpdateModal && (
        <UpdateModal
          postId={post.id}
          onSuccess={fetchPostDetail}
          onClose={() => setShowUpdateModal(false)}
        />
      )}

      {/* Modal Kamera & Perekam Video Komentar */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-lg h-full sm:h-auto sm:max-h-[90vh] bg-black sm:rounded-3xl overflow-hidden relative shadow-2xl">
            <LiveCameraViewfinder
              onCapture={handleCommentCameraCaptured}
              onClose={() => setIsCameraOpen(false)}
              isUploading={isUploadingMedia}
            />
          </div>
        </div>
      )}

      {lightboxMediaUrl && (
        <MediaLightboxModal
          isOpen={!!lightboxMediaUrl}
          onClose={() => setLightboxMediaUrl(null)}
          mediaUrl={lightboxMediaUrl}
          category={post.category}
          authorName={post.author?.name}
          authorRole={post.author?.role}
          address={post.address}
          dateStr={formatDateTimeIndo(post.createdAt)}
          isLiveCamera={post.isLiveCamera}
        />
      )}
    </AppLayout>
  );
}

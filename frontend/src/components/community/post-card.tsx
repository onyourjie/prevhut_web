import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  MapPin,
  MessageSquare,
  AlertTriangle,
  Info,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { formatDateTimeIndo, cn } from '@/lib/utils'
import { FlagModal } from './flag-modal'
import { MediaLightboxModal } from './media-lightbox-modal'
import { PostCardHeader } from './post-card-header'
import { PostCardMedia } from './post-card-media'
import type { PostItem } from './post-card.types'

export * from './post-card.types'

export function PostCard({ post }: { post: PostItem }) {
  const [showFlagModal, setShowFlagModal] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)

  const isEmergency = post.category === 'DARURAT'
  const commentCount = post._count?.comments ?? 0
  const updateCount = post._count?.updates ?? post.updates?.length ?? 0

  return (
    <>
      <article
        className={cn(
          'bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col',
          isEmergency
            ? 'border-red-300 hover:border-red-400 ring-1 ring-red-400/20'
            : 'border-neutral-300 hover:border-neutral-400',
        )}
      >
        {/* Card Header: Author info & options */}
        <PostCardHeader
          author={post.author}
          createdAt={post.createdAt}
          onReportClick={() => setShowFlagModal(true)}
        />

        {/* Badges Bar: Category & Location */}
        <div className="px-4 sm:px-5 pb-2.5 flex items-center gap-2 flex-wrap text-xs">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-black text-xs border"
            style={
              isEmergency
                ? { backgroundColor: '#fee2e2', color: '#b91c1c', borderColor: '#fca5a5' }
                : { backgroundColor: '#ccfbf1', color: '#0f766e', borderColor: '#99f6e4' }
            }
          >
            {isEmergency ? (
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            ) : (
              <Info className="w-3.5 h-3.5 text-teal-700" />
            )}
            {isEmergency ? 'Darurat' : 'Informasi'}
          </span>

          {isEmergency && (
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border',
                post.status === 'SELESAI'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : post.status === 'DALAM_PENANGANAN'
                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                  : 'bg-amber-50 text-amber-800 border-amber-300',
              )}
            >
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  post.status === 'SELESAI'
                    ? 'bg-emerald-600'
                    : post.status === 'DALAM_PENANGANAN'
                    ? 'bg-blue-600 animate-pulse'
                    : 'bg-amber-500',
                )}
              />
              <span>
                {post.status === 'SELESAI'
                  ? 'Padam (Selesai)'
                  : post.status === 'DALAM_PENANGANAN'
                  ? 'Dalam Penanganan'
                  : 'Menunggu Verifikasi'}
              </span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 text-neutral-600 text-xs font-semibold truncate max-w-[280px]">
            <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span className="truncate">
              {[post.kecamatan, post.kabupaten, post.province].filter(Boolean).join(', ') || 'Kalimantan Barat'}
            </span>
          </span>
        </div>

        {/* Post Text Content */}
        <div className="px-4 sm:px-5 pb-3">
          <p className="text-sm text-neutral-800 leading-relaxed whitespace-pre-line font-medium">
            {post.content}
          </p>
        </div>

        {/* Post Media (Image or Video) with Full View Lightbox */}
        {post.imageUrl && (
          <PostCardMedia
            imageUrl={post.imageUrl}
            createdAt={post.createdAt}
            isLiveCamera={post.isLiveCamera}
            onImageClick={() => setShowLightbox(true)}
          />
        )}

        {/* Has updates alert snippet if present */}
        {updateCount > 0 && (
          <div
            className="mx-4 sm:mx-5 mb-3 p-2.5 rounded-xl border flex items-center justify-between text-xs"
            style={{ backgroundColor: '#fff7ed', borderColor: '#fdba74' }}
          >
            <div className="flex items-center gap-1.5 text-orange-950 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Ada {updateCount} perkembangan dari pengirim</span>
            </div>
            <Link
              to="/community/$postId"
              params={{ postId: post.id }}
              className="text-orange-700 font-extrabold hover:underline"
            >
              Lihat update
            </Link>
          </div>
        )}

        {/* Card Footer: Comment Count & Detail Button */}
        <div className="mt-auto px-4 sm:px-5 py-3 border-t border-neutral-100 bg-neutral-50/70 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-neutral-600 text-xs font-semibold">
            <MessageSquare className="w-4 h-4 text-neutral-400" />
            <span>{commentCount} komentar</span>
          </div>

          <Link
            to="/community/$postId"
            params={{ postId: post.id }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition shadow-xs hover:opacity-90 active:scale-95"
            style={{ backgroundColor: isEmergency ? '#eb5314' : '#262626' }}
          >
            <span>Lihat detail</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </Link>
        </div>
      </article>

      {/* Flag / Report Modal */}
      {showFlagModal && (
        <FlagModal
          postId={post.id}
          onClose={() => setShowFlagModal(false)}
        />
      )}

      {post.imageUrl && (
        <MediaLightboxModal
          isOpen={showLightbox}
          onClose={() => setShowLightbox(false)}
          mediaUrl={post.imageUrl}
          category={post.category}
          authorName={post.author?.name}
          authorRole={post.author?.role}
          address={post.address}
          dateStr={formatDateTimeIndo(post.createdAt)}
          isLiveCamera={post.isLiveCamera}
        />
      )}
    </>
  )
}

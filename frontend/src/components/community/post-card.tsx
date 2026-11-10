import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  MessageSquare,
  ArrowRight,
  Clock,
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
  const locationText =
    [post.kecamatan, post.kabupaten, post.province].filter(Boolean).join(', ') ||
    post.address ||
    'Kalimantan Barat'

  return (
    <>
      <article
        className={cn(
          'bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-sm flex flex-col',
          isEmergency
            ? 'border-l-4 border-l-red-500 border-slate-200/90 hover:border-slate-300'
            : 'border-l-4 border-l-brand-500 border-slate-200/90 hover:border-slate-300'
        )}
      >
        {/* Card Header: Author info, location, status tag, and options */}
        <PostCardHeader
          author={post.author}
          createdAt={post.createdAt}
          category={post.category}
          status={post.status}
          locationText={locationText}
          clusterCode={post.clusterCode}
          isClusterActive={post.isClusterActive}
          activeClusterCode={post.activeClusterCode}
          latitude={post.latitude}
          longitude={post.longitude}
          onReportClick={() => setShowFlagModal(true)}
        />

        {/* Post Text Content */}
        <Link
          to="/community/$postId"
          params={{ postId: post.id }}
          className="px-4 sm:px-5 pb-3 block group/content text-left"
        >
          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal group-hover/content:text-slate-900 transition">
            {post.content}
          </p>
        </Link>

        {/* Post Media (Image or Video) with Full View Lightbox */}
        {post.imageUrl && (
          <PostCardMedia
            imageUrl={post.imageUrl}
            createdAt={post.createdAt}
            isLiveCamera={post.isLiveCamera}
            onImageClick={() => setShowLightbox(true)}
          />
        )}

        {/* Progress / Activity timeline notice if updates exist */}
        {updateCount > 0 && (
          <div className="mx-4 sm:mx-5 mb-3 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span>
                Ada <strong className="font-bold text-slate-900">{updateCount} pembaruan</strong> situasi lapangan
              </span>
            </div>
            <Link
              to="/community/$postId"
              params={{ postId: post.id }}
              className="text-brand-700 font-bold hover:text-brand-800 transition shrink-0"
            >
              Lihat log &rarr;
            </Link>
          </div>
        )}

        {/* Seamless Social / Interaction Footer */}
        <div className="mt-auto px-4 sm:px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link
            to="/community/$postId"
            params={{ postId: post.id }}
            className="flex items-center gap-1.5 text-slate-500 hover:text-brand-700 font-medium transition"
          >
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>{commentCount} tanggapan</span>
          </Link>

          <Link
            to="/community/$postId"
            params={{ postId: post.id }}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-brand-700 transition"
          >
            <span>Buka Laporan</span>
            <ArrowRight className="w-3.5 h-3.5" />
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

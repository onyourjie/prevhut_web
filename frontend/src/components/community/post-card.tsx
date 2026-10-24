import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  MapPin,
  MessageSquare,
  AlertTriangle,
  Info,
  Camera,
  Video,
  MoreVertical,
  Flag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { formatTimeAgo, formatDateTimeIndo, cn } from '@/lib/utils';
import { FlagModal } from './flag-modal';
import { CommunityVideoPlayer } from './community-video-player';
import { MediaLightboxModal } from './media-lightbox-modal';

import { isVideoMedia } from '@/lib/cloudinary';

export interface PostAuthor {
  id: string;
  name: string;
  role: 'WARGA' | 'RELAWAN' | 'ADMIN';
  avatarUrl?: string | null;
  kabupaten?: string | null;
  kecamatan?: string | null;
}

export interface PostItem {
  id: string;
  category: 'DARURAT' | 'INFORMASI';
  content: string;
  imageUrl?: string | null;
  isLiveCamera?: boolean;
  address: string;
  province?: string;
  kabupaten?: string;
  kecamatan?: string;
  latitude: number;
  longitude: number;
  status: string;
  clusterCode?: string | null;
  createdAt: string;
  author: PostAuthor;
  updates?: any[];
  _count?: {
    comments: number;
    updates: number;
  };
}

export function PostCard({ post }: { post: PostItem }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const isEmergency = post.category === 'DARURAT';
  const commentCount = post._count?.comments ?? 0;
  const updateCount = post._count?.updates ?? post.updates?.length ?? 0;

  return (
    <>
      <article
        className={cn(
          'bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col',
          isEmergency
            ? 'border-red-300 hover:border-red-400 ring-1 ring-red-400/20'
            : 'border-neutral-300 hover:border-neutral-400'
        )}
      >
        {/* Card Header: Author info & options */}
        <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={
                post.author?.avatarUrl ||
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'
              }
              alt={post.author?.name || 'Warga'}
              className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm text-neutral-900 leading-tight">
                  {post.author?.name}
                </span>
                <span className="text-neutral-300">•</span>
                <span
                  className={cn(
                    'text-[11px] font-bold px-1.5 py-0.2 rounded border',
                    post.author?.role === 'ADMIN'
                      ? 'bg-neutral-900 text-amber-400 border-neutral-800'
                      : post.author?.role === 'RELAWAN'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-orange-100 text-orange-800 border-orange-300'
                  )}
                >
                  {post.author?.role === 'ADMIN'
                    ? 'Admin Posko'
                    : post.author?.role === 'RELAWAN'
                    ? 'Relawan'
                    : 'Warga'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {formatTimeAgo(post.createdAt)}
              </p>
            </div>
          </div>

          {/* Three dots dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition"
              aria-label="Opsi Postingan"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-neutral-200 py-1.5 z-30 animate-in fade-in zoom-in-95">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setShowFlagModal(true);
                    }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left transition"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Laporkan postingan</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Badges Bar: Category & Location (SOLID & HIGH CONTRAST) */}
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

          <span className="inline-flex items-center gap-1 text-neutral-600 text-xs font-semibold truncate max-w-[280px]">
            <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span className="truncate">
              {post.kecamatan ? `${post.kecamatan}, ` : ''}
              {post.kabupaten || 'Kalimantan Barat'}
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
          <div className="px-4 sm:px-5 pb-3">
            {isVideoMedia(post.imageUrl) ? (
              <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-black aspect-video sm:aspect-[16/10] flex items-center justify-center group">
                <CommunityVideoPlayer
                  src={post.imageUrl}
                  className="w-full h-full object-contain"
                />
                {post.isLiveCamera && (
                  <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md pointer-events-none z-10">
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      Video • {formatDateTimeIndo(post.createdAt)}
                    </span>
                  </div>
                )}
                
              </div>
            ) : (
              <div
                onClick={() => setShowLightbox(true)}
                className="block group relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-950 aspect-video sm:aspect-[16/10] flex items-center justify-center cursor-pointer"
                title="Ketuk untuk melihat foto ukuran penuh tanpa terpotong"
              >
                <img
                  src={post.imageUrl}
                  alt="Bukti kondisi lapangan"
                  className="w-full h-full object-contain group-hover:scale-102 transition duration-300"
                  loading="lazy"
                />
                {post.isLiveCamera && (
                  <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md pointer-events-none">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      Foto • {formatDateTimeIndo(post.createdAt)}
                    </span>
                  </div>
                )}
                
              </div>
            )}
          </div>
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
  );
}

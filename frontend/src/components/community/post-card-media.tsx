import { Camera, Video } from 'lucide-react'
import { formatDateTimeIndo } from '@/lib/utils'
import { isVideoMedia } from '@/lib/cloudinary'
import { CommunityVideoPlayer } from './community-video-player'

interface PostCardMediaProps {
  imageUrl: string
  createdAt: string
  isLiveCamera?: boolean
  onImageClick: () => void
}

export function PostCardMedia({
  imageUrl,
  createdAt,
  isLiveCamera,
  onImageClick,
}: PostCardMediaProps) {
  return (
    <div className="px-4 sm:px-5 pb-3">
      {isVideoMedia(imageUrl) ? (
        <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-black aspect-video sm:aspect-[16/10] flex items-center justify-center group">
          <CommunityVideoPlayer
            src={imageUrl}
            className="w-full h-full object-contain"
          />
          {isLiveCamera && (
            <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md pointer-events-none z-10">
              <Video className="w-3.5 h-3.5 text-amber-400" />
              <span>Video • {formatDateTimeIndo(createdAt)}</span>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={onImageClick}
          className="block group relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-950 aspect-video sm:aspect-[16/10] flex items-center justify-center cursor-pointer"
          title="Ketuk untuk melihat foto ukuran penuh tanpa terpotong"
        >
          <img
            src={imageUrl}
            alt="Bukti kondisi lapangan"
            className="w-full h-full object-contain group-hover:scale-102 transition duration-300"
            loading="lazy"
          />
          {isLiveCamera && (
            <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md pointer-events-none">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Foto • {formatDateTimeIndo(createdAt)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

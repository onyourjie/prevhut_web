import { MapPin, Edit3, Navigation, Camera } from 'lucide-react';

interface ProfileHeaderCardProps {
  currentUser: any;
  gpsActive: boolean;
  onEditClick: () => void;
}

export function ProfileHeaderCard({
  currentUser,
  gpsActive,
  onEditClick,
}: ProfileHeaderCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6 flex flex-col items-center text-center relative overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={onEditClick}
        className="absolute top-4 right-4 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-brand-500 text-neutral-600 hover:text-brand-600 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
      >
        <Edit3 className="w-3.5 h-3.5" />
        <span>Edit Profil</span>
      </button>

      <div className="relative mb-3 group cursor-pointer" onClick={onEditClick}>
        <img
          src={
            currentUser?.avatarUrl ||
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
          }
          alt={currentUser?.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-orange-500 shadow-md group-hover:scale-105 transition"
        />
        <div
          className="w-7 h-7 rounded-full text-white flex items-center justify-center absolute bottom-0 right-0 shadow-md border-2 border-white"
          style={{ backgroundColor: '#eb5314' }}
        >
          <Camera className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-lg font-extrabold text-neutral-900 leading-tight">
          {currentUser?.name || 'Sarah Wijiyatno'}
        </h2>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-orange-100 text-orange-800 border border-orange-300">
          {currentUser?.role || 'Warga'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-neutral-600 text-xs font-medium">
        <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span>
          {[
            currentUser?.kecamatan,
            currentUser?.kabupaten || 'Kabupaten Sintang',
            currentUser?.province || 'Kalimantan Barat',
          ]
            .filter(Boolean)
            .join(', ')}
        </span>
      </div>

      {/* Quick GPS Status Badge */}
      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] text-neutral-600 font-medium">
        <Navigation className={`w-3 h-3 ${gpsActive ? 'text-green-600' : 'text-neutral-400'}`} />
        <span>
          {gpsActive ? 'GPS Aktif' : 'GPS Nonaktif'}
          {currentUser?.latitude && currentUser?.longitude
            ? ` • (${currentUser.latitude.toFixed(3)}, ${currentUser.longitude.toFixed(3)})`
            : ''}
        </span>
      </div>
    </div>
  );
}

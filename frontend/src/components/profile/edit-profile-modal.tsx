import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { LocationPicker } from '@/components/location/location-picker';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  editName: string;
  setEditName: (val: string) => void;
  editPhone: string;
  setEditPhone: (val: string) => void;
  editAvatar: string;
  editProvince: string;
  setEditProvince: (val: string) => void;
  editKabupaten: string;
  setEditKabupaten: (val: string) => void;
  editKecamatan: string;
  setEditKecamatan: (val: string) => void;
  editLatitude: number;
  setEditLatitude: (val: number) => void;
  editLongitude: number;
  setEditLongitude: (val: number) => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  isUploadingPhoto: boolean;
}

export function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  editName,
  setEditName,
  editPhone,
  setEditPhone,
  editAvatar,
  editProvince,
  setEditProvince,
  editKabupaten,
  setEditKabupaten,
  editKecamatan,
  setEditKecamatan,
  editLatitude,
  setEditLatitude,
  editLongitude,
  setEditLongitude,
  onAvatarChange,
  onSubmit,
  isSaving,
  isUploadingPhoto,
}: EditProfileModalProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-6">
        {/* Header Modal */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-neutral-100">
          <div>
            <h3 className="text-base font-extrabold text-neutral-900">Edit Profil & Wilayah</h3>
            <p className="text-xs text-neutral-500">
              Perbarui identitas dan domisili untuk pantauan karhutla
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center py-2">
            <div
              onClick={() => avatarInputRef.current?.click()}
              className="relative cursor-pointer group"
            >
              <img
                src={
                  editAvatar ||
                  currentUser?.avatarUrl ||
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
                }
                alt="Edit Avatar"
                className="w-20 h-20 rounded-full object-cover border-4 border-orange-500 shadow-md group-hover:opacity-80 transition"
              />
              <div
                className="w-7 h-7 rounded-full text-white flex items-center justify-center absolute bottom-0 right-0 shadow-md border-2 border-white"
                style={{ backgroundColor: '#eb5314' }}
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-neutral-500 mt-2">
              {isUploadingPhoto ? 'Mengunggah Foto...' : 'Ketuk untuk mengganti foto'}
            </span>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={onAvatarChange}
              className="hidden"
            />
          </div>

          {/* Nama */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-700">Nama Lengkap*</label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Nomor Telepon */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-700">Nomor Telepon*</label>
            <input
              type="text"
              required
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Email (Readonly) */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-700">Email (Terverifikasi)</label>
            <input
              type="email"
              disabled
              value={currentUser?.email || ''}
              className="w-full text-xs p-3 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-500 cursor-not-allowed"
            />
          </div>

          {/* SECTION: LOKASI DOMISILI (GPS, pilih wilayah, dan pin peta saling sinkron) */}
          <LocationPicker
            value={{
              province: editProvince,
              kabupaten: editKabupaten,
              kecamatan: editKecamatan,
              latitude: editLatitude,
              longitude: editLongitude,
            }}
            onChange={(loc) => {
              setEditProvince(loc.province);
              setEditKabupaten(loc.kabupaten);
              setEditKecamatan(loc.kecamatan);
              setEditLatitude(loc.latitude);
              setEditLongitude(loc.longitude);
            }}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSaving || isUploadingPhoto}
            className="w-full py-3.5 rounded-xl text-xs font-extrabold text-white transition shadow-md active:scale-[0.99] disabled:opacity-50"
            style={{ backgroundColor: '#eb5314' }}
          >
            {isSaving ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Profil'}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/app-layout';
import { apiRequest } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { showSuccessToast, showErrorToast } from '@/lib/swal';
import { getRegencyCoordinates, isInsideKalimantan } from '@/lib/kalimantan-locations';
import { resolveRegionFromCoords } from '@/lib/geocode';
import { ProfileHeaderCard } from '@/components/profile/profile-header-card';
import { ProfileActivitiesSection } from '@/components/profile/profile-activities-section';
import { ProfileSettingsSection } from '@/components/profile/profile-settings-section';
import { EditProfileModal } from '@/components/profile/edit-profile-modal';
import { ProfileActivitiesModal } from '@/components/profile/profile-activities-modal';
import { ProfileUnauthenticatedView } from '@/components/profile/profile-unauthenticated-view';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, setAuth, logout } = useAuthStore();

  const queryClient = useQueryClient();

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editProvince, setEditProvince] = useState('');
  const [editKabupaten, setEditKabupaten] = useState('');
  const [editKecamatan, setEditKecamatan] = useState('');
  const [editLatitude, setEditLatitude] = useState<number>(-0.0712);
  const [editLongitude, setEditLongitude] = useState<number>(111.4981);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Activity Modal State
  const [activeActivityModal, setActiveActivityModal] = useState<
    'posts' | 'comments' | 'reports' | null
  >(null);

  // GPS Toggle state
  const [gpsActive, setGpsActive] = useState(false);

  // TanStack Query untuk profil akun dan riwayat aktivitas (discope per user ID)
  const { data: profileData } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: () => apiRequest('/users/profile'),
    enabled: isAuthenticated && !!user?.id,
  });

  const { data: activities } = useQuery({
    queryKey: ['user-activities', user?.id],
    queryFn: () => apiRequest('/users/activities'),
    enabled: isAuthenticated && !!user?.id,
  });

  // Sinkronisasi form edit saat profileData berhasil dimuat
  useEffect(() => {
    if (profileData) {
      setGpsActive(profileData.isGpsAlwaysActive ?? false);
      setEditName(profileData.name || '');
      setEditPhone(profileData.phone || '');
      setEditAvatar(profileData.avatarUrl || '');
      setEditProvince(profileData.province || 'Kalimantan Barat');
      setEditKabupaten(profileData.kabupaten || 'Kabupaten Sintang');
      setEditKecamatan(profileData.kecamatan ?? (profileData.kabupaten ? '' : 'Kecamatan Sintang'));

      const savedProvince = profileData.province || 'Kalimantan Barat';
      const savedKabupaten = profileData.kabupaten || 'Kabupaten Sintang';
      if (
        profileData.latitude &&
        profileData.longitude &&
        isInsideKalimantan(profileData.latitude, profileData.longitude)
      ) {
        setEditLatitude(profileData.latitude);
        setEditLongitude(profileData.longitude);
      } else {
        const coords = getRegencyCoordinates(savedProvince, savedKabupaten);
        setEditLatitude(coords.lat);
        setEditLongitude(coords.lng);
      }
    }
  }, [profileData]);

  // Handle GPS Toggle on Profile Settings
  const handleToggleGps = async () => {
    const nextVal = !gpsActive;
    setGpsActive(nextVal);

    if (nextVal && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = Number(position.coords.latitude.toFixed(5));
          const longitude = Number(position.coords.longitude.toFixed(5));

          try {
            const region = await resolveRegionFromCoords(latitude, longitude);
            setEditLatitude(latitude);
            setEditLongitude(longitude);
            setEditProvince(region.province);
            setEditKabupaten(region.kabupaten);
            setEditKecamatan(region.kecamatan);

            const updated = await apiRequest('/users/profile', {
              method: 'PATCH',
              body: JSON.stringify({
                isGpsAlwaysActive: true,
                latitude,
                longitude,
                province: region.province,
                kabupaten: region.kabupaten,
                kecamatan: region.kecamatan,
              }),
            });
            const updatedUser = updated.user || updated;
            queryClient.setQueryData(['user-profile', user?.id], updatedUser);
            queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
            if (user) {
              setAuth({ ...user, ...updatedUser }, localStorage.getItem("firezone_token") || "");
            }
            showSuccessToast(`GPS Aktif: Koordinat tersinkron (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          } catch {
            showErrorToast('Gagal menyinkronkan koordinat GPS');
          }
        },
        async () => {
          try {
            await apiRequest('/users/profile', {
              method: 'PATCH',
              body: JSON.stringify({ isGpsAlwaysActive: true }),
            });
            showSuccessToast('GPS Selalu Aktif diaktifkan');
          } catch {
            setGpsActive(false);
          }
        }
      );
    } else {
      try {
        await apiRequest('/users/profile', {
          method: 'PATCH',
          body: JSON.stringify({ isGpsAlwaysActive: false }),
        });
        showSuccessToast('GPS otomatis dinonaktifkan');
      } catch {
        setGpsActive(true);
        showErrorToast('Gagal mengubah pengaturan GPS');
      }
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      const url = await uploadImageToCloudinary(file, 'firezone_avatars');
      setEditAvatar(url);
    } catch {
      showErrorToast('Gagal memproses foto avatar');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updated = await apiRequest('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: editName.trim(),
          phone: editPhone.trim(),
          avatarUrl: editAvatar || undefined,
          province: editProvince,
          kabupaten: editKabupaten,
          kecamatan: editKecamatan,
          latitude: editLatitude,
          longitude: editLongitude,
        }),
      });

      const updatedUser = updated.user || updated;
      queryClient.setQueryData(['user-profile', user?.id], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
      if (user) {
        setAuth({ ...user, ...updatedUser }, localStorage.getItem('firezone_token') || '');
      }

      showSuccessToast('Profil dan lokasi berhasil diperbarui!');
      setIsEditModalOpen(false);
    } catch (err: any) {
      showErrorToast(err.message || 'Gagal menyimpan perubahan profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  if (!isAuthenticated) {
    return <ProfileUnauthenticatedView />;
  }

  const currentUser = profileData || user;

  return (
    <AppLayout title="Profil Pengguna">
      <div className="max-w-2xl mx-auto space-y-6 pb-20">
        {/* PROFILE HEADER CARD */}
        <ProfileHeaderCard
          currentUser={currentUser}
          gpsActive={gpsActive}
          onEditClick={() => setIsEditModalOpen(true)}
        />

        {/* SECTION: Aktivitas Saya */}
        <ProfileActivitiesSection
          activities={activities}
          onOpenModal={(type) => setActiveActivityModal(type)}
        />

        {/* SECTION: Pengaturan */}
        <ProfileSettingsSection
          gpsActive={gpsActive}
          onToggleGps={handleToggleGps}
          onLogout={handleLogout}
        />
      </div>

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={currentUser}
        editName={editName}
        setEditName={setEditName}
        editPhone={editPhone}
        setEditPhone={setEditPhone}
        editAvatar={editAvatar}
        editProvince={editProvince}
        setEditProvince={setEditProvince}
        editKabupaten={editKabupaten}
        setEditKabupaten={setEditKabupaten}
        editKecamatan={editKecamatan}
        setEditKecamatan={setEditKecamatan}
        editLatitude={editLatitude}
        setEditLatitude={setEditLatitude}
        editLongitude={editLongitude}
        setEditLongitude={setEditLongitude}
        onAvatarChange={handleAvatarChange}
        onSubmit={handleSaveProfile}
        isSaving={isSaving}
        isUploadingPhoto={isUploadingPhoto}
      />

      {/* ACTIVITIES DETAILS MODAL */}
      <ProfileActivitiesModal
        type={activeActivityModal}
        onClose={() => setActiveActivityModal(null)}
        activities={activities}
        onNavigatePost={(postId) => {
          setActiveActivityModal(null);
          navigate({ to: '/community/$postId', params: { postId } });
        }}
      />
    </AppLayout>
  );
}

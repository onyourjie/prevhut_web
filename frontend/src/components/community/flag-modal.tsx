import React, { useState } from 'react';
import { X } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { showSuccessToast, showErrorToast } from '@/lib/swal';

export interface FlagModalProps {
  postId: string;
  onClose: () => void;
}

const REASONS = [
  { value: 'HOAX_INFO_PALSU', label: 'Diduga informasi palsu' },
  { value: 'FOTO_LOKASI_TIDAK_SESUAI', label: 'Foto atau lokasi tidak sesuai' },
  { value: 'SPAM', label: 'Spam' },
  { value: 'LAINNYA', label: 'Lainnya' },
];

export function FlagModal({ postId, onClose }: FlagModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('FOTO_LOKASI_TIDAK_SESUAI');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;

    try {
      setIsSubmitting(true);
      await apiRequest(`/community/posts/${postId}/flag`, {
        method: 'POST',
        body: JSON.stringify({
          reason: selectedReason,
          notes: notes.trim() || undefined,
        }),
      });

      showSuccessToast('Laporan berhasil dikirim ke Admin Posko untuk ditinjau.');
      onClose();
    } catch (err: any) {
      showErrorToast(err.message || 'Gagal mengirim laporan. Pastikan Anda telah masuk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top grab bar for mobile */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Modal Header */}
        <div className="p-5 pb-3 flex items-start justify-between border-b border-neutral-100">
          <div>
            <h2 className="text-base font-extrabold text-neutral-900 leading-tight">
              Laporkan postingan
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Apa alasan kamu melaporkan postingan ini?
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
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Radio Choices */}
          <div className="space-y-2">
            {REASONS.map((reason) => {
              const isChecked = selectedReason === reason.value;
              return (
                <label
                  key={reason.value}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                    isChecked
                      ? 'border-brand-500 bg-brand-50/50 shadow-xs'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-xs font-semibold text-neutral-800">
                    {reason.label}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                      isChecked
                        ? 'border-brand-600 bg-brand-600'
                        : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {isChecked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <input
                    type="radio"
                    name="reason"
                    value={reason.value}
                    checked={isChecked}
                    onChange={() => setSelectedReason(reason.value)}
                    className="sr-only"
                  />
                </label>
              );
            })}
          </div>

          {/* Optional Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700">
              Keterangan tambahan (opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan keterangan atau kecurigaan foto/lokasi..."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.99] disabled:opacity-50 transition shadow-sm"
            >
              {isSubmitting ? 'Mengirim Laporan...' : 'Kirim Laporan ke Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { PhoneCall } from "lucide-react";

interface EmergencyPromptModalProps {
  isOpen: boolean;
  onProceed: () => void;
}

export function EmergencyPromptModal({
  isOpen,
  onProceed,
}: EmergencyPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-2xl p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
        <div
          className="w-16 h-16 rounded-full text-white flex items-center justify-center mx-auto shadow-md"
          style={{ backgroundColor: "#dc2626" }}
        >
          <PhoneCall className="w-8 h-8 text-white animate-bounce" />
        </div>

        <h3 className="text-base font-extrabold text-neutral-900">
          Perlu bantuan segera?
        </h3>
        <p className="text-xs text-neutral-600 leading-relaxed">
          Hubungi layanan darurat jika kamu membutuhkan bantuan langsung. Postingan komunitas belum tentu mendapat respon cepat pemadaman.
        </p>

        <div className="space-y-2 pt-2">
          <Link
            to="/emergency"
            className="w-full py-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
            style={{ backgroundColor: "#dc2626" }}
          >
            <PhoneCall className="w-4 h-4 text-white" />
            <span>Hubungi Layanan Darurat (113)</span>
          </Link>
          <button
            type="button"
            onClick={onProceed}
            className="w-full py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition cursor-pointer"
          >
            Lanjut Buat Postingan
          </button>
        </div>
      </div>
    </div>
  );
}

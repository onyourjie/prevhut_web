import { AlertTriangle } from "lucide-react";

interface PublishConfirmationModalProps {
  isOpen: boolean;
  category: "DARURAT" | "INFORMASI";
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PublishConfirmationModal({
  isOpen,
  category,
  isSubmitting,
  onConfirm,
  onCancel,
}: PublishConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-2xl p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
        <div
          className="w-16 h-16 rounded-full text-white flex items-center justify-center mx-auto shadow-md"
          style={{ backgroundColor: "#ea580c" }}
        >
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-base font-extrabold text-neutral-900">
          {category === "DARURAT"
            ? "Publikasikan sebagai Darurat?"
            : "Publikasikan Informasi?"}
        </h3>
        <p className="text-xs text-neutral-600 leading-relaxed">
          {category === "DARURAT"
            ? "Postinganmu akan disematkan di bagian atas komunitas dan dinotifikasikan ke relawan posko setempat. Pastikan foto dan keterangan sesuai kondisi riil."
            : "Informasi ini akan tampil di feed komunitas agar warga sekitar dapat saling waspada."}
        </p>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="w-full py-3 rounded-xl text-white text-xs font-bold disabled:opacity-50 transition shadow-sm cursor-pointer"
            style={{ backgroundColor: "#eb5314" }}
          >
            {isSubmitting ? "Mempublikasikan..." : "Publikasikan Sekarang"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition cursor-pointer"
          >
            Periksa Kembali
          </button>
        </div>
      </div>
    </div>
  );
}

import { AlertTriangle, Info } from "lucide-react";

interface CreateCategorySelectorProps {
  category: "DARURAT" | "INFORMASI";
  onSelectCategory: (cat: "DARURAT" | "INFORMASI") => void;
}

export function CreateCategorySelector({
  category,
  onSelectCategory,
}: CreateCategorySelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-neutral-800">
        Kategori Laporan <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelectCategory("DARURAT")}
          className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
            category === "DARURAT"
              ? "border-red-500 bg-red-50/60 shadow-xs ring-2 ring-red-500/20"
              : "border-neutral-200 bg-white hover:bg-neutral-50"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              category === "DARURAT"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-neutral-900 block">
              Titik Api Aktif (Darurat)
            </span>
            <span className="text-[11px] text-neutral-500 leading-tight block mt-0.5">
              Api terlihat menyala atau asap tebal mendekati permukiman.
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectCategory("INFORMASI")}
          className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
            category === "INFORMASI"
              ? "border-amber-500 bg-amber-50/60 shadow-xs ring-2 ring-amber-500/20"
              : "border-neutral-200 bg-white hover:bg-neutral-50"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              category === "INFORMASI"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            <Info className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-neutral-900 block">
              Informasi / Asap Dingin
            </span>
            <span className="text-[11px] text-neutral-500 leading-tight block mt-0.5">
              Sisa pembakaran, kabut asap tipis, atau laporan situasi umum.
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

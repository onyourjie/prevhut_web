import { Camera, Video, SwitchCamera, X, Square, Mic, MicOff } from "lucide-react";

interface ViewfinderControlsProps {
  isRecording: boolean;
  recordingSeconds: number;
  captureMode: "PHOTO" | "VIDEO";
  setCaptureMode: (mode: "PHOTO" | "VIDEO") => void;
  hasAudio: boolean;
  onEnsureAudioTrack: () => void;
  onSwitchCamera: () => void;
  onClose: () => void;
  onCapturePhoto: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isUploading?: boolean;
}

export function ViewfinderControls({
  isRecording,
  recordingSeconds,
  captureMode,
  setCaptureMode,
  hasAudio,
  onEnsureAudioTrack,
  onSwitchCamera,
  onClose,
  onCapturePhoto,
  onStartRecording,
  onStopRecording,
  isUploading = false,
}: ViewfinderControlsProps) {
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Viewfinder Target Brackets */}
      {!isRecording && (
        <div className="absolute inset-0 pointer-events-none z-10 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-6 h-6 border-t-2 border-l-2 border-white/70 rounded-tl-sm" />
            <div className="w-6 h-6 border-t-2 border-r-2 border-white/70 rounded-tr-sm" />
          </div>
          <div className="flex justify-between items-end">
            <div className="w-6 h-6 border-b-2 border-l-2 border-white/70 rounded-bl-sm" />
            <div className="w-6 h-6 border-b-2 border-r-2 border-white/70 rounded-br-sm" />
          </div>
        </div>
      )}

      {/* Top Controls Overlay */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20">
        {/* Status Perekaman Video & Status Mikrofon */}
        <div className="flex items-center gap-2">
          {isRecording ? (
            <div className="px-3 py-1.5 rounded-full bg-red-600/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 shadow-md animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <span>REC {formatTimer(recordingSeconds)} / 00:30</span>
            </div>
          ) : captureMode === "VIDEO" ? (
            <div
              className={`px-2.5 py-1 rounded-full backdrop-blur-md text-[11px] font-bold flex items-center gap-1.5 shadow-sm border ${
                hasAudio
                  ? "bg-black/60 border-emerald-500/40 text-emerald-300"
                  : "bg-black/60 border-amber-500/40 text-amber-300"
              }`}
            >
              {hasAudio ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Audio Aktif</span>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onEnsureAudioTrack}
                  className="flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <MicOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Aktifkan Mic</span>
                </button>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Switch Camera Button */}
          {!isRecording && (
            <button
              type="button"
              onClick={onSwitchCamera}
              title="Ganti Kamera"
              className="px-2.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold flex items-center gap-1.5 transition shadow-sm active:scale-95 cursor-pointer"
            >
              <SwitchCamera className="w-4 h-4 text-orange-400" />
              <span className="hidden sm:inline">Ganti Kamera</span>
            </button>
          )}

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            title="Tutup Kamera"
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition shadow-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Controls Bar: Mode Foto/Video & Shutter Button */}
      <div className="absolute bottom-3 inset-x-0 flex flex-col items-center justify-center z-20 gap-2.5">
        {/* Mode Switcher: Foto vs Video */}
        {!isRecording && (
          <div className="flex items-center gap-1 p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-md">
            <button
              type="button"
              onClick={() => setCaptureMode("PHOTO")}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 ${
                captureMode === "PHOTO"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Foto</span>
            </button>
            <button
              type="button"
              onClick={() => setCaptureMode("VIDEO")}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 ${
                captureMode === "VIDEO"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <Video className="w-3.5 h-3.5 text-red-500" />
              <span>Video</span>
            </button>
          </div>
        )}

        {/* Shutter / Record Button */}
        {captureMode === "PHOTO" ? (
          <button
            type="button"
            onClick={onCapturePhoto}
            disabled={isUploading}
            className="group relative flex items-center justify-center w-15 h-15 rounded-full bg-white text-orange-600 shadow-2xl hover:scale-105 active:scale-95 transition border-4 border-orange-500 cursor-pointer disabled:opacity-50"
            title="Ambil Foto"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-red-600 flex items-center justify-center text-white shadow-inner group-hover:from-orange-500 group-hover:to-red-500">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </button>
        ) : isRecording ? (
          <button
            type="button"
            onClick={onStopRecording}
            className="flex items-center justify-center w-15 h-15 rounded-full bg-white text-red-600 shadow-2xl hover:scale-105 active:scale-95 transition border-4 border-red-500 cursor-pointer animate-pulse"
            title="Berhenti Merekam"
          >
            <div className="w-6 h-6 rounded-md bg-red-600 flex items-center justify-center shadow-inner">
              <Square className="w-3.5 h-3.5 text-white fill-white" />
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={onStartRecording}
            className="group relative flex items-center justify-center w-15 h-15 rounded-full bg-white text-red-600 shadow-2xl hover:scale-105 active:scale-95 transition border-4 border-red-500 cursor-pointer"
            title="Mulai Rekam Video"
          >
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-inner group-hover:bg-red-700">
              <Video className="w-5 h-5 text-white" />
            </div>
          </button>
        )}
      </div>
    </>
  );
}

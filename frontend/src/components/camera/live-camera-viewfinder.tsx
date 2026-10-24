import { useEffect, useRef, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { showErrorToast } from "@/lib/swal";
import { useCameraStream } from "./use-camera-stream";
import { ViewfinderControls } from "./viewfinder-controls";

interface LiveCameraViewfinderProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  isUploading?: boolean;
}

export function LiveCameraViewfinder({
  onCapture,
  onClose,
  isUploading = false,
}: LiveCameraViewfinderProps) {
  const [captureMode, setCaptureMode] = useState<"PHOTO" | "VIDEO">("PHOTO");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  const {
    videoRef,
    streamRef,
    isStarting,
    errorMsg,
    hasAudio,
    startCamera,
    stopCurrentStream,
    ensureAudioTrack,
    handleSwitchCamera,
  } = useCameraStream();

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (captureMode === "VIDEO" && streamRef.current) {
      ensureAudioTrack();
    }
  }, [captureMode, ensureAudioTrack, streamRef]);

  const handleCapturePhoto = () => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return;

    try {
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const fileName = `live-incident-${Date.now()}.jpg`;
          const file = new File([blob], fileName, { type: "image/jpeg" });

          stopCurrentStream();
          onCapture(file);
        },
        "image/jpeg",
        0.85
      );
    } catch (err) {
      console.error("Failed to capture frame:", err);
    }
  };

  const getSupportedMimeType = (): string => {
    if (typeof MediaRecorder === "undefined") return "";
    const candidateTypes = [
      "video/mp4;codecs=avc1,mp4a.40.2",
      "video/mp4",
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];
    for (const t of candidateTypes) {
      if (MediaRecorder.isTypeSupported(t)) return t;
    }
    return "";
  };

  const handleStartRecording = async () => {
    if (!streamRef.current) return;

    await ensureAudioTrack();

    try {
      recordedChunksRef.current = [];
      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;

      let recorder: MediaRecorder;
      try {
        recorder = options
          ? new MediaRecorder(streamRef.current, options)
          : new MediaRecorder(streamRef.current);
      } catch {
        recorder = new MediaRecorder(streamRef.current);
      }

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const finalMime = recorder.mimeType || mimeType || "video/webm";
        const extension = finalMime.includes("mp4") ? "mp4" : "webm";
        const blob = new Blob(recordedChunksRef.current, { type: finalMime });
        const videoFile = new File([blob], `live-video-${Date.now()}.${extension}`, {
          type: finalMime,
        });

        stopCurrentStream();
        onCapture(videoFile);
      };

      recorder.start(500);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      const startTime = Date.now();
      recordingTimerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordingSeconds(elapsed);

        if (elapsed >= 30) {
          handleStopRecording();
        }
      }, 500);
    } catch (err) {
      console.error("Failed to start recording:", err);
      showErrorToast("Gagal memulai perekaman video kamera.");
    }
  };

  const handleStopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn("Stop recorder error:", err);
      }
    }
    setIsRecording(false);
  };

  const handleClose = () => {
    if (isRecording) {
      handleStopRecording();
    }
    stopCurrentStream();
    onClose();
  };

  return (
    <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden flex items-center justify-center">
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="w-full h-full object-cover"
      />

      {isStarting && (
        <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center gap-3 z-30">
          <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-xs font-semibold">Menginisialisasi Kamera Langsung...</p>
        </div>
      )}

      {errorMsg && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-6 text-center z-30">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-white text-xs font-bold">{errorMsg}</p>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => startCamera()}
              className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Coba Lagi</span>
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {!isStarting && !errorMsg && (
        <ViewfinderControls
          isRecording={isRecording}
          recordingSeconds={recordingSeconds}
          captureMode={captureMode}
          setCaptureMode={setCaptureMode}
          hasAudio={hasAudio}
          onEnsureAudioTrack={ensureAudioTrack}
          onSwitchCamera={handleSwitchCamera}
          onClose={handleClose}
          onCapturePhoto={handleCapturePhoto}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          isUploading={isUploading}
        />
      )}
    </div>
  );
}

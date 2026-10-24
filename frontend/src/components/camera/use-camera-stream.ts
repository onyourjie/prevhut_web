import { useEffect, useRef, useState } from "react";
import { showErrorToast } from "@/lib/swal";

export function useCameraStream() {
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceIndex, setActiveDeviceIndex] = useState(0);
  const [isStarting, setIsStarting] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasAudio, setHasAudio] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCurrentStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const getAvailableDevices = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const inputs = devices.filter((d) => d.kind === "videoinput");
        setVideoDevices(inputs);
        return inputs;
      }
    } catch (err) {
      console.warn("enumerateDevices error:", err);
    }
    return [];
  };

  const ensureAudioTrack = async (): Promise<boolean> => {
    if (!streamRef.current) return false;
    const existing = streamRef.current.getAudioTracks();
    if (existing.length > 0 && existing[0].readyState === "live") {
      existing[0].enabled = true;
      setHasAudio(true);
      return true;
    }

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      const track = audioStream.getAudioTracks()[0];
      if (track && streamRef.current) {
        streamRef.current.addTrack(track);
        setHasAudio(true);
        return true;
      }
    } catch (err) {
      console.warn("Microphone access failed:", err);
      setHasAudio(false);
      return false;
    }
    return false;
  };

  const startCamera = async (deviceId?: string) => {
    setIsStarting(true);
    setErrorMsg(null);
    stopCurrentStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg("Browser Anda tidak mendukung akses kamera langsung.");
      setIsStarting(false);
      return;
    }

    try {
      const videoConstraints: MediaTrackConstraints = deviceId
        ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
        : { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } };

      const audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      };

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: audioConstraints,
        });
        setHasAudio(stream.getAudioTracks().length > 0);
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false,
        });
        setHasAudio(false);
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      const devices = await getAvailableDevices();
      if (deviceId && devices.length > 0) {
        const idx = devices.findIndex((d) => d.deviceId === deviceId);
        if (idx !== -1) setActiveDeviceIndex(idx);
      }

      setIsStarting(false);
    } catch (err: any) {
      console.error("Camera access error:", err);
      setErrorMsg(
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Izin akses kamera ditolak. Mohon izinkan akses kamera di pengaturan browser."
          : "Kamera tidak dapat diakses atau sedang digunakan oleh aplikasi lain."
      );
      setIsStarting(false);
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      stopCurrentStream();
    };
  }, []);

  const handleSwitchCamera = async () => {
    const devices = videoDevices.length > 0 ? videoDevices : await getAvailableDevices();

    if (devices.length <= 1) {
      showErrorToast(
        "Kamera belakang tidak tersedia pada laptop/perangkat ini (hanya 1 kamera terdeteksi)."
      );
      return;
    }

    const nextIndex = (activeDeviceIndex + 1) % devices.length;
    setActiveDeviceIndex(nextIndex);
    const nextDeviceId = devices[nextIndex].deviceId;
    await startCamera(nextDeviceId);
  };

  return {
    videoRef,
    streamRef,
    isStarting,
    errorMsg,
    hasAudio,
    startCamera,
    stopCurrentStream,
    ensureAudioTrack,
    handleSwitchCamera,
  };
}

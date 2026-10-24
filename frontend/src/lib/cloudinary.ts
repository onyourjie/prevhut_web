/**
 * Media Upload Service for FIREZONE
 * Supports direct client-side upload via:
 * 1. Cloudinary unsigned preset (if configured)
 * 2. Backend Local Storage (/community/upload) with full HTTP 206 Range-Request streaming
 * 3. Fallback to Data URL
 */

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width?: number;
  height?: number;
  duration?: number;
}

export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

/**
 * Helper to check whether a URL or data URL is a video
 */
export function isVideoMedia(url?: string | null): boolean {
  if (!url) return false;
  return (
    url.startsWith("data:video/") ||
    /\.(mp4|webm|mov|ogg|m4v)($|\?)/i.test(url) ||
    url.includes("/video/upload/") ||
    url.includes("/uploads/live-video-") ||
    url.includes("/uploads/media-")
  );
}

/**
 * Convert file/blob to Base64 Data URL helper
 */
export function fileToDataUrl(fileOrBlob: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(fileOrBlob);
  });
}

/**
 * Uploads an image or video file/blob to Cloudinary or Local Server Storage.
 */
export async function uploadMediaToCloudinary(
  fileOrBlob: File | Blob,
  folder: string = "firezone_reports"
): Promise<string> {
  const isVideo = fileOrBlob.type.startsWith("video/");
  const endpointType = isVideo ? "video" : "image";

  // 1. Try Cloudinary if configured
  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET) {
    try {
      const formData = new FormData();
      formData.append("file", fileOrBlob);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${endpointType}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        const data: CloudinaryUploadResponse = await res.json();
        if (data.secure_url) return data.secure_url;
      }
    } catch (err) {
      console.warn("Cloudinary upload warning:", err);
    }
  }

  // 2. Try Backend Local Storage endpoint (/community/upload)
  try {
    const dataUrl = await fileToDataUrl(fileOrBlob);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/community/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: dataUrl,
        filename: fileOrBlob instanceof File ? fileOrBlob.name : undefined,
      }),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.url) return result.url;
    }
  } catch (err) {
    console.warn("Local server upload warning:", err);
  }

  // 3. Fallback: Data URL
  return fileToDataUrl(fileOrBlob);
}

/**
 * Backward compatibility alias
 */
export const uploadImageToCloudinary = uploadMediaToCloudinary;

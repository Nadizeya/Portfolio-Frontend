// Cloudinary Upload Utility
const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dmkhpdmvz";
const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ml_default"; // You need to create this preset in Cloudinary

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

/**
 * Upload image to Cloudinary using their upload widget
 * @param file - The file to upload
 * @returns Promise with the uploaded image URL
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "portfolio/skills");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Cloudinary error:", errorData);

      if (errorData.error?.message?.includes("Upload preset not found")) {
        throw new Error(
          "Upload preset not configured. Please create an unsigned upload preset in Cloudinary settings.",
        );
      }

      throw new Error(
        errorData.error?.message || "Failed to upload image to Cloudinary",
      );
    }

    const data: CloudinaryUploadResponse = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
};

/**
 * Open Cloudinary Upload Widget (Alternative method - requires widget script)
 */
export const openCloudinaryWidget = (
  onSuccess: (url: string) => void,
  onError?: (error: Error) => void,
) => {
  // Check if widget script is loaded
  if (typeof window !== "undefined" && (window as any).cloudinary) {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        folder: "portfolio/skills",
        sources: ["local", "url", "camera"],
        multiple: false,
        maxFileSize: 2000000, // 2MB
        clientAllowedFormats: ["png", "jpg", "jpeg", "svg", "webp"],
        cropping: true,
        croppingAspectRatio: 1,
        croppingShowDimensions: true,
      },
      (error: any, result: any) => {
        if (error) {
          console.error("Upload widget error:", error);
          onError?.(new Error(error.statusText || "Upload failed"));
          return;
        }

        if (result.event === "success") {
          onSuccess(result.info.secure_url);
          widget.close();
        }
      },
    );

    widget.open();
  } else {
    console.error("Cloudinary widget not loaded");
    onError?.(new Error("Cloudinary widget not available"));
  }
};

import React, { useState, useRef, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { ImageCropper } from "./ImageCropper";
import { Camera, Trash2, Upload } from "lucide-react";
import { cn } from "../../utils/cn";
import { toast } from "sonner";

interface AvatarUploadProps {
  currentAvatar?: string;
  fallbackText: string;
  fallbackColor?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onAvatarChange: (blob: Blob | null) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
  xl: "h-40 w-40",
};

const iconSizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  fallbackText,
  fallbackColor = "795548",
  size = "lg",
  onAvatarChange,
  disabled = false,
  className,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }

      // Create preview URL and open cropper
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);

      // Reset input
      e.target.value = "";
    },
    []
  );

  const handleCropComplete = useCallback(
    async (croppedBlob: Blob) => {
      setIsUploading(true);
      try {
        // Create preview URL
        const url = URL.createObjectURL(croppedBlob);
        setPreviewUrl(url);

        // Call parent handler
        await onAvatarChange(croppedBlob);
        toast.success("Profile photo updated!");
      } catch (error) {
        toast.error("Failed to update profile photo");
        setPreviewUrl(null);
      } finally {
        setIsUploading(false);
        setShowCropper(false);
      }
    },
    [onAvatarChange]
  );

  const handleRemoveAvatar = useCallback(async () => {
    setIsUploading(true);
    try {
      await onAvatarChange(null);
      setPreviewUrl(null);
      toast.success("Profile photo removed");
    } catch (error) {
      toast.error("Failed to remove profile photo");
    } finally {
      setIsUploading(false);
    }
  }, [onAvatarChange]);

  const triggerFileInput = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const displayAvatar = previewUrl || currentAvatar;
  const hasCustomAvatar =
    !!displayAvatar && !displayAvatar.includes("ui-avatars.com");

  return (
    <>
      <div
        className={cn("relative inline-flex flex-col items-center", className)}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
          aria-label="Upload profile photo"
          title="Upload profile photo"
        />

        {/* Avatar with overlay */}
        <div className="relative group">
          <Avatar
            className={cn(
              sizeClasses[size],
              "border-4 border-coffee-50 dark:border-white/10 shadow-xl transition-transform",
              !disabled && "group-hover:scale-105",
              isUploading && "opacity-50"
            )}
          >
            <AvatarImage
              src={
                displayAvatar ||
                `https://ui-avatars.com/api/?name=${fallbackText}&background=${fallbackColor}&color=fff`
              }
            />
            <AvatarFallback className="text-2xl font-serif">
              {fallbackText.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Hover overlay */}
          {!disabled && !isUploading && (
            <div
              onClick={triggerFileInput}
              className={cn(
                "absolute inset-0 bg-black/50 rounded-full flex items-center justify-center",
                "opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              )}
            >
              <Camera className={cn("text-white", iconSizes[size])} />
            </div>
          )}

          {/* Loading spinner */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Action buttons - fixed height container to prevent layout shift */}
        {!disabled && (
          <div className="flex items-center justify-center gap-2 mt-4 min-h-[40px]">
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={isUploading}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full",
                "bg-coffee-100 dark:bg-white/10 text-coffee-700 dark:text-white",
                "hover:bg-coffee-200 dark:hover:bg-white/20 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Upload className="w-4 h-4" />
              {hasCustomAvatar ? "Change Photo" : "Upload Photo"}
            </button>

            {hasCustomAvatar && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={isUploading}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full",
                  "bg-error/10 dark:bg-error/20 text-error",
                  "hover:bg-error/20 dark:hover:bg-error/30 transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>
        )}
      </div>

      {/* Image Cropper Modal */}
      <ImageCropper
        imageSrc={selectedImage}
        open={showCropper}
        onClose={() => setShowCropper(false)}
        onCropComplete={handleCropComplete}
        aspectRatio={1}
      />
    </>
  );
};

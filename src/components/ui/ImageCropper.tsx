import React, { useState, useRef, useCallback } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog";
import { Button } from "../common/Button";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropperProps {
  imageSrc: string;
  open: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspectRatio?: number;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  open,
  onClose,
  onCropComplete,
  aspectRatio = 1, // Default square crop
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspectRatio));
    },
    [aspectRatio]
  );

  const getCroppedImg = useCallback(async (): Promise<Blob | null> => {
    const image = imgRef.current;
    if (!image || !completedCrop) return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set output size (we'll use a fixed size for avatars)
    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Calculate the crop area in natural image coordinates
    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    // Handle rotation
    const rotateRads = rotate * (Math.PI / 180);
    const centerX = outputSize / 2;
    const centerY = outputSize / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotateRads);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      outputSize,
      outputSize
    );

    ctx.restore();

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.95);
    });
  }, [completedCrop, rotate, scale]);

  const handleCropConfirm = async () => {
    const croppedBlob = await getCroppedImg();
    if (croppedBlob) {
      onCropComplete(croppedBlob);
      onClose();
    }
  };

  const handleRotate = () => {
    setRotate((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">
            Crop Your Photo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="rounded-full p-2"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-coffee-600 dark:text-white/60 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="rounded-full p-2"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-coffee-200 dark:bg-white/20 mx-2" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRotate}
              className="rounded-full p-2"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Crop Area */}
          <div className="relative flex items-center justify-center bg-coffee-950 rounded-2xl overflow-hidden min-h-[300px]">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              circularCrop
              className="max-h-[400px]"
            >
              <img
                ref={imgRef}
                alt="Crop preview"
                src={imageSrc}
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  maxHeight: "400px",
                  maxWidth: "100%",
                }}
                onLoad={onImageLoad}
                className="transition-transform"
              />
            </ReactCrop>
          </div>

          {/* Help text */}
          <p className="text-sm text-center text-coffee-500 dark:text-white/50">
            Drag to reposition. The crop area will be used as your profile
            photo.
          </p>
        </div>

        <DialogFooter className="gap-3 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleCropConfirm}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

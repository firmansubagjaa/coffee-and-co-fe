import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";

interface OptimizedImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  priority?: boolean;
  blur?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none";
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = "/images/placeholder.jpg",
  aspectRatio = "auto",
  priority = false,
  blur = true,
  objectFit = "cover",
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "",
  };

  const objectFitClasses = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
  };

  return (
    <div
      ref={imgRef}
      className={cn(
        "relative overflow-hidden bg-coffee-100 dark:bg-coffee-800",
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {/* Blur placeholder */}
      {blur && !isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-coffee-200 to-coffee-100 dark:from-coffee-700 dark:to-coffee-800 animate-pulse" />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={hasError ? fallbackSrc : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={cn(
            "w-full h-full transition-opacity duration-300",
            objectFitClasses[objectFit],
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          {...props}
        />
      )}
    </div>
  );
};

// Preload critical images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Hook for preloading images
export const useImagePreload = (sources: string[]) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all(sources.map(preloadImage))
      .then(() => setLoaded(true))
      .catch(console.error);
  }, [sources]);

  return loaded;
};

import React, { useState, useRef, useEffect, memo, useCallback } from "react";
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
  /** Low quality placeholder image for blur-up effect */
  placeholder?: string;
  /** Callback when image finishes loading */
  onLoadComplete?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = memo(
  ({
    src,
    alt,
    fallbackSrc = "/images/placeholder.jpg",
    aspectRatio = "auto",
    priority = false,
    blur = true,
    objectFit = "cover",
    placeholder,
    onLoadComplete,
    className,
    ...props
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const imgRef = useRef<HTMLDivElement>(null);

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
          rootMargin: "100px", // Start loading slightly before in view
          threshold: 0,
        }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }, [priority]);

    const handleLoad = useCallback(() => {
      setIsLoaded(true);
      onLoadComplete?.();
    }, [onLoadComplete]);

    const handleError = useCallback(() => {
      setHasError(true);
      setIsLoaded(true);
    }, []);

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
        {/* Blur placeholder - uses low quality image if provided */}
        {blur && !isLoaded && (
          <>
            {placeholder ? (
              <img
                src={placeholder}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-coffee-200 to-coffee-100 dark:from-coffee-700 dark:to-coffee-800 animate-pulse" />
            )}
          </>
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
            fetchPriority={priority ? "high" : "auto"}
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
  }
);

OptimizedImage.displayName = "OptimizedImage";

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

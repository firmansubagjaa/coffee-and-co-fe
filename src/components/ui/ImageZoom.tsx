import React, { useState, useRef } from 'react';
import { cn } from '../../utils/cn';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

export const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt, className, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-zoom-in w-full h-full", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-transform duration-200 ease-out pointer-events-none will-change-transform",
          isHovering ? "scale-[2]" : "scale-100"
        )}
        style={{
            transformOrigin: isHovering ? `${position.x}% ${position.y}%` : 'center',
        }}
      />
    </div>
  );
};

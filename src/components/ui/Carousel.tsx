import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TRANSITIONS } from "../../utils/animations";

interface CarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  images,
  alt,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
    }),
  };

  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    let nextIndex = currentIndex + newDirection;
    if (nextIndex < 0) nextIndex = images.length - 1;
    if (nextIndex >= images.length) nextIndex = 0;
    setCurrentIndex(nextIndex);
  };

  if (images.length <= 1) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={images[0]}
          alt={alt}
          className="w-full h-full object-cover rounded-2xl"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden group/carousel ${className}`}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${alt} image carousel, showing image ${
        currentIndex + 1
      } of ${images.length}`}
    >
      <div className="absolute inset-0 w-full h-full" aria-live="polite">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={TRANSITIONS.spring}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -10000) {
                paginate(1);
              } else if (swipe > 10000) {
                paginate(-1);
              }
            }}
            alt={`${alt} - Image ${currentIndex + 1} of ${images.length}`}
            className="absolute inset-0 w-full h-full object-cover rounded-2xl cursor-grab active:cursor-grabbing"
            loading="lazy"
            decoding="async"
          />
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute inset-0 z-20 flex items-center justify-between p-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            paginate(-1);
          }}
          className="pointer-events-auto h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm text-coffee-900 shadow-lg flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-coffee-600 focus-visible:ring-offset-2"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            paginate(1);
          }}
          className="pointer-events-auto h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm text-coffee-900 shadow-lg flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-coffee-600 focus-visible:ring-offset-2"
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </motion.button>
      </div>

      {/* Dots */}
      <div
        className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2 pointer-events-none"
        role="tablist"
        aria-label="Image indicators"
      >
        {images.map((_, idx) => (
          <motion.div
            key={idx}
            layout
            initial={false}
            animate={{
              width: idx === currentIndex ? 24 : 6,
              opacity: idx === currentIndex ? 1 : 0.6,
            }}
            transition={TRANSITIONS.softSpring}
            role="tab"
            aria-selected={idx === currentIndex}
            aria-label={`Image ${idx + 1}`}
            className={`h-1.5 rounded-full bg-white shadow-sm backdrop-blur-[1px]`}
          />
        ))}
      </div>
    </div>
  );
};

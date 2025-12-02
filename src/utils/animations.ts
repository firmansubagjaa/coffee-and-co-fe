
export const TRANSITIONS = {
  spring: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },
  softSpring: {
    type: "spring" as const,
    stiffness: 200,
    damping: 25,
  },
  stiff: {
    type: "spring" as const,
    stiffness: 500,
    damping: 30,
  },
  easeOut: {
    duration: 0.3,
    ease: [0.25, 0.1, 0.25, 1] as const, // Cubic bezier
  }
};

export const VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  }
};

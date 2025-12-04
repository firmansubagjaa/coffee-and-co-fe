/**
 * Animation Utilities
 *
 * Framer Motion transitions and variants for consistent animations
 */

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
    ease: [0.25, 0.1, 0.25, 1] as const,
  },
  easeInOut: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] as const,
  },
  bounce: {
    type: "spring" as const,
    stiffness: 400,
    damping: 10,
  },
  smooth: {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1] as const,
  },
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
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
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
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  slideInFromRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  },
  slideInFromBottom: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 100 },
  },
  // Micro-interactions
  tap: {
    scale: 0.97,
  },
  hover: {
    scale: 1.02,
  },
  hoverLift: {
    y: -4,
    transition: { duration: 0.2 },
  },
  press: {
    scale: 0.95,
  },
};

// Button animation presets
export const BUTTON_ANIMATIONS = {
  primary: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: TRANSITIONS.spring,
  },
  secondary: {
    whileHover: { scale: 1.01 },
    whileTap: { scale: 0.99 },
    transition: TRANSITIONS.softSpring,
  },
  icon: {
    whileHover: { scale: 1.1, rotate: 5 },
    whileTap: { scale: 0.9 },
    transition: TRANSITIONS.spring,
  },
  subtle: {
    whileHover: { opacity: 0.8 },
    whileTap: { scale: 0.98 },
    transition: TRANSITIONS.easeOut,
  },
};

// Card animation presets
export const CARD_ANIMATIONS = {
  hover: {
    whileHover: {
      y: -4,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    },
    transition: TRANSITIONS.smooth,
  },
  tap: {
    whileTap: { scale: 0.98 },
    transition: TRANSITIONS.spring,
  },
  inView: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: TRANSITIONS.spring,
  },
};

// Modal animation presets
export const MODAL_ANIMATIONS = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  content: {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
    transition: TRANSITIONS.spring,
  },
  drawer: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: TRANSITIONS.spring,
  },
  bottomSheet: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    transition: TRANSITIONS.spring,
  },
};

// List animation presets
export const LIST_ANIMATIONS = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  },
};

// Notification animation presets
export const NOTIFICATION_ANIMATIONS = {
  slideIn: {
    initial: { opacity: 0, y: -20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    transition: TRANSITIONS.spring,
  },
  pop: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: TRANSITIONS.bounce,
  },
};

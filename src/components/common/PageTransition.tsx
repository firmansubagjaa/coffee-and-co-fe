
import React from 'react';
import { motion } from 'framer-motion';
import { VARIANTS, TRANSITIONS } from '../../utils/animations';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = "" }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={VARIANTS.fadeIn}
      transition={TRANSITIONS.easeOut}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

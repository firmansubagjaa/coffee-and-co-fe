import React from "react";
import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

interface LoadingScreenProps {
  fullScreen?: boolean;
  text?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  fullScreen = true,
  text = "Brewing something special...",
}) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream-50 dark:bg-coffee-950"
    : "w-full h-full min-h-[200px] flex flex-col items-center justify-center bg-transparent";

  return (
    <div
      className={containerClasses}
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          className="absolute -inset-4 rounded-full border-2 border-coffee-200 dark:border-coffee-800 opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Middle Ring */}
        <motion.div
          className="absolute -inset-2 rounded-full border border-coffee-400 dark:border-coffee-600 opacity-40"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />

        {/* Icon Container */}
        <motion.div
          className="relative z-10 bg-white dark:bg-coffee-900 p-4 rounded-full shadow-xl border border-coffee-100 dark:border-coffee-800"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Coffee
            className="w-8 h-8 text-coffee-600 dark:text-coffee-400"
            aria-hidden="true"
          />

          {/* Steam Animation */}
          <motion.div
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-coffee-300 dark:bg-coffee-500 rounded-full blur-[1px]"
            animate={{
              y: [0, -10, -15],
              opacity: [0, 0.6, 0],
              scaleY: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          <motion.div
            className="absolute -top-3 left-1/2 translate-x-1 w-1 h-3 bg-coffee-300 dark:bg-coffee-500 rounded-full blur-[1px]"
            animate={{
              y: [0, -8, -12],
              opacity: [0, 0.5, 0],
              scaleY: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5,
            }}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <h3 className="text-lg font-bold text-coffee-900 dark:text-white font-serif tracking-wide">
          Coffee & Co.
        </h3>
        <p className="text-sm text-coffee-500 dark:text-coffee-400 mt-1 animate-pulse">
          {text}
        </p>
      </motion.div>
    </div>
  );
};

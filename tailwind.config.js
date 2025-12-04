/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}", // For root files like App.tsx
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // === Semantic UI Colors ===
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Primary - Main brand color (coffee theme)
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Secondary - Supporting brand color
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // Accent - Highlight color (yellow/gold)
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        // Muted - Subdued backgrounds
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        // Card & Popover
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        // === Status Colors ===
        // Success - For success/safe messages
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        // Warning - For warning/caution messages
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        // Error/Destructive - For error/danger messages
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        // Info - For informative messages
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },

        // === Brand Palette ===
        coffee: {
          50: "#EFEBE9",
          100: "#D7CCC8",
          200: "#BCAAA4",
          300: "#A1887F",
          400: "#8D6E63",
          500: "#795548",
          600: "#6D4C41",
          700: "#5D4037",
          800: "#4E342E",
          900: "#3E2723",
          950: "#281815",
        },
        cream: {
          50: "#FAF9F6",
          100: "#F5F5F5",
          200: "#EAEAEA",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: ['"Inter"', "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

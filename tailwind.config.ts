import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#94A684",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E4E4D0",
          foreground: "#333333",
        },
        accent: {
          DEFAULT: "#AEC3AE",
          foreground: "#333333",
        },
        muted: {
          DEFAULT: "#F5F5F5",
          foreground: "#666666",
        },
        destructive: {
          DEFAULT: "#FF4444",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "white",
          foreground: "#333333",
        },
      },
      borderRadius: {
        lg: "1.25rem",
        md: "1rem",
        sm: "0.75rem",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0, 0, 0, 0.05)",
      },
      zIndex: {
        dropdown: "1000",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
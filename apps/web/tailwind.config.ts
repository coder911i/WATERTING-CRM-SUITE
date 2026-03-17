import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          ...defaultTheme.fontFamily.sans,
        ],
        mono: [
          "SF Mono",
          "Monaco",
          "Inconsolata",
          "Fira Code",
          ...defaultTheme.fontFamily.mono,
        ],
      },
      colors: {
        primary: {
          50: "#E3F2FD",
          100: "#BBDEFB",
          200: "#90CAF9",
          300: "#64B5F6",
          400: "#42A5F5",
          500: "#2196F3",
          600: "#1E88E5",
          700: "#1B60E0",
          800: "#0D47A1",
          900: "#081C51",
        },
        neutral: {
          0: "#FFFFFF",
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
      },
      borderRadius: {
        xs: "2px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px", letterSpacing: "0" }],
        sm: ["13px", { lineHeight: "20px", letterSpacing: "0" }],
        base: ["14px", { lineHeight: "21px", letterSpacing: "0" }],
        lg: ["15px", { lineHeight: "24px", letterSpacing: "0" }],
        xl: ["18px", { lineHeight: "26px", letterSpacing: "-0.01em" }],
        "2xl": ["20px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
        "3xl": ["24px", { lineHeight: "34px", letterSpacing: "-0.01em" }],
        "4xl": ["28px", { lineHeight: "36px", letterSpacing: "-0.015em" }],
        "5xl": ["32px", { lineHeight: "38px", letterSpacing: "-0.02em" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0, 0, 0, 0.05)",
        sm: "0 1px 3px rgba(0, 0, 0, 0.08)",
        base: "0 2px 4px rgba(0, 0, 0, 0.1)",
        md: "0 4px 12px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 25px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px rgba(0, 0, 0, 0.15)",
      },
      transitionDuration: {
        100: "100ms",
        200: "200ms",
        300: "300ms",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#137fec", // Updated primary from Community design
        "primary-dark": "#0b63b8",
        "primary-light": "#e0f2fe",
        "primary-hover": "#1d4ed8",
        "soft-blue": "#eff4ff",
        "secondary": "#64748b",
        "background-light": "#f0f2f5", // Updated background from Community design
        "background-dark": "#101922", // Updated background from Community design
        "surface-light": "#ffffff",
        "surface-dark": "#1e293b",
        "text-main": "#111418", // Updated text color
        "text-secondary": "#617589", // Updated text color
        "accent-blue": "#38bdf8",
        "card-light": "#ffffff",
      },
      fontFamily: {
        "display": ["Inter", "Work Sans", "sans-serif"] // Added Inter
      },
      borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px"},
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)',
        'glow': '0 0 15px rgba(14, 165, 233, 0.3)',
        'hover': '0 10px 25px -5px rgba(59, 130, 246, 0.15), 0 8px 10px -6px rgba(59, 130, 246, 0.1)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
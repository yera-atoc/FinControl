/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F5F5F7",
        card: "#FFFFFF",
        ink: "#1D1D1F",
        inkSoft: "#86868B",
        inkFaint: "#AEAEB2",
        accentBlue: "#0071E3",
        accentBlueSoft: "#E8F1FD",
        accentGreen: "#1FA24B",
        accentGreenSoft: "#E6F7EA",
        accentRed: "#FF3B30",
        accentRedSoft: "#FFEBEA",
        accentOrange: "#FF9500",
        accentOrangeSoft: "#FFF3E1",
        line: "#E5E5E7",
        segment: "#EDEDF0",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

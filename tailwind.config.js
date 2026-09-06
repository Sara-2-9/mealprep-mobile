/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        canvas: "#FDFFFB",
        surface: "#F2F2F7",
        ink: "#000000",
        muted: "#3C3C43",
        accent: "#34C759"
      },
      borderRadius: { card: "20px" },
      fontFamily: {
        promo: ["Promo-Regular"],
        "promo-medium": ["Promo-Medium"],
        "promo-semibold": ["Promo-SemiBold"],
        "promo-bold": ["Promo-Bold"]
      }
    }
  },
  plugins: []
};

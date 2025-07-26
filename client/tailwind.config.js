// tailwind.config.js
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        fisheye: "fisheye 0.3s ease-in-out",
      },
      keyframes: {
        fisheye: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },
      boxShadow: {
        neon: "0 0 10px #3b82f6",
      },
    },
  },
  plugins: [],
};

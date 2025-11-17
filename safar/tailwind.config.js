module.exports = {
  content: ["./**/*.html"],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 1s ease-in forwards",
        slideInUp: "slideInUp 1s ease-out forwards",
        popIn: "popIn 0.5s ease-in-out forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        slideInUp: {
          from: { transform: "translateY(30px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 }
        },
        popIn: {
          "0%": { transform: "scale(0.8)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 }
        }
      }
    }
  },
  plugins: [],
};
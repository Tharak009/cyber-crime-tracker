export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf7",
          100: "#d6f4ea",
          500: "#0e8f69",
          700: "#0b6b51",
          900: "#09392d"
        },
        slateX: "#0f172a",
        accent: "#e85d04"
      },
      boxShadow: {
        panel: "0 20px 45px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};

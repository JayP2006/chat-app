/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {animation: {
      float: "float 10s infinite ease-in-out",
    },
    keyframes: {
      float: {
        '0%, 100%': { transform: "translateY(0)" },
        '50%': { transform: "translateY(-20px)" },
      },
    },},
  },
  plugins: [require('daisyui')],
}
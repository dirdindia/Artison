/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          brown: '#451a03',
          dark: '#2d1102',
          cream: '#fff8f6',
          gold: '#c29b38',
          surface: '#fcf8f6',
          border: '#ecdcd6'
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f6ff',
          100: '#e0edff',
          200: '#bae0ff',
          300: '#7cc2ff',
          400: '#369eff',
          500: '#0c7bf7',
          600: '#005ed9',
          700: '#1d4ed8', // Dark blue highlight
          800: '#1e3a8a', // Dark blue primary
          900: '#0f172a', // Deep slate / dark navy
          950: '#090d16',
        }
      }
    },
  },
  plugins: [],
}

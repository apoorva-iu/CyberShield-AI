/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          900: '#070b14',
          800: '#0d1527',
          700: '#14203d',
          accent: '#00f0ff',
          neonGreen: '#00ff88',
          neonRed: '#ff2a5f',
          neonAmber: '#ffaa00'
        }
      }
    },
  },
  plugins: [],
}
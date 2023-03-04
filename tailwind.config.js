/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      'golos': ['Golos', 'sans-serif'],
      'ibm-thai': ['IBM Plex Sans Thai', 'sans-serif']
    }
  },
  plugins: [],
}
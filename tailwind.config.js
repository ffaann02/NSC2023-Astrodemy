/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      cursor:{
        'draw':'url(https://cdn-icons-png.flaticon.com/512/1828/1828911.png)'
      }
    },
    fontFamily: {
      'golos': ['Golos', 'sans-serif'],
      'ibm-thai': ['IBM Plex Sans Thai', 'sans-serif']
    },
    
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */

// Spider-Man theme: the site's `blue-*` accent classes render as suit red,
// and `gray-*` surfaces render as the suit's midnight navy.
const spideyRed = {
  50: '#fef2f2',
  100: '#fde3e3',
  200: '#fccaca',
  300: '#f9a3a3',
  400: '#f45b5b',
  500: '#e23636',
  600: '#c8102e',
  700: '#a50d25',
  800: '#7f0b1d',
  900: '#4f0a14',
  950: '#2e040b',
};

const spideyNavy = {
  50: '#f4f6fb',
  100: '#e8ecf5',
  200: '#d2d9e8',
  300: '#a9b5cf',
  400: '#7c8aab',
  500: '#56648a',
  600: '#3a4770',
  700: '#243258',
  750: '#1b2749',
  800: '#131c38',
  900: '#0a1026',
  950: '#050818',
};

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: spideyRed,
        gray: spideyNavy,
        spidey: {
          red: '#e23636',
          'red-dark': '#c8102e',
          blue: '#1f4fbf',
          navy: '#0a1026',
          web: '#e8ecf5',
        },
      },
      fontFamily: {
        comic: ['var(--font-comic)', 'Impact', 'Arial Black', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

const colors = require('tailwindcss/colors');

// Monochrome (zinc) with a single indigo accent. Components use `gray-*` for
// surfaces/text and `blue-*` for the accent, so remapping both here keeps the
// whole site on a single, deliberate palette.
/** @type {import('tailwindcss').Config} */
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
        gray: { ...colors.zinc, 750: '#323238' },
        blue: colors.indigo,
        green: colors.indigo,
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

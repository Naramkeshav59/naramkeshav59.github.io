const colors = require('tailwindcss/colors');

// One neutral (slate) and one accent (teal). Components use `gray-*` for
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
        gray: { ...colors.slate, 750: '#283548' },
        blue: colors.teal,
        green: colors.teal,
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

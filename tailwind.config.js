/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,js}', './views/**/*.ejs'],
  theme: {
    extend: {
      // vos extensions de thème
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('@tailwindcss/aspect-ratio'),
    require('daisyui'),
    require('tailwind-scrollbar-hide'),
  ],
};

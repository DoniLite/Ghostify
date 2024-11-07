/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */


/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{ts,js}', './views/**/*.ejs'];
export const theme = {
  extend: {},
};
export const plugins = [
  require('@tailwindcss/typography'),
  require('@tailwindcss/forms')({ strategy: 'class' }),
  require('@tailwindcss/aspect-ratio'),
  require('daisyui'),
  require('tailwind-scrollbar-hide'),
];

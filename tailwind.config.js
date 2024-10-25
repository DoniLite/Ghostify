import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
import aspectratio from '@tailwindcss/aspect-ratio';
import lineClamp from '@tailwindcss/line-clamp';
import daisyui from 'daisyui';
/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{ts,js}', './views/**/*.ejs'];
export const theme = {
  extend: {},
};
export const plugins = [
  typography,
  forms({ strategy: 'class' }),
  aspectratio,
  lineClamp,
  daisyui,
];

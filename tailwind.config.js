import typography from './node_modules/@tailwindcss/typography';
import forms from './node_modules/@tailwindcss/forms';
import aspectratio from './node_modules/@tailwindcss/aspect-ratio';
import lineClamp from './node_modules/@tailwindcss/line-clamp';
import daisyui from './node_modules/daisyui';
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

import 'vite/modulepreload-polyfill';

export const g = (b: string) => b;

console.log(g('hello world'));

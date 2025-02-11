import 'vite/modulepreload-polyfill';
import Quill from 'quill';

const quill = new Quill('#editor');
console.log(quill);
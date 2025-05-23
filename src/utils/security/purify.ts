import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export const unify = async (str: string) => {
  const { window } = new JSDOM('');
  const purify = DOMPurify(window);
  const result = await marked(str);
  return purify.sanitize(result);
};

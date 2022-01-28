import DOMPurify from 'isomorphic-dompurify';
import parse from 'html-react-parser';

export function renderHTML(dirt) {
  const clean = DOMPurify.sanitize(dirt);

  return parse(clean);
}

import DOMPurify from 'isomorphic-dompurify';
import parse from 'html-react-parser';

export function renderHTML(dirt) {
  const clean = DOMPurify.sanitize(dirt, { USE_PROFILES: { html: true } });

  return parse(clean);
}

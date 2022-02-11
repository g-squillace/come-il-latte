import slugify from '@sindresorhus/slugify';

export function anchorId(block) {
  const label = block.menuLabel
  return slugify(block.menuLabel)
}

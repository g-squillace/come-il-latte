import Carousel from 'components/Carousel';
import Cover from 'components/Cover';
import Flag from 'components/Flag';
import Focus from 'components/Focus';
import HeroImage from 'components/HeroImage';
import Product from 'components/Product';
import Quote from 'components/Quote';
import Text from 'components/Text';

function renderBlock(block) {
  switch (block._modelApiKey) {
    case 'carousel_block':
      return (
        <Carousel block={block} key={block.id} />
      );

    case 'cover_block':
      return (
        <Cover block={block} key={block.id} />
      );

    case 'flag_block':
      return (
        <Flag block={block} key={block.id} />
      );

    case 'focus_block':
      return (
        <Focus block={block} key={block.id} />
      );

    case 'hero_image_block':
      return (
        <HeroImage block={block} key={block.id} />
      );

    case 'product_block':
      return (
        <Product block={block} key={block.id} />
      );

    case 'quote_block':
      return (
        <Quote block={block} key={block.id} />
      );

    case 'text_block':
      return (
        <Text block={block} key={block.id} />
      );
  }
}

export default function Blocks({ blocks }) {
  return (
    blocks && Object.values(blocks).map((block) => (
      renderBlock(block)
    ))
  );
}

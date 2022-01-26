import Cover from 'components/Cover';
import Flag from 'components/Flag';
import Focus from 'components/Focus';
import Hero from 'components/Hero';
import Text from 'components/Text';

function renderBlock(block) {
  switch (block._modelApiKey) {
    case 'flag_block':
      return (
        <Flag block={block} key={block.id} />
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

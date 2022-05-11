import { renderHTML } from "lib/html";
import { uppercaseClass } from 'lib/visual';
import { anchorId } from "lib/anchors";
import { useInView } from 'react-intersection-observer';

export default function Text({ block, visual }) {
  const alignClass = block.alignCenter ? 'text-center mx-auto ' : '';

  const { ref, inView, entry } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const inViewClass = inView ? 'fade-down-on' : 'fade-down-off';

  return (
    <section
      id={anchorId(block)}
      ref={ref}
      className={`${inViewClass} fade-down container scroll-mt-20 my-12 lg:my-24 xl:my-36`}
    >
      <h2 className={`${alignClass} ${uppercaseClass(visual)} font-heading font-medium text-accent max-w-2xl text-xl mb-6 xl:text-2xl xl:mb-12`}>
        {block.title}
      </h2>
      <div className={`${alignClass} max-w-xl xl:text-lg`}>
        {renderHTML(block.text)}
        {block.link && (
          <div className='mt-8'>
            <a className='inline-flex rounded bg-accent text-rev uppercase tracking-wide transition-opacity hover:opacity-80 text-sm py-4 px-6 xl:text-lg'
              href={block.link.url}
              target="_blank"
              rel="noreferrer noopener"
              title={`${i18n.linkExternal.label[locale]} ${block.link.label}`}
            >{block.link.label}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

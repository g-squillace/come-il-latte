import { renderHTML } from "lib/html";
import { anchorId } from "lib/anchors";
import { useInView } from 'react-intersection-observer';

export default function Text({ block }) {
  const alignClass = block.alignCenter ? 'text-center mx-auto ' : '';

  const { ref, inView, entry } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const inViewClass = inView ? 'fade-down-on' : 'fade-down-off'

  return (
    <section
      id={anchorId(block)}
      ref={ref}
      className={`${inViewClass} fade-down container scroll-mt-20 my-12 lg:my-24 xl:my-36`}
    >
      <h2 className={`${alignClass} font-heading font-medium text-accent uppercase max-w-2xl text-xl mb-6 xl:text-2xl xl:mb-12`}>
        {block.title}
      </h2>
      <div className={`${alignClass} max-w-xl xl:text-lg`}>
        {renderHTML(block.text)}
      </div>
    </section>
  );
}

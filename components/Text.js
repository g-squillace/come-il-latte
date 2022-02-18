import { renderHTML } from "lib/html";
import { anchorId } from "lib/anchors";
import { useInView } from 'react-intersection-observer';

export default function Text({ block }) {
  const { ref, inView, entry } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const inViewClass = inView ? 'opacity-100' : 'opacity-0'

  return (
    <section
      id={anchorId(block)}
      ref={ref}
      className={`${inViewClass} container scroll-mt-20 transition-opacity duration-500 delay-200 py-12 lg:py-24 xl:py-36`}
    >
      <h2 className="font-heading font-medium text-accent uppercase text-xl mb-6 xl:text-2xl xl:mb-12">
        {block.title}
      </h2>
      <div className="max-w-xl xl:text-lg">
        {renderHTML(block.text)}
      </div>
    </section>
  );
}

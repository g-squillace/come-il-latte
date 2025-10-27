import { renderHTML } from "lib/html";
import { anchorId } from "lib/anchors";
import Widget from "components/blocks/Widget";
import { useInView } from "react-intersection-observer";
import { uppercaseClass } from "lib/visual";
import Image from "next/image";

export default function Focus({ block, visual, icecream }) {
  const { ref, inView, entry } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const inViewClass = inView ? "fade-down-on" : "fade-down-off";

  return (
    <section
      id={anchorId(block)}
      className="container list scroll-mt-20 lg:scroll-mt-30 xl:scroll-mt-40 my-12 lg:my-24 xl:my-36"
    >
      <div
        ref={ref}
        className={`${inViewClass} fade-down max-w-xl lg:max-w-2xl xl:max-w-5xl mx-auto text-center mb-12`}
      >
        <h2
          className={`${uppercaseClass(
            visual
          )} font-heading font-medium text-accent break-words text-2xl mb-6 xl:text-2xl xl:mb-12`}
        >
          {block.title}
        </h2>
        <div className="xl:text-lg opacity-70">{renderHTML(block.text)}</div>
      </div>
      <div className="md:columns-2 items-start">
        {icecream &&
          Object.values(icecream).map((i) => (
            <div key={i.id} className="mb-2">
              <h2 className="text-xl uppercase text-center w-full bg-black py-2 block text-accent mb-2">
                {i.title}
              </h2>
              <div className="text-sm mb-2">{renderHTML(i.list)}</div>
            </div>
          ))}
      </div>
    </section>
  );
}

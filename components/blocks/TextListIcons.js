import { renderHTML } from "lib/html";
import { uppercaseClass } from "lib/visual";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

export default function TextListIcons({ block, visual, key, locale }) {
  const { ref, inView, entry } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const labelClass = block.colorsRev ? "text-accent-rev" : "text-accent";
  const colorsClass = block.colorsRev ? "bg-back-rev text-rev" : "text-alt";
  const spacingClass = block.colorsRev
    ? "py-8 lg:py-24 xl:py-36"
    : "my-8 lg:my-24 xl:my-36";

  const inViewClass = inView ? "fade-down-on" : "fade-down-off";

  return (
    <section ref={ref} className={`${colorsClass} ${spacingClass}`}>
      <div className="text-center container">
        {block.prefix && (
          <div
            className={`${labelClass} font-bold text-xs uppercase tracking-widest my-2`}
          >
            {block.prefix}
          </div>
        )}
        <h2
          className={`${uppercaseClass(
            visual
          )} font-heading font-medium break-words text-xl my-4 xl:text-2xl lg:my-10 xl:my-16 lg:max-w-2xl xl:max-w-3xl lg:mx-auto`}
        >
          {block.title}
        </h2>
        <div className="grid gap-4 my-4 xl:my-6 md:grid-cols-2 gap-x-16 lg:max-w-4xl lg:mx-auto">
          {block.blocks.map((b) => (
            <div
              className="flex gap-4 border-b border-dashed border-alt/70 py-2 pt-4 items-center md:pt-4 lg:pr-4 lg:pb-4"
              key={b.id}
            >
              <div className="w-8 h-8 relative flex-none mt-0.5">
                <Image
                  src={b.icon.url}
                  alt={b.title}
                  layout="fill"
                  aria-hidden={true}
                />
              </div>
              <div className="xl:text-lg text-left">{b.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

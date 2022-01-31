import { renderHTML } from "lib/html";
import { Image } from "react-datocms";

export default function Flag({ block }) {
  const image = block.image;
  const alignClass = block.alignReverse ? 'flex-row-reverse' : '';
  const backgroundClass = block.colorsAlt ? 'bg-back-alt text-alt' : '';

  return (
    <section className={`${backgroundClass} py-8 lg:py-24 xl:py-36`}>
      <div className={`${alignClass} container lg:flex lg:items-center lg:gap-12 xl:gap-24`}>
        <div className="flex-1 my-8">
          <div className="font-bold text-xs text-accent uppercase tracking-widest my-2">{block.label}</div>
          <h2 className="font-heading font-medium uppercase text-lg my-4 xl:text-xl xl:my-6">{block.title}</h2>
          <div className="font-heading xl:text-lg">{renderHTML(block.text)}</div>
        </div>
        <div className="flex-1 my-8 lg:my-0">
          <div className="lg:px-12">
            <Image data={image.responsiveImage} alt={image.alt} title={image.title} />
          </div>
        </div>
      </div>
    </section>
  );
}

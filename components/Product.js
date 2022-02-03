import { renderHTML } from "lib/html";
import { Image } from "react-datocms";

export default function Product({ block }) {
  const image = block.image;
  const alignClass = block.alignRev ? 'flex-row-reverse' : '';

  return (
    <section className="py-8 lg:py-24 xl:py-36">
      <div className={`${alignClass} container lg:flex lg:items-center lg:gap-12 xl:gap-24`}>
        <div className="flex-1 my-8">
          <div className="font-bold text-xs text-accent uppercase tracking-widest my-2">
            {block.label}
          </div>
          <h2 className="font-heading font-medium uppercase text-xl my-4">
            {block.title}
          </h2>
          <div className="my-3 text-alt">
            {renderHTML(block.text)}
          </div>
          <h3 className="font-medium uppercase text-sm my-3">
            {block.subTitle}
          </h3>
          <div className="my-3 text-alt">
            {renderHTML(block.subText)}
          </div>
          <div>
            {block.smallImages && Object.values(block.smallImages).map((smallImage) => (
              <Image
                data={smallImage.responsiveImage}
                alt={smallImage.alt}
                title={smallImage.title}
              />
            ))}
          </div>
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

import { Image } from "react-datocms";

export default function Flag({ block }) {
  const image = block.image
  return (
    <section className={`${block.reverse ? 'flex-row-reverse' : ''} container py-8 lg:py-24 lg:flex lg:items-center lg:gap-12 xl:gap-24 xl:py-36`}>
      <div className="flex-1 my-8">
        <div className="font-bold text-xs text-accent uppercase tracking-widest my-2">{block.label}</div>
        <h2 className="font-heading font-medium text-alt uppercase text-lg my-4 xl:text-xl xl:my-6">{block.title}</h2>
        <p className="font-heading text-alt xl:text-lg">{block.text}</p>
      </div>
      <div className="flex-1 my-8 lg:my-0">
        <div className="lg:px-12">
          <Image data={image.responsiveImage} alt={image.alt} title={image.title} />
        </div>
      </div>
    </section>
  );
}

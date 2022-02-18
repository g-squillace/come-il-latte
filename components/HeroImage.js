import { Image } from "react-datocms";

export default function HeroImage({ block }) {
  const image = block.image;
  const alignClass = block.alignCenter ? 'text-center mx-auto ' : '';

  return (
    <header className="mx-auto max-w-screen-2xl relative after:absolute after:z-10 after:inset-0 after:bg-gradient-to-t after:from-black/60">
      <Image
        data={image.responsiveImage}
        alt={image.alt}
        title={image.title}
        layout="fill"
        objectFit="cover"
        className="cover"
      />
      <div className="absolute z-20 inset-x-0 bottom-0 container">
        <h1 className={`${alignClass} max-w-[17ch] font-medium font-heading uppercase text-white py-4 text-xl lg:py-8 lg:text-2xl xl:text-3xl`}>
          {block.title}
        </h1>
      </div>
    </header>
  );
}

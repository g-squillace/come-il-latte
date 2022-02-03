import { Image } from "react-datocms";

export default function HeroImage({ block }) {
  const image = block.image;
  const alignClass = block.alignCenter ? 'text-center mx-auto ' : '';
  return (
    <header className="mx-auto max-w-screen-2xl relative ">
      <Image
        data={image.responsiveImage}
        alt={image.alt}
        title={image.title}
        layout="responsive"
        objectFit="cover"
        className="w-full h-72 md:h-96 lg:h-128 xl:h-160"
      />
      <div className="absolute z-10 inset-0 bg-gradient-to-t from-black/50"></div>
      <div className="absolute z-20 inset-x-0 bottom-0 container bg-gradient-to-t from-black/50">
        <h1 className={`${alignClass} max-w-[17ch] font-medium font-heading uppercase text-white py-4 text-xl lg:py-8 lg:text-2xl xl:text-3xl`}>
          {block.title}
        </h1>
      </div>
    </header>
  );
}

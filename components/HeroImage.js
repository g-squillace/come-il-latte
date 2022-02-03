import { Image } from "react-datocms";

export default function HeroImage({ block }) {
  const image = block.image;
  return (
    <header className="mx-auto max-w-screen-2xl relative ">
      <Image
        data={image.responsiveImage}
        alt={image.alt}
        title={image.title}
        layout="responsive"
        objectFit="cover"
        className="h-full w-full h-72 md:h-96 lg:h-160"
      />
      <div className="absolute z-10 inset-0 bg-gradient-to-t from-black/50"></div>
      <div className="absolute z-20 inset-x-0 bottom-0 container">
        <h1 className="text-white text-3xl font-medium font-heading">
          {block.title}
        </h1>
      </div>
    </header>
  );
}

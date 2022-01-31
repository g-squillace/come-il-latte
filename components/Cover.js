import { Image } from "react-datocms";

export default function Cover({ block }) {
  return (
    <div className="">
      {block.images && Object.values(block.images).map((image) => (
        <Image
          key={image}
          data={image.responsiveImage}
          alt={image.alt}
          title={image.title}
        />
      ))}
    </div>
  );
}

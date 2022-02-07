import { renderHTML } from "lib/html";
import { Image } from "react-datocms";

export default function Widget({ block }) {
  const image = block.image;
  return (
    <section className="container text-center my-24 lg:my-0">
      <Image
        data={image.responsiveImage}
        alt={image.alt}
        title={image.title}
      />
      <h3 className="font-heading font-medium uppercase break-words text-lg my-4 xl:text-[25px]">
        {block.title}
      </h3>
      <div className="text-sm">
        {renderHTML(block.text)}
      </div>
    </section>
  );
}

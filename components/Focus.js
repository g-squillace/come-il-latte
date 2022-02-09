import { renderHTML } from "lib/html";
import Widget from 'components/Widget';

export default function Focus({ block }) {
  return (
    <section className="container py-12 lg:py-24 xl:py-36">
      <div className="max-w-xl mx-auto text-center mb-12 lg:mb-24 xl:mb-36">
        <h2 className="font-heading font-medium text-accent break-words uppercase text-2xl mb-6 xl:text-2xl xl:mb-12">
          {block.title}
        </h2>
        <div className="xl:text-lg">
          {renderHTML(block.text)}
        </div>
      </div>
      <div className="lg:flex lg:justify-between lg:gap-12 xl:gap-18">
        {block.elements && Object.values(block.elements).map((element) => (
          <Widget block={element} key={element.id} />
        ))}
      </div>
    </section>
  );
}

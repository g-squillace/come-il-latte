export default function Quote({ block }) {
  return (
    <section className="container py-12 lg:py-24 xl:py-36">
      <div className="font-heading font-medium text-accent uppercase text-xl mb-6 xl:text-2xl xl:mb-12">
        {block.text}
      </div>
      <div className="font-heading max-w-xl xl:text-lg">
        {block.authorName}
      </div>
    </section>
  );
}

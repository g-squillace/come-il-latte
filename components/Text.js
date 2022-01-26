export default function Text({ block }) {
  return (
    <section className="container py-12 lg:py-24 xl:py-36">
      <h2 className="font-heading font-medium text-accent uppercase text-xl mb-6 xl:text-2xl xl:mb-12">{block.title}</h2>
      <p className="font-heading max-w-xl xl:text-lg">{block.text}</p>
    </section>
  );
}

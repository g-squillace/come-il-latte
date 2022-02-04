export default function Quote({ block }) {
  return (
    <section className="container text-center py-12 lg:py-24 xl:py-36">
      <div className="font-heading text-alt mb-6 lg:text-lg xl:mb-12">
        {block.text}
      </div>
      <div className="font-bold text-xs uppercase text-accent tracking-widest my-2">
        {block.authorName}
      </div>
    </section>
  );
}

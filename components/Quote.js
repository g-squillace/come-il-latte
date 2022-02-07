export default function Quote({ block }) {
  return (
    <section className="container text-center relative mt-12 py-20 lg:mt-24 lg:py-36 before:content-['\201c'] before:text-accent before:absolute before:text-[6rem] before:leading-none before:left-1/2 before:-translate-x-1/2 before:-top-0 lg:before:text-[10rem]">
      <div className="font-heading italic text-alt max-w-prose mx-auto mb-6 lg:text-lg xl:mb-12">
        {block.text}
      </div>
      <div className="font-bold text-xs uppercase text-accent tracking-widest my-2">
        {block.authorName}
      </div>
    </section>
  );
}

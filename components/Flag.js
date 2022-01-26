export default function Flag({reverse}) {
  return (
    <section className={`${reverse ? 'flex-row-reverse' : ''} container py-8 lg:py-24 lg:flex lg:items-center lg:gap-12 xl:gap-24 xl:py-36`}>
      <div className="my-8 my-8 flex-1">
        <div className="font-bold text-xs text-accent uppercase tracking-widest my-2">Conte di Castignano</div>
        <h2 className="font-heading font-medium text-alt uppercase text-lg my-4 xl:text-xl xl:my-6">Tradizione vinicola unita dalla innovazione</h2>
        <p className="font-heading text-alt xl:text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ultrices commodo nunc cras vitae pretium arcu sagittis lectus. Arcu, mollis et lacus aenean vestibulum, rhoncus bibendum viverra. Urna et aliquam sed ut commodo interdum id.</p>
      </div>
      <div className="my-8 my-8 lg:my-0 flex-1">
        <div className="lg:px-12">
          <div className="aspect-[3/4] bg-accent"></div>
        </div>
      </div>
    </section>
  );
}

import Widget from 'components/Widget';

export default function Focus() {
  return (
    <section className="container py-12 lg:py-24 xl:py-36">
      <div className="max-w-xl mx-auto text-center mb-12 lg:mb-24 xl:mb-36">
        <h2 className="font-heading font-medium text-accent uppercase text-xl mb-6 xl:text-2xl xl:mb-12">Vini</h2>
        <p className="font-heading text-alt xl:text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ultrices commodo nunc cras vitae pretium arcu sagittis lectus. Arcu, mollis et lacus aenean vestibulum, rhoncus bibendum viverra. Urna et aliquam sed ut commodo interdum id.</p>
      </div>
      <div className="lg:flex lg:justify-between lg:gap-12 xl:gap-24">
        <Widget />
        <Widget />
        <Widget />
      </div>
    </section>
  );
}

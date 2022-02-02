export default function HeroImage({ block }) {
  return (
    <header className="container">
      <h1 className="text-3xl font-medium font-heading">
        {block.title}
      </h1>
    </header>
  );
}

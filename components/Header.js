import Image from 'next/image';

export default function Header({ design, site }) {
  const siteName = site.globalSeo.siteName
  const logoUrl = design.logo.url
  return (
    <header className="">
      <Image src={logoUrl} alt={`Logo ${siteName}`} width={200} height={80} />
      <nav>
      </nav>
    </header>
  );
}

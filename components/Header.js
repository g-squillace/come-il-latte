import Image from 'next/image';

export default function Header({ design, site }) {
  const siteName = site.globalSeo.siteName
  const logoUrl = design.logo.url
  return (
    <header className="container py-2 xl:py-4">
      <div className="max-w-[160px] xl:max-w-[220px]">
        <Image src={logoUrl} alt={`Logo ${siteName}`} width={220} height={80} layout='responsive' />
      </div>
      <nav>
      </nav>
    </header>
  );
}

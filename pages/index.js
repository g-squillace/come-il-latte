import Head from 'next/head'
import { Image, renderMetaTags } from "react-datocms";
import { request } from "lib/datocms";

import Header from 'components/Header';
import Footer from 'components/Footer';

import Cover from 'components/Cover';
import Flag from 'components/Flag';
import Focus from 'components/Focus';
import Hero from 'components/Hero';
import Text from 'components/Text';

const HOMEPAGE_QUERY = `query HomePage{
  site: _site {
    favicon: faviconMetaTags {
      attributes
      content
      tag
    }
  }
  customDesign {
    logo {
      url
    }
    colorText {
      red
      green
      blue
    }
    colorTextAlt {
      red
      green
      blue
    }
    colorBack {
      red
      green
      blue
    }
    colorBackAlt {
      red
      green
      blue
    }
    colorAccent {
      red
      green
      blue
    }
  }
  landing {
    title
    seo: _seoMetaTags {
      attributes
      content
      tag
    }
  }
}`;

export async function getStaticProps() {
  const data = await request({
    query: HOMEPAGE_QUERY
  });
  return {
    props: { data }
  };
}

export default function Home({ data }) {
  const site = {...data.site}
  const page = {...data.landing}
  const design = {...data.customDesign}
  const colorText = {...design.colorText}
  const colorTextAlt = {...design.colorTextAlt}
  const colorBack = {...design.colorBack}
  const colorBackAlt = {...design.colorBackAlt}
  const colorAccent = {...design.colorAccent}
  return (
    <div>
      <style global jsx>{`
        :root {
          --color-text: ${colorText.red} ${colorText.green} ${colorText.blue};
          --color-text-alt: ${colorTextAlt.red} ${colorTextAlt.green} ${colorTextAlt.blue};
          --color-back: ${colorBack.red} ${colorBack.green} ${colorBack.blue};
          --color-back-alt: ${colorBackAlt.red} ${colorBackAlt.green} ${colorBackAlt.blue};
          --color-accent: ${colorAccent.red} ${colorAccent.green} ${colorAccent.blue};
          --font-heading: 'Sang Bleau';
          --font-body: 'Inter';
        }
      `}</style>

      <Head>
        {renderMetaTags(page.seo.concat(site.favicon))}

        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header />

      <main id="content">
        <Hero />
        <Cover />
        <Flag />
        <Flag reverse={true}/>
        <Cover />
        <Text />
        <Focus />
      </main>
      <Footer />
    </div>
  )
}

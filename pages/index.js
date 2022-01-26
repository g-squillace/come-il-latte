import Head from 'next/head'
import { renderMetaTags } from "react-datocms";
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
    globalSeo {
      siteName
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
    seo: _seoMetaTags {
      attributes
      content
      tag
    }
    title
    blocks {
      ... on FlagBlockRecord {
        id
        _modelApiKey
        label
        text
        title
        reverse
        image {
          responsiveImage(sizes: "(min-width: 1024px) 50vw, 100vw", imgixParams: { fit: max, w: 620, h: 730, auto: [format,compress] }) {
            srcSet
            webpSrcSet
            sizes
            src
            width
            height
            aspectRatio
            alt
            title
            base64
          }
        }
      }
      ... on TextBlockRecord {
        id
        _modelApiKey
        title
        text
      }
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

function renderBlock(block) {
  switch (block._modelApiKey) {
    case 'flag_block':
      return (
        <Flag block={block} key={block.id} />
      );

    case 'text_block':
      return (
        <Text block={block} key={block.id} />
      );
  }
}

export default function Home({ data }) {
  const site = {...data.site}
  const page = {...data.landing}
  const blocks = {...page.blocks}
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
      </Head>

      <Header design={design} site={site} />
      <main id="content">
        {Object.values(blocks).map((block) => (
          renderBlock(block)
        ))}
      </main>
      <Footer />
    </div>
  )
}

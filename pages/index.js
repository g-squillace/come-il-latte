import Head from 'next/head'
import { renderMetaTags } from "react-datocms";
import { request } from "lib/datocms";
import { useRouter } from 'next/router';

import CustomCssVars from 'components/CustomCssVars'

import Header from 'components/Header';
import Footer from 'components/Footer';
import Blocks from 'components/Blocks';

const HOMEPAGE_QUERY = `query HomePage{
  site: _site {
    favicon: faviconMetaTags {
      attributes
      content
      tag
    }
    locales
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
        alignReverse
        colorsAlt
        image {
          responsiveImage(sizes: "(min-width: 1024px) 50vw, 100vw", imgixParams: { fit: max, w: 800, h: 800, auto: [format,compress] }) {
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

export default function Home({ data }) {
  const router = useRouter()
  const locale = router.locale
  const site = {...data.site}
  const page = {...data.landing}
  const blocks = {...page.blocks}
  const design = {...data.customDesign}
  return (
    <div>
      <CustomCssVars data={design} />
      <Head>
        {renderMetaTags(page.seo.concat(site.favicon))}
      </Head>

      <Header design={design} site={site} locale={locale} />
      <main id="content">
        <Blocks blocks={blocks} />
      </main>

      <Footer />
    </div>
  )
}

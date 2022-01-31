import Head from 'next/head'
import { renderMetaTags } from 'react-datocms';
import { request } from 'lib/datocms';
import { responsiveImageFragment } from 'lib/fragments';
import { useRouter } from 'next/router';
import { setGoogleFonts } from 'lib/fonts';

import CustomCssVars from 'components/CustomCssVars'

import Header from 'components/Header';
import Footer from 'components/Footer';
import Blocks from 'components/Blocks';
import SkipLinks from 'components/SkipLinks'

export async function getStaticProps({ locale }) {
  const formattedLocale = locale.split("-")[0];
  const graphqlRequest = {
    query: `
      {
        site: _site(locale: ${formattedLocale}) {
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
        design: customDesign {
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
          fontBody
          fontHeading
        }
        page: landing(locale: ${formattedLocale}) {
          seo: _seoMetaTags {
            attributes
            content
            tag
          }
          title
          blocks {
            ... on CoverBlockRecord {
               id
               _modelApiKey
               images {
                 id
                 responsiveImage(sizes: "100vw", imgixParams: { fit: crop, w: 1920, h: 800, auto: [format,compress] }) {
                   ...responsiveImageFragment
                 }
               }
             }
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
                  ...responsiveImageFragment
                }
              }
            }
            ... on FocusBlockRecord {
              id
              _modelApiKey
              title
              text
              elements {
                id
                title
                text
                image {
                  responsiveImage(sizes: "(min-width: 1024px) 33vw, 100vw", imgixParams: { fit: crop, w: 800, h: 800, auto: [format,compress] }) {
                    ...responsiveImageFragment
                  }
                }
              }
            }
            ... on QuoteBlockRecord {
              id
              _modelApiKey
              text
              authorName
            }
            ... on TextBlockRecord {
              id
              _modelApiKey
              title
              text
            }
          }
        }
      }
      ${responsiveImageFragment}
    `
  };

  return {
    props: {
      data: await request(graphqlRequest),
    },
  };
}

export default function Home({ data }) {
  const locale  = useRouter().locale;
  const { site, page, design } = data;
  return (
    <div>
      <CustomCssVars data={design} />
      <Head>
        {renderMetaTags(page.seo.concat(site.favicon))}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
        {setGoogleFonts(design)}
      </Head>

      <SkipLinks locale={locale} />

      <Header design={design} site={site} locale={locale} />
      <main id="content">
        <Blocks blocks={page.blocks} />
      </main>

      <Footer />
    </div>
  )
}

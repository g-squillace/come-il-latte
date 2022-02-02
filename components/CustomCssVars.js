function rgbColor(color) {
  return `${color.red} ${color.green} ${color.blue}`
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(color) {
  return "#" + componentToHex(color.red) + componentToHex(color.green) + componentToHex(color.blue);
}

function sizeToPx(size) {
  return size + "px"
}

export default function CustomCssVars({ data }) {
  const { colorText,
    colorTextAlt,
    colorBack,
    colorBackAlt,
    colorAccent,
    fontBody,
    fontHeading,
    fontBaseHeight,
    fontBaseSize,
    fontLgHeight,
    fontLgSize,
    fontSmHeight,
    fontXlHeight,
    fontSmSize,
    fontXlSize,
    fontXsHeight,
    fontXsSize,
    fontXxlHeight,
    fontXxlSize,
    fontXxxlHeight,
    fontXxxlSize
  } = data

  return (
    <style global jsx>{`
      :root {
        --color-white: 255 255 255;
        --color-text: ${rgbColor(colorText)};
        --color-text-alt: ${rgbColor(colorTextAlt)};
        --color-back: ${rgbColor(colorBack)};
        --color-back-alt: ${rgbColor(colorBackAlt)};
        --color-accent: ${rgbColor(colorAccent)};
        --font-body: ${fontBody};
        --font-heading: ${fontHeading};
        --font-xs-size: ${sizeToPx(fontXsSize)};
        --font-xs-height: ${sizeToPx(fontXsHeight)};
        --font-sm-size: ${sizeToPx(fontSmSize)};
        --font-sm-height: ${sizeToPx(fontSmHeight)};
        --font-base-height: ${sizeToPx(fontBaseHeight)};
        --font-base-size: ${sizeToPx(fontBaseSize)};
        --font-lg-size: ${sizeToPx(fontLgSize)};
        --font-lg-height: ${sizeToPx(fontLgHeight)};
        --font-xl-size: ${sizeToPx(fontXlSize)};
        --font-xl-height: ${sizeToPx(fontXlHeight)};
        --font-xxl-size: ${sizeToPx(fontXxlSize)};
        --font-xxl-height: ${sizeToPx(fontXxlHeight)};
        --font-xxxl-size: ${sizeToPx(fontXxxlSize)};
        --font-xxxl-height: ${sizeToPx(fontXxxlHeight)};
        --swiper-theme-color: ${rgbToHex(colorAccent)};
        --swiper-pagination-bullet-inactive-color: #ffffff;
        --swiper-pagination-bullet-inactive-opacity: 1;
        --swiper-navigation-size: 2.5rem;
        --swiper-pagination-bullet-horizontal-gap: 1rem;
        --swiper-margin: 0.8rem;
      }
    `}</style>
  );
}

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

export default function CustomCssVars({ data }) {
  const { colorText,
    colorTextAlt,
    colorBack,
    colorBackAlt,
    colorAccent,
    fontBody,
    fontHeading
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

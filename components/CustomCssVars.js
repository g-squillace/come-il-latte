function rgbColor(color) {
  return `${color.red} ${color.green} ${color.blue}`
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
        --color-text: ${rgbColor(colorText)};
        --color-text-alt: ${rgbColor(colorTextAlt)};
        --color-back: ${rgbColor(colorBack)};
        --color-back-alt: ${rgbColor(colorBackAlt)};
        --color-accent: ${rgbColor(colorAccent)};
        --font-body: ${fontBody};
        --font-heading: ${fontHeading};
      }
    `}</style>
  );
}

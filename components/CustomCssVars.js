export default function CustomCssVars({ data }) {
  const colorText = {...data.colorText}
  const colorTextAlt = {...data.colorTextAlt}
  const colorBack = {...data.colorBack}
  const colorBackAlt = {...data.colorBackAlt}
  const colorAccent = {...data.colorAccent}

  return (
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
  );
}

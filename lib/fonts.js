const baseUrl = 'https://fonts.googleapis.com/css2';
const displayString = 'display=swap';
const weightString = 'wght@400;500;700'

function nameForGoogleFonts(name) {
  return name.replace(/\s+/g, '+')
}

export function setGoogleFonts(design) {
  if (!design.fontBody || !design.fontHeading)
    return

  const families = [...new Set([design.fontBody, design.fontHeading])];
  const fontsList = families
    .map((family) => `family=${nameForGoogleFonts(family)}:${weightString}`)
    .concat(displayString);
  const fontsString = fontsList.join('&')
  const fontsUrl = [baseUrl, fontsString].join('?')

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={fontsUrl} rel="stylesheet" />
    </>
  )
}

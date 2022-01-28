function nameForGoogleFonts(name) {
  return name.replace(/\s+/g, '+')
}

export function setGoogleFonts(design) {
  if (!design.fontBody || !design.fontHeading)
    return

  const baseUrl = 'https://fonts.googleapis.com/css2';
  const displayString = 'display=swap';
  const fontBodyString = `family=${nameForGoogleFonts(design.fontBody)}:wght@400;700`;
  const fontHeadingString = `family=${nameForGoogleFonts(design.fontHeading)}:wght@400;500;700`;

  let fontsString = [
    fontBodyString,
    fontHeadingString,
    displayString
  ].join('&')

  if (design.fontBody === design.fontHeading)
    fontsString.splice(1,1)

  const fontsUrl = [
    baseUrl,
    fontsString
  ].join('?')

  return (
    <link href={fontsUrl} rel="stylesheet" />
  )
}

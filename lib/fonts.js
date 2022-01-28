const baseUrl = 'https://fonts.googleapis.com/css2';
const displayString = 'display=swap';

function nameForGoogleFonts(name) {
  return name.replace(/\s+/g, '+')
}

export function setGoogleFonts(design) {
  if (!design.fontBody || !design.fontHeading)
    return

  const fontBodyString = `family=${nameForGoogleFonts(design.fontBody)}:wght@400;700`;
  const fontHeadingString = `family=${nameForGoogleFonts(design.fontHeading)}:wght@400;500;700`;
  const fontsList = [fontBodyString, fontHeadingString, displayString]

  if (design.fontBody === design.fontHeading)
    fontsList.splice(0,1)

  const fontsString = fontsList.join('&')
  const fontsUrl = [baseUrl, fontsString].join('?')

  return (
    <link href={fontsUrl} rel="stylesheet" />
  )
}

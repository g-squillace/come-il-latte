function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}) / ${opacityValue})`
  }
}

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: withOpacityValue('--color-text'),
      alt: withOpacityValue('--color-text-alt'),
      accent: withOpacityValue('--color-accent'),
      back: withOpacityValue('--color-back'),
      'back-alt': withOpacityValue('--color-back-alt')
    },
    container: {
      center: true,
      padding: '2rem'
    },
    fontFamily: {
      'heading': ["var(--font-heading)", 'sans-serif'],
      'body': ["var(--font-body)", 'serif']
    },
    fontSize: {
      xs: ["var(--font-xs-size)", "var(--font-xs-height)"],
      sm: ["var(--font-sm-size)", "var(--font-sm-height)"],
      base: ["var(--font-base-size)", "var(--font-base-height)"],
      lg: ["var(--font-lg-size)", "var(--font-lg-height)"],
      xl: ["var(--font-xl-size)", "var(--font-xl-height)"],
      '2xl': ["var(--font-xxl-size)", "var(--font-xxl-height)"],
      '3xl': ["var(--font-xxxl-size)", "var(--font-xxxl-height)"]
    },
    extend: {
      letterSpacing: {
        widest: '.25em'
      },
    },
  },
  plugins: [],
}

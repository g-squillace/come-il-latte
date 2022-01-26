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
      xs: ['14px', '24px'],
      sm: ['16px', '20px'],
      base: ['18px', '28px'],
      lg: ['22px', '35px'],
      xl: ['35px', '45px'],
      '2xl': ['50px', '60px'],
      '3xl': ['70px', '70px']
    },
    extend: {
      letterSpacing: {
        widest: '.25em'
      },
    },
  },
  plugins: [],
}

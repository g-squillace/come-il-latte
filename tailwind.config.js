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
      primary: withOpacityValue('--color-primary'),
      secondary: '#ecc94b',
    },
    fontFamily: {
      'heading': ["var(--font-heading)", 'sans-serif'],
      'body': ["var(--font-body)", 'serif']
    },
    extend: {},
  },
  plugins: [],
}

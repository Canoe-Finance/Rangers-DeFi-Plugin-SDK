const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  theme: {
    fontFamily: {
      mono: [...defaultTheme.fontFamily.mono],
      sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
      title: ['Dongle', ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [require('@tailwindcss/forms')],
}

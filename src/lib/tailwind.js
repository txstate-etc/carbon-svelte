import plugin from 'tailwindcss/plugin.js'

export default plugin(({ addBase, addComponents, addUtilities, addVariant }) => {

}, {
  theme: {
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
      serif: ['Roboto Serif', 'serif'],
      mono: ['Roboto Mono', 'monospace']
    },
    colors: {
      tagyellow: {
        50: '#fdf9ed',
        100: '#f9eccc',
        200: '#f3d690',
        300: '#dfc27c',
        400: '#ccae69',
        500: '#b99a56',
        600: '#a68744',
        700: '#937532',
        800: '#816320',
        900: '#6f510c',
        950: '#3f1709'
      }
    }
  }
})

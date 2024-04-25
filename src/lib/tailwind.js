import plugin from 'tailwindcss/plugin.js'

export default plugin(({ addBase, addComponents, addUtilities, addVariant }) => {

}, {
  theme: {
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
      serif: ['Roboto Serif', 'serif'],
      mono: ['Roboto Mono', 'monospace']
    }
  }
})

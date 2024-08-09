import type { Config } from 'tailwindcss'

const config: Config = {
  corePlugins: {
    preflight: false
  },
  // important: '#__next',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        'p-bg': '#1F1C1B',
        's-bg': '#272325',
        's-text': '#7B7A7B',
        'p-text': '#cfd0d1'
      }
    }
  },
  plugins: []
}
export default config

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8f7f4',
          100: '#eeecea',
          200: '#d9d5cf',
          300: '#bfb8af',
          400: '#a09689',
          500: '#8a7d6f',
          600: '#7a6d61',
          700: '#655a52',
          800: '#544c47',
          900: '#47413c',
          950: '#272220',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

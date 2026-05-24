/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        accent: {
          primary: '#F5B544',
          secondary: '#111111',
        },
        text: {
          primary: '#111111',
          secondary: '#4A4A4A',
        },
        background: {
          sections: '#F5F5F5',
        },
        moonlight: {
          DEFAULT: '#F5F5F5',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        system: ['var(--font-manrope)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        'vw-4': '4vw',
        'em-58/16': '3.625em',
      },
      fontSize: {
        'vw-8xl': '8vw',
      },
      height: {
        'em-58/16': '3.625em',
      },
      zIndex: {
        '10': '10',
        '50': '50',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
      },
      animation: {
        marquee: 'marquee var(--duration, 40s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration, 40s) linear infinite',
      },
    },
  },
  plugins: [],
}


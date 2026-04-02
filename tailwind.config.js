/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#2a2a2a',
          100: '#252525',
          200: '#1f1f1f',
          300: '#1a1a1a',
          400: '#151515',
          500: '#0f0f0f',
          600: '#0a0a0a',
        },
        gold: {
          300: '#d9c399',
          400: '#D4B077',
          500: '#C2A469',
          600: '#b39858',
          700: '#9d8449',
        },
        dark: {
          50: '#2d2d2d',
          100: '#242424',
          200: '#1c1c1c',
          300: '#141414',
          400: '#0d0d0d',
          500: '#080808',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-shimmer':
          'linear-gradient(135deg, #C2A469 0%, #D4B077 50%, #C2A469 100%)',
      },
    },
  },
  plugins: [],
};

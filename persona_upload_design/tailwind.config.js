/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#fef7f4',
          100: '#fdeee8',
          200: '#fad9c7',
          300: '#f6bfa0',
          400: '#f09b70',
          500: '#ea7c4a',
          600: '#dc5f2f',
          700: '#b74a25',
          800: '#923e24',
          900: '#763521',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
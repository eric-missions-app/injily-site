/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: token('primary'),
        'primary-darker': token('primary-darker'),
        background: token('background'),
        'background-light': token('background-light'),
        surface: token('surface'),
        text: token('text'),
        muted: token('muted'),
        border: token('border'),
        accent: token('accent'),
        danger: token('danger'),
        success: token('success'),
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

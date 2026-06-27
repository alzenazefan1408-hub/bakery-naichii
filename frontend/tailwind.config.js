export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        brownLight: '#D8A47F',
        brownDark: '#8B5E3C',
      },
      backgroundImage: {
        bakery: "url('/bakery-pattern.svg')",
      },
    },
  },
  plugins: [],
};

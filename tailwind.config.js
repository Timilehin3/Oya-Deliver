/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'oya-teal': '#1e3a4d',
        'oya-green': '#2d8a4e',
        'oya-amber': '#f59e0b',
        'oya-paper': '#faf8f5',
      },
      fontFamily: {
        sans: ['Nunito', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

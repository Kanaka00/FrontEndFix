/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          dark: '#00FFFF',  // Neon Blue
          light: '#4FC3F7', // Soft Blue
        },
        accent: {
          dark: '#00FF7F',  // Electric Green
          light: '#ECEFF1', // Light Gray
        },
      },
    },
  },
  plugins: [],
};
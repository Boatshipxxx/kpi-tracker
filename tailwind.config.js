/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2',
        secondary: '#7B68EE',
        success: '#50C878',
        warning: '#FFB347',
      },
    },
  },
  plugins: [],
}

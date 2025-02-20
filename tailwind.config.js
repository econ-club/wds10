/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#ADA0FF', 
      },
      fontSize : {
        'xxs' :  '0.625rem',
        'xxxs' : '7px',
      }
    },
    screens : {
      sm : '640px',
      md : '768px',
    },
  },
  plugins: [],
  
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Wurko brand colors — azul y verde lima
        brand: {
          blue:       '#0B6FA8',
          'blue-dark': '#054A6E',
          'blue-light': '#2B8FC1',
          green:      '#C5D900',
          orange:     '#FF8C42',
          yellow:     '#FFD93D',
        },
        // App surface (dark navy)
        bg: {
          DEFAULT: '#071626',
          surface: '#0D2340',
          elevated: '#132D52',
        },
        border: {
          DEFAULT: '#1A3A5C',
          subtle: '#0D2340',
        },
        text: {
          primary: '#F0F9FF',
          secondary: '#93C5FD',
          muted: '#5B86A8',
        },
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        body:    ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Chuqur indigo — asosiy fon/brend rangi. Oddiy "ko'k" emas,
        // bir oz to'q va sovuqroq — ishonchlilik va jiddiylikni bildiradi.
        ink: {
          50: '#EEF0F9',
          100: '#D5D9EE',
          200: '#ABB3DD',
          300: '#818DCC',
          400: '#57679D', // o'rtacha to'q ko'k, matn uchun ishlatiladi och fonlarda
          500: '#374374',
          600: '#252E56',
          700: '#1A2247',
          800: '#141B3A',
          900: '#0F1B3D', // asosiy fon rangi (hero, header)
          950: '#0A1229',
        },
        // Issiq oltin/amber — CTA tugmalar, urg'u, "qiymatli bilim" metaforasi
        gold: {
          50: '#FDF7ED',
          100: '#FAEACB',
          200: '#F4D394',
          300: '#EDBC5D',
          400: '#E8A94C', // asosiy urg'u rangi
          500: '#D6923A',
          600: '#B3752A',
          700: '#8F5A20',
          800: '#6B4318',
          900: '#4A2F10',
        },
        // Neytral kulrang-ko'k — matn va fonlar uchun (Tailwind default gray
        // o'rniga, sovuqroq va brendga mos)
        slate: {
          50: '#F7F8FB',
          100: '#ECEEF5',
          200: '#D9DCE8',
          300: '#B8BDD1',
          400: '#8B92AF',
          500: '#666D8C',
          600: '#4D5470',
          700: '#3A3F58',
          800: '#282C40',
          900: '#1A1D2B',
        },
      },
      fontFamily: {
        // Display uchun keng serif — o'quv markazining "jiddiylik" va
        // ishonchlilik hissini beradi, edtech-startup ko'rinishidan chetlashadi
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};

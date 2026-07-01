/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#110D1A',
          50: '#F5F3F7',
          100: '#EAE5EF',
          800: '#261F33',
          900: '#110D1A',
        },
        accent: {
          DEFAULT: '#F5B8B8',
          light: '#FCEAEA',
          dark: '#D29292',
        },
        cream: '#FAF7F5',
        'warm-white': '#F5ECE8',
        'pastel-sage': '#DDE4E1',
        'pastel-blush': '#F5EBE6',
        'pastel-blue': '#E3EAE7',
        'pastel-sand': '#EAE4D9',
        muted: '#938A9C',
        border: 'rgba(245, 184, 184, 0.15)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Cinzel"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(18,28,24,0.04)',
        'card-hover': '0 12px 35px rgba(18,28,24,0.08)',
        float: '0 12px 40px rgba(18,28,24,0.12)',
        luxury: '0 10px 30px -10px rgba(192,160,93,0.15)',
        'luxury-hover': '0 20px 40px -10px rgba(192,160,93,0.25)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in': 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

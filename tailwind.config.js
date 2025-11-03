/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
extend: {
      colors: {
        primary: {
          50: '#FEE2E2',
          100: '#FECACA',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        secondary: {
          50: '#EDF2F7',
          100: '#E2E8F0',
          500: '#1E3A5F',
          600: '#182F4A',
          700: '#132638',
        },
        accent: {
          50: '#E6FAFE',
          100: '#CCF5FD',
          500: '#00B8D4',
          600: '#0093A6',
          700: '#007080',
        },
        surface: '#FFFFFF',
        background: '#F5F7FA',
        success: '#52C41A',
        warning: '#FAAD14',
        error: '#F5222D',
        info: '#1890FF',
      },
      fontFamily: {
        display: ['DM Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.1)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.15)',
      },
      animation: {
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'count-up': 'countUp 0.6s ease-out',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        countUp: {
          '0%': { transform: 'translateY(5px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
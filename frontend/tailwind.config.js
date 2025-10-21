/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // NordLayer Nordic color palette - Точные цвета из брендбука
        primary: {
          50: '#F4F7FA',   // Ледяной белый - самый светлый
          100: '#E8EEF5',  // Светлый оттенок ледяного белого
          200: '#D1DDE9',  // Еще светлее холодного серого
          300: '#AFC2D6',  // Светлый холодный серый
          400: '#8E9BAE',  // Холодный серый - технологичность
          500: '#6B7A8F',  // Средний холодный серый
          600: '#556275',  // Темнее холодного серого
          700: '#465060',  // Еще темнее
          800: '#334155',  // Переход к северному синему
          900: '#1B2A41',  // Северный синий - чистота, глубина
          950: '#0F1A2A',  // Самый темный северный синий
        },
        secondary: {
          50: '#F4F7FA',   // Ледяной белый
          100: '#E8EEF5',  
          200: '#D1DDE9',  
          300: '#AFC2D6',  
          400: '#8E9BAE',  // Холодный серый
          500: '#6B7A8F',  
          600: '#556275',  
          700: '#465060',  
          800: '#334155',  
          900: '#1B2A41',  // Северный синий
          950: '#0F1A2A',  
        },
        accent: {
          50: '#FEF7ED',   // Очень светлый медный
          100: '#FDEDD3',  // Светлый медный
          200: '#FBD7A5',  // Светлее медного
          300: '#F8BC6D',  // Светлый медный акцент
          400: '#E2A574',  // Промежуточный медный
          500: '#C68642',  // Медный акцент - ремесло, тепло (основной)
          600: '#B8722A',  // Темнее медного
          700: '#A05A1F',  // Еще темнее
          800: '#8B4A1C',  // Темный медный
          900: '#73391A',  // Очень темный медный
          950: '#3E1C0B',  // Самый темный медный
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'hard': '0 10px 40px -10px rgba(0, 0, 0, 0.2), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'nordic': '0 4px 20px -2px rgba(27, 42, 65, 0.1), 0 2px 8px -2px rgba(27, 42, 65, 0.06)',
        'aurora': '0 0 30px rgba(198, 134, 66, 0.2), 0 0 60px rgba(27, 42, 65, 0.1)',
        'glow-nordic': '0 0 20px rgba(27, 42, 65, 0.2)',
        'glow-copper': '0 0 20px rgba(198, 134, 66, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      backgroundImage: {
        'gradient-nordic': 'linear-gradient(135deg, #1B2A41 0%, #8E9BAE 100%)',
        'gradient-aurora': 'linear-gradient(135deg, #C68642 0%, #E2A574 50%, #1B2A41 100%)',
        'gradient-ice': 'linear-gradient(135deg, #F4F7FA 0%, #E8EEF5 100%)',
        'gradient-copper': 'linear-gradient(135deg, #C68642 0%, #E2A574 100%)',
        'gradient-frost': 'linear-gradient(135deg, #F4F7FA 0%, #D1DDE9 50%, #8E9BAE 100%)',
      },
    },
  },
  plugins: [],
}
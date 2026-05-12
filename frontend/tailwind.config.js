/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e6fe',
          300: '#7cd4fd',
          400: '#36bcf7',
          500: '#0ca4e8',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        sand: {
          50: '#fdfbf7',
          100: '#faf5eb',
          200: '#f3e8c9',
          300: '#ead5a0',
          400: '#dfbc72',
          500: '#d4a24c',
          600: '#b8883a',
          700: '#9a6e2e',
          800: '#7d5826',
          900: '#66481f',
        },
        coral: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        }
      },
      backgroundImage: {
        'gradient-travel': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #0ca4e8 0%, #0369a1 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f43f5e 0%, #d4a24c 100%)',
        'gradient-forest': 'linear-gradient(135deg, #10b981 0%, #0369a1 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

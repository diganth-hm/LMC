import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#0F6E56',
          'teal-light': '#E1F5EE',
          coral: '#D85A30',
          'coral-light': '#FDF2EE',
          amber: '#854F0B',
          'amber-light': '#FEF3C7',
          purple: '#5B4B8A',
          'purple-light': '#F3F0F9',
          ink: '#1F1E1B',
          bg: '#FBFAF7',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;

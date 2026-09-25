import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // Primary — deep emerald
          teal: '#0F6E56',
          'teal-strong': '#0B5A47',
          'teal-deep': '#084637',
          'teal-soft': '#E3F2EC',
          'teal-light': '#E1F5EE', // legacy tint (kept)
          // Legacy supporting accents (kept)
          coral: '#D85A30',
          'coral-light': '#FDF2EE',
          amber: '#854F0B',
          'amber-light': '#FEF3C7',
          purple: '#5B4B8A',
          'purple-light': '#F3F0F9',
          ink: '#101815',
          charcoal: '#18211D',
          'charcoal-light': '#24312B',
          bg: '#F7F7F4',
        },
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(16 24 21 / 0.05)',
        card: '0 1px 2px 0 rgb(16 24 21 / 0.04), 0 1px 3px 0 rgb(16 24 21 / 0.06)',
        'card-hover': '0 4px 6px -2px rgb(16 24 21 / 0.05), 0 10px 24px -6px rgb(16 24 21 / 0.10)',
        pop: '0 12px 40px -8px rgb(16 24 21 / 0.22)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;

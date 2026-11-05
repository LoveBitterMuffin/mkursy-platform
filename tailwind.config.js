/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0B132B',
        'brand-navy': '#1C2541',
        'brand-surface': '#243054',
        'brand-accent': '#6366F1',
        'brand-purple': '#8B5CF6',
        'brand-emerald': '#10B981',
        'brand-amber': '#F59E0B',
        'brand-rose': '#EF4444',
      },
    },
  },
  plugins: [],
};

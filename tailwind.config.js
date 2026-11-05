/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Onest', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glow-indigo': '0 0 35px -5px rgba(99, 102, 241, 0.25)',
        'glow-emerald': '0 0 35px -5px rgba(16, 185, 129, 0.25)',
        'glow-amber': '0 0 35px -5px rgba(245, 158, 11, 0.25)',
      },
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

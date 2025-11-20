/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // ألوان هادئة للوضع الفاتح
        'soft-gray': '#f5f7fa',
        'warm-white': '#fafafa',
        'gentle-slate': '#64748b',
        'calm-violet': '#8b5cf6',
        'soft-violet': '#ede9fe',
        // ألوان هادئة للوضع الداكن
        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b',
        'dark-border': '#334155',
        'dark-text': '#e2e8f0',
        'dark-violet': '#7c3aed',
      },
    },
  },
  plugins: [],
};



export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.12)'
      },
      colors: {
        easy: '#22c55e',
        medium: '#f59e0b',
        hard: '#ef4444',
        free: '#8b5cf6',
        break: '#60a5fa'
      }
    }
  },
  plugins: []
};

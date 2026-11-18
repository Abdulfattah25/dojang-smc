/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        satria: {
          red: '#E52E1C',
          'red-hover': '#C42010',
          gold: '#C9A85B',
          'gold-subtle': 'rgba(201, 168, 91, 0.14)',
          'gold-border': 'rgba(201, 168, 91, 0.22)',
          success: '#059669',
          'success-hover': '#047857',
        },
        obsidian: {
          core: '#161311',
          surface: '#201B17',
          elevated: '#2A231E',
          border: 'rgba(201, 168, 91, 0.16)',
        },
        dobok: {
          canvas: '#F8FAFC',
          surface: '#FFFFFF',
          border: '#E2E8F0',
        },
        ink: {
          primary: '#0F172A',
          muted: '#64748B',
          subtle: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        brand: ['Cabinet Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'satria': '0 4px 14px 0 rgba(229, 46, 28, 0.25)',
        'gold': '0 4px 14px 0 rgba(201, 168, 91, 0.20)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}

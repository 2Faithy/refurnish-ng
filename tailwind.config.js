/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseOnce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeInUp: { // Re-added for the mobile menu links to animate in
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-down': 'slideDown 0.6s ease-out forwards',
        'fade-in-scale': 'fadeInScale 0.2s ease-out forwards',
        'pulse-once': 'pulseOnce 0.8s ease-in-out 1', // Runs once
        'bounce-in': 'bounceIn 0.8s ease-out forwards', // Runs once
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards', // For elements within mobile menu
      },
      // You might also want to define your custom colors here for consistency
      colors: {
        refurnishBrown: {
          DEFAULT: '#775522',
          dark: '#5E441B',
          light: '#F7F1E5',
          accent: '#FFD580',
        },
        refurnishGreen: {
          DEFAULT: '#5F7161',
        }
      },
    },
  },
  plugins: [],
};
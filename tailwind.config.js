/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            animation: {
                'bounce-slow': 'bounce 1.5s infinite',
                'pulse': 'pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                bounce: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-25%)' },
                },
                pulse: {
                    '0%, 100%': { opacity: 0 },
                    '50%': { opacity: 1 },
                },
            },
            transitionDelay: {
                150: '150ms',
                300: '300ms',
            },
        },
    },
    plugins: [],
    variants: {
        extend: {
            animation: ['responsive', 'motion-safe', 'motion-reduce'],
        },
    },
}

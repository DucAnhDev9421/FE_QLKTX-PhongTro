/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                slate: {
                    50: 'var(--slate-50)',
                    100: 'var(--slate-100)',
                    200: 'var(--slate-200)',
                    300: 'var(--slate-300)',
                    400: 'var(--slate-400)',
                    500: 'var(--slate-500)',
                    600: 'var(--slate-600)',
                    700: 'var(--slate-700)',
                    800: 'var(--slate-800)',
                    900: 'var(--slate-900)',
                    950: 'var(--slate-950)',
                },
                primary: {
                    900: '#171717',
                    800: '#404040',
                },
                accent: {
                    DEFAULT: '#D4AF37',
                    hover: '#e5c04b',
                }
            }
        },
    },
    plugins: [],
}

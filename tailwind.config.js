/** @type {import('tailwindcss').Config} */
export default {
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

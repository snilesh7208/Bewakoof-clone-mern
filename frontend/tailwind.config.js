/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#FDD835', // Bewakoof yellow-ish
                secondary: '#333333',
            }
        },
    },
    plugins: [],
}

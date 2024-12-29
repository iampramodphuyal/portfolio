/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                customDark: "#1E1E2E",
            },
        },
    },
    plugins: [require("flowbite/plugin")],
};

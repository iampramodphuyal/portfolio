/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                customDark: "#11111b",
                customLight: "#dce0e8",
            },
        },
    },
    plugins: [require("flowbite/plugin")],
};

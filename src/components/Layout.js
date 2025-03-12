import React, { useEffect, useState } from "react";
import Card from "./Cards";
import NavBar from "./NavBar";
import Skills from "./Skills";
import ContactMe from "./ContactMe";
import Experience from "./Experience";
import Education from "./Education";
import ContactMeForm from "./ContactMeForm";
export default function Layout() {
    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme") || "light",
    );
    useEffect(() => {
        // Set the theme on the initial load and whenever the theme changes
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleThemeSwitch = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };
    return (
        <div className="bg-customLight dark:bg-customDark dark:text-gray-400 mainBody">
            <div className="navigationBar">
                <NavBar themeSwitch={handleThemeSwitch} themes={theme} />
            </div>
            <div className="pt-20">
                <Card />
            </div>
            <div className="mt-20">
                <Skills />
            </div>
            <div className="mt-20">
                <Experience />
            </div>
            <div className="mt-20">
                <Education />
            </div>
            <div className="mt-20">
                <ContactMeForm />
            </div>
            <div className="mt-30 mx-auto text-center text-gray-500 dark:text-gray-400">
                <p>©Pramod Phuyal</p>
                <p>2024</p>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Cards";
import NavBar from "./components/NavBar";
import Skills from "./components/Skills";
import ContactMe from "./components/ContactMe";
import Experience from "./components/Experience";
import Education from "./components/Education";

function App() {
    const savedTheme = localStorage.getItem("theme") || "light";
    const [theme, setTheme] = useState(savedTheme);
    useEffect(() => {
        setTheme(savedTheme);
        document.documentElement.classList.add(savedTheme);
    }, [savedTheme]);
    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.classList.remove(
            theme === "dark" ? "light" : "dark",
        );
        document.documentElement.classList.add(theme);
    }, [theme]);
    const handleThemeSwitch = () => {
        setTheme(theme === "light" ? "dark" : "light");
        console.log(theme);
    };
    return (
        <div className="bg-white dark:bg-customDark dark:text-gray-400 mainBody">
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
                <ContactMe />
            </div>
            <div className="mt-30 mx-auto text-center text-gray-500 dark:text-gray-400">
                <p>©Pramod Phuyal</p>
                <p>2024</p>
            </div>
        </div>
    );
}

export default App;

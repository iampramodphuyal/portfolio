import React, { useEffect, useState } from "react";
import Card from "../components/Cards";
import NavBar from "../components/NavBar";
import Skills from "../components/Skills";
import ContactMe from "../components/ContactMe";
import Experience from "../components/Experience";
import Education from "../components/Education";
import { execSync } from "child_process";
import path from "path";

function App() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme") || "light";
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(theme);
            localStorage.setItem("theme", theme);
        }
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
                <ContactMe />
            </div>
            <div className="mt-30 mx-auto text-center text-gray-500 dark:text-gray-400">
                <p>©Pramod Phuyal</p>
                <p>2024</p>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const ua = context.req.headers["user-agent"] || "";
    if (ua.includes("curl")) {
        const cardPath = path.join(process.cwd(), "assets/curl/card.sh");
        const output = execSync(`bash ${cardPath}`).toString();
        context.res.setHeader("Content-Type", "text/plain; charset=utf-8");
        context.res.write(output);
        context.res.end();
        return; // Do not return anything after ending the response
    }

    return {
        props: {},
    };
}

export default App;

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import profile from ".././images/profile.png";
import { AiOutlineCloudDownload } from "react-icons/ai";

function Card() {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
    }, []);
    return (
        <div className="w-full">
            <div className="sm:text-center bg-customLight dark:bg-customDark">
                <div className="flex pt-4 sm:py-1 py-2 justify-center">
                    <div
                        className="sm:w-1/3 w-1/5 md:w-1/3 w-1/2"
                        data-aos="zoom-out-up"
                    >
                        <img
                            className="rounded-full drop-shadow-xl mx-auto"
                            src={profile}
                            alt="Profile Picture"
                        />
                    </div>
                </div>
            </div>
            <div>
                <div className="mt-10 mx-auto max-w-7xl px-4 py-4">
                    <div className="sm:text-center lg:text-center text-gray-900 dark:text-gray-50">
                        <h1 className="mx-auto text-4xl text-gray-700 dark:text-gray-500 font-extrabold sm:text-4xl sm:inline md:text-4xl md:inline">
                            <span className="block font-light md:inline xl:inline">
                                Pramod
                            </span>
                            <span className="block text-bold text-gray-900 dark:text-gray-400 md:px-2 xl:inline md:inline">
                                Phuyal
                            </span>
                        </h1>
                        <h2 className="py-4 text-2xl text-gray-700 dark:text-gray-500 font-extrabold sm:text-l md:text-xl">
                            <span className="block font-light md:inline xl:inline sm:inline">
                                Software Engineer
                            </span>
                            <span className="block font-light md:inline xl:inline sm:inline">
                                /
                            </span>
                            <span className="block font-light md:inline xl:inline sm:inline">
                                Service Delivery Engineer
                            </span>
                        </h2>
                        <p className="py-2 text-2xl text-gray-500 sm:text-s">
                            Hi! I am Pramod, I like to Code and Create new Apps!
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-10 mx-auto text-center w-1/6 sm:w-auto">
                <a
                    href="https://drive.google.com/file/d/1tRvxj4DRNDje1vEsuFhPuPnVRtJq8vFl/view?usp=sharing"
                    className="hover:border-green-400"
                >
                    <AiOutlineCloudDownload className="mx-auto w-10 h-10 sm:w-auto dark:text-gray-500 text-gray-900  " />
                    <span className="mt-5 border-2 p-1 rounded-lg text-gray-900  dark:text-gray-500 hover:border-green-400">
                        Download Resume
                    </span>
                </a>
            </div>
        </div>
    );
}

export default Card;

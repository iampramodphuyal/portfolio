import React from "react";
import profile from ".././images/profile.png";
import { AiOutlineCloudDownload } from "react-icons/ai";

function Card() {
    return (
        <div className="flex h-screen w-full bg-customLight dark:bg-customDark">
            <div className="w-1/2 justify-center text-center">
                <div className="mt-[30%] mx-auto max-w-7xl px-4 py-4">
                    <div className="sm:text-center lg:text-center text-gray-900 dark:text-gray-50">
                        <h1 className="mx-auto text-5xl text-gray-700 dark:text-gray-500 font-extrabold sm:text-5xl md:text-5xl">
                            <span className="block font-light md:inline xl:inline ">
                                Pramod
                            </span>
                            <span className="block text-bold text-gray-900 dark:text-gray-400 md:px-2 xl:inline md:inline">
                                Phuyal
                            </span>
                        </h1>
                        <h2 className="py-4 text-4xl text-gray-700 dark:text-gray-500 font-extrabold sm:text-xl md:text-3xl">
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
                        {/* <div className="mt-10 mx-auto text-center w-1/6 sm:w-auto">
                            <a
                                href="https://drive.google.com/file/d/1tRvxj4DRNDje1vEsuFhPuPnVRtJq8vFl/view?usp=sharing"
                                className="hover:border-green-400"
                            >
                                <AiOutlineCloudDownload className="mx-auto w-10 h-10 sm:w-auto dark:text-gray-500 text-gray-900  " />
                                <span className="mt-5 border-2 p-1 rounded-lg text-gray-900  dark:text-gray-500 hover:border-green-400">
                                    Download Resume
                                </span>
                            </a>
                        </div> */}
                    </div>
                </div>
            </div>
            <div className="flex w-1/2 justify-right text-center">
                <div className="absolute bg-[#165b63] rounded-full h-3/4 w-2/5 mx-5 top-20  filter blur-3xl"></div>
                <div className="pt-4 sm:py-1 py-2 px-10">
                    <div className="w-4/5 px-5">
                        <img
                            className="rounded-full drop-shadow-xl mx-3 motion-translate-x-in-[-101%] motion-translate-y-in-[-2%]"
                            src={profile}
                            alt="Profile Picture"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;

import React from "react";

export default function Education() {
    const acme = "/images/acme.png";
    const codetantra = "/images/codetantra.png";
    const prerana = "/images/prerana.jpg";
    return (
        <div className="w-full">
            <div>
                <div className="mt-20 mx-auto max-w-7xl px-4 py-4">
                    <div className="sm:text-center lg:text-center text-gray-900">
                        <h1 className="text-4xl text-gray-500 font-extrabold sm:text-5xl md:text-5xl">
                            <span className="block font-light md:inline lg:inline xl:inline">
                                Education
                            </span>
                            <span className="block font-light md:inline lg:inline xl:inline">
                                /
                            </span>
                            <span className="block text-gray-900 dark:text-gray-500 md:inline lg:inline xl:inline">
                                Certification
                            </span>
                        </h1>
                    </div>
                </div>
                <div className="flex justify-center mx-auto pl-10 pr-10 m-20 sm:text-center">
                    <div className="text-center">
                        <img
                            className="scale-75 h-20"
                            src={acme}
                            alt="Grepsr"
                        />
                        <span className="block font-bold text-gray-900 dark:text-gray-500">
                            Computer Engineering
                        </span>
                        <span className="block text-gray-500">
                            Dec 2016 - Dec 2020
                        </span>
                    </div>
                    <div className="text-center">
                        <img
                            className="scale-75 h-20"
                            src={codetantra}
                            alt="Xelwel"
                        />
                        <span className="block font-bold text-gray-900 dark:text-gray-500">
                            Introduction to Python Programming Language
                        </span>
                        <span className="block text-gray-500">
                            Jan 2019 - Mar 2019
                        </span>
                    </div>
                    <div className="text-center">
                        <img
                            className="scale-75 h-20"
                            src={prerana}
                            alt="Xelwel"
                        />
                        <span className="block font-bold text-gray-900 dark:text-gray-500">
                            +2 Science
                        </span>
                        <span className="block text-gray-500">
                            Jul 2013 - Sep 2015
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

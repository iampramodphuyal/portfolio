import React, { useEffect } from "react";
import { AiFillInstagram, AiFillLinkedin, AiFillGithub } from "react-icons/ai";
import { SiGmail } from "react-icons/si";

export default function ContactMe() {
    return (
        <div className="w-full">
            <div className="">
                <div className="mt-20 mx-auto max-w-7xl px-4 py-4">
                    <div className="sm:text-center lg:text-center text-gray-900">
                        <h1 className="text-4xl text-gray-500 font-extrabold sm:text-5xl md:text-5xl">
                            <span className="block font-light md:inline xl:inline">
                                Contact
                            </span>
                            <span className="block text-bold text-gray-900 dark:text-gray-500 md:px-5 xl:inline md:inline">
                                Me
                            </span>
                        </h1>
                    </div>
                </div>
                <div className="flex mx-auto m-5 overflow-auto justify-center sm:justify sm:text-center">
                    <div className="m-10 mx-auto text-center">
                        <a
                            href="https://www.linkedin.com/in/pramod-phuyal/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className=""
                        >
                            <AiFillLinkedin className="mx-auto w-10 h-10 block" />
                            <span className="block text-xl text-gray-500">
                                pramod-phuyal
                            </span>
                        </a>
                    </div>
                    <div className="m-10  mx-auto text-center">
                        <a
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=iampramodvii@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className=""
                        >
                            <SiGmail className="mx-auto w-10 h-10 block" />
                            <span className="block text-xl text-gray-500">
                                Pramod Phuyal
                            </span>
                        </a>
                    </div>
                    <div className="m-10  mx-auto text-center">
                        <a
                            href="https://github.com/iampramodphuyal"
                            target="_blank"
                            rel="noopener noreferrer"
                            className=""
                        >
                            <AiFillGithub className="mx-auto w-10 h-10 block" />
                            <span className="block text-xl text-gray-500">
                                Pramod Phuyal
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

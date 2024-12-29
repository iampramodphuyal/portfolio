import React from "react";
import { AiFillHome, AiOutlineMenu } from "react-icons/ai";
import { MdDarkMode, MdLightMode } from "react-icons/md";
export default function NavBar(props) {
    return (
        <nav className="shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between">
                    <div className="flex space-x-7">
                        <div className="">
                            <a className="flex items-center px-2 py-4" href="#">
                                <AiFillHome className="h-10 w-10" />
                            </a>
                        </div>
                    </div>
                    <div className="items-right flex">
                        <div className="inline">
                            <a className="flex px-2 py-4" href="#">
                                <AiOutlineMenu className="h-10 w-10" />
                            </a>
                        </div>
                        <div className="inline mx-auto mt-7 px-5">
                            <button
                                type="button"
                                onClick={props.themeSwitch}
                                className="scale-150"
                            >
                                {props.themes === "dark" ? (
                                    <MdLightMode />
                                ) : (
                                    <MdDarkMode />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

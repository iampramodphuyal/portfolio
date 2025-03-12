import React from "react";
import pageNotFound from ".././images/pageNotFound.svg";
export default function NotFound() {
    return (
        <div className="w-full h-screen bg-customLight dark:bg-customDark">
            <div className="flex justify-center h-[90%]">
                <div className="">
                    <div className="text-center">
                        <img src={pageNotFound} alt="PageNotFound" />
                    </div>
                </div>
                <div className="h-[10%] flex text-center justify-center">
                    <div className="flex">
                        <button value="Go Home" className="mt-20">
                            Page not found
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useEffect } from 'react'
import AOS from "aos";
import "aos/dist/aos.css";
import acme from '.././images/acme.png'
import codetantra from '.././images/codetantra.png'
import prerana from '.././images/prerana.jpg'

export default function Education() {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
      }, []);
  return (
    <div className='w-full'>
        <div>
            <div className='mt-20 mx-auto max-w-7xl px-4 py-4'>
                <div className='sm:text-center lg:text-center text-gray-900'>
                    <h1 className='text-4xl text-gray-500 font-extrabold sm:text-5xl md:text-5xl'>
                        <span className='block font-light md:inline lg:inline xl:inline'>Education</span>
                        <span className='block font-light md:inline lg:inline xl:inline'>/</span>
                        <span className='block text-gray-900 md:inline lg:inline xl:inline'>Certification</span>
                    </h1>
                </div>
            </div>
            <div className='flex justify-between mx-auto pl-10 pr-10 m-20'>
                <div className='text-center' data-aos="zoom-out">
                    <img className='scale-75 h-20' src={acme} alt='Grepsr'/>
                    <span className='block font-bold text-gray-900'>Computer Engineering</span>
                    <span className='block text-gray-500'>Dec 2016 - Dec 2020</span>
                </div>
                <div className='text-center' data-aos="zoom-out-up">
                    <img className='scale-75 h-20' src={codetantra} alt='Xelwel'/>
                    <span className='block font-bold text-gray-900'>Introduction to Python Programming Language</span>
                    <span className='block text-gray-500'>Jan 2019 - Mar 2019</span>
                </div>
                <div className='text-center' data-aos="zoom-out-down">
                    <img className='scale-75 h-20' src={prerana} alt='Xelwel'/>
                    <span className='block font-bold text-gray-900'>+2 Science</span>
                    <span className='block text-gray-500'>Jul 2013 - Sep 2015</span>
                </div> 
            </div>
        </div>
    </div>     
  )
}

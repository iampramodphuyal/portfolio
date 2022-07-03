import React, { useEffect } from 'react'
import AOS from "aos";
import "aos/dist/aos.css";
import grepsr from '.././images/grepsr.png';
import xelwel from '.././images/xelwel.png';

export default function Experience() {
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
                    <span className='block font-light md:inline xl:inline'>Experience</span>
                </h1>
            </div>
        </div>
        {/* <div className='flex justify-center mx-auto m-20'> */}
        <div className='flex justify-center mx-auto m-20'>
            <div className='block px-20 mx-auto text-center items-center' data-aos="fade-right" data-aos-offset="300" data-aos-easing="ease-in-sine">
                <img className='block w-30 h-20 mx-auto' src={grepsr} alt='Grepsr'/>
                <span className='block font-bold text-gray-900'>Service Delivery Engineer</span>
                <span className='block text-gray-500'>May 2022 - Present</span>
            </div>
            <div className='block px-20 mx-auto text-center items-center' data-aos="fade-left" data-aos-offset="300" data-aos-easing="ease-in-sine">
                <img className='block w-30 h-20 mx-auto' src={xelwel} alt='Xelwel'/>
                <span className='block font-bold text-gray-900'>Backend Developer</span>
                <span className='block text-gray-500'>Nov 2021 - May 2022</span>
            </div>
            
        </div>
    </div>
</div>
  )
}

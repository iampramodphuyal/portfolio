import React from 'react'
import { FaPhp, FaLaravel, FaReact, FaPython } from 'react-icons/fa'
import { DiDjango } from 'react-icons/di'
import { SiMysql } from 'react-icons/si'

export default function Skills() {
  return (
    <div className='w-full'>
        <div>
            <div className='mt-20 mx-auto max-w-7xl px-4 py-4'>
                <div className='sm:text-center lg:text-center text-gray-900'>
                    <h1 className='text-4xl text-gray-500 font-extrabold sm:text-5xl md:text-5xl'>
                        <span className='block font-light md:inline xl:inline'>Skills</span>
                    </h1>
                </div>
            </div>
            <div className='flex flex-wrap justify-center pt-2'>
                <div className='flex flex-col w-40 p-10 m-6 overflow-hidden bg-white shadow-2xl rounded-xl sm:w-52'>
                    <FaPhp className='mx-auto w-20 h-20 hover:text-purple-900'/>
                    <p className='mx-auto text-2xl sm:text-4xl font-semibold'>PhP</p>
                </div>
                <div className='flex flex-col w-40 p-10 m-6 overflow-hidden bg-white shadow-2xl rounded-xl sm:w-52'>
                    <FaLaravel className='mx-auto w-20 h-20 hover:text-red-500'/>
                    <p className='mx-auto text-2xl sm:text-4xl font-semibold'>Laravel</p>
                </div>
                <div className='flex flex-col w-40 p-10 m-6 overflow-hidden bg-white shadow-2xl rounded-xl sm:w-52'>
                    <FaReact className='mx-auto w-20 h-20 hover:text-cyan-500' />
                    <p className='mx-auto text-2xl sm:text-4xl font-semibold'>React.js</p>
                </div>
                <div className='flex flex-col w-40 p-10 m-6 overflow-hidden bg-white shadow-2xl rounded-xl sm:w-52'>
                    <DiDjango className='mx-auto w-20 h-20 hover:text-green-500'/>
                    <p className='mx-auto text-2xl sm:text-4xl font-semibold'>Django</p>
                </div>
                <div className='flex flex-col w-40 p-10 m-6 overflow-hidden bg-white shadow-2xl rounded-xl sm:w-52'>
                    <SiMysql className='mx-auto w-20 h-20 hover:text-orange-500'/>
                    <p className='mx-auto text-2xl sm:text-4xl font-semibold'>MySQL</p>
                </div>
                <div className='flex flex-col w-40 p-10 m-6 overflow-hidden bg-white shadow-2xl rounded-xl sm:w-52'>
                    <FaPython className='mx-auto w-20 h-20 hover:text-blue-500'/>
                    <p className='mx-auto text-2xl sm:text-4xl font-semibold'>Python</p>
                </div>
            </div>
        </div>
    </div>
  )
}

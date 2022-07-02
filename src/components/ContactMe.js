import React from 'react'
import { AiFillInstagram, AiFillLinkedin, AiFillGithub } from 'react-icons/ai'
import { SiGmail } from 'react-icons/si'

export default function ContactMe() {
  return (
    <div className='w-full'>
        <div className=''>
            <div className='mt-20 mx-auto max-w-7xl px-4 py-4'>
                <div className='sm:text-center lg:text-center text-gray-900'>
                    <h1 className='text-4xl text-gray-500 font-extrabold sm:text-5xl md:text-5xl'>
                        <span className='block font-light md:inline xl:inline'>Contact</span>
                        <span className='block text-bold text-gray-900 md:px-5 xl:inline md:inline'>Me</span>
                    </h1>
                </div>
            </div>
            <div className='flex justify-between pl-10 pr-10 mx-auto m-20'>
                <div className=''>
                    <a href='https://www.instagram.com/iampramodphuyal'>
                        <AiFillInstagram className='mx-auto w-10 h-10 block'/>
                        <span className='block text-xl'>@iampramodphuyal</span>
                    </a>
                </div>
                <div className=''>
                    <a href='https://www.linkedin.com/in/pramod-phuyal/'>
                        <AiFillLinkedin className='mx-auto w-10 h-10 block'/>
                        <span className='block text-xl'>pramod-phuyal</span>
                    </a>
                </div>
                <div>
                    <a href='https://mail.google.com/mail/?view=cm&fs=1&to=pramod.phuyal@grepsr.com'>
                        <SiGmail className='mx-auto w-10 h-10 block'/>
                        <span className='block text-xl'>Pramod Phuyal</span>
                    </a>
                </div>
                <div>
                    <a href='https://github.com/iamjackvii'>
                        <AiFillGithub className='mx-auto w-10 h-10 block'/>
                        <span className='block text-xl'>Pramod Phuyal</span>
                    </a>
                </div>               
            </div>
        </div>
    </div> 
  )
}

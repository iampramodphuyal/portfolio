import React from 'react'
import { Link } from "react-router-dom";
import homeIcon from '.././images/home-icon.png'
import { AiFillHome, AiOutlineMenu } from 'react-icons/ai'
export default function NavBar() {
  return (
    <nav className='bg-white shadow-lg'>
        <div className='max-w-6xl mx-auto px-4'>
            <div className='flex justify-between'>
                <div className='flex space-x-7'>
                    <div className=''>
                        <a className='flex items-center px-2 py-4' href='#'>
                            <AiFillHome className='h-10 w-10'/>
                        </a>
                    </div>
                </div>
                    <div className='items-right flex space-x-1'>
                        <a className='flex px-2 py-4' href='#'>
                            <AiOutlineMenu className='h-10 w-10' />
                        </a>
                    </div>
            </div>
        </div>
    </nav>
  )
}

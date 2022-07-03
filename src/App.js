import React, { useEffect, useState } from 'react';
import './App.css';
import Card from './components/Cards';
import NavBar from './components/NavBar';
import Skills from './components/Skills';
import ContactMe from './components/ContactMe';
import Experience from './components/Experience';
import Education from './components/Education';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

function App() {
  const[theme, setTheme] = useState(null);

  useEffect(() => {
    if(window.matchMedia('(prefers-color-scheme: dark)').matches){
      setTheme('light');
    }else{
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if(theme === 'dark'){
      document.documentElement.classList.add('dark');
    }else{
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleThemeSwitch = () => {
    setTheme(theme === 'light' ? 'dark':'light');
    console.log(theme);
  }

  return (
    <div className='bg-white dark:bg-black dark:text-white'>   
      <div className=''>
        <NavBar themeSwitch={handleThemeSwitch} themes={theme}/>
      </div>
      <div className=''>
        <Card />
      </div>
      <div className='mt-20'>
        <Skills />
      </div>
      <div className='mt-20'>
        <Experience />
      </div>
      <div className='mt-20'>
        <Education />
      </div>
      <div className='mt-20'>
        <ContactMe />
      </div>
      <div className='mt-30 mx-auto text-center text-gray-500'>
        <p>©Pramod Phuyal</p>
        <p>2022</p>
      </div>
    </div>
  );
}

export default App;

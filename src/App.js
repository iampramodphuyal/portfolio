// import logo from './logo.svg';
import './App.css';
import Card from './components/Cards';
import NavBar from './components/NavBar';
import Skills from './components/Skills';
import ContactMe from './components/ContactMe';
import Experience from './components/Experience';
import Education from './components/Education';

function App() {
  return (
    <div>
      <div>
        <NavBar />
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

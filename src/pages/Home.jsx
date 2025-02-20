import React from 'react';
import Econ from './assets/ec.png';
import NewsBox from './components/NewsBox';
import Stocks from './components/Stocks';
import RoundNews from './components/newsfetch';
import PinBoard from './components/PinBoard';

function Home() {
  return (
    <>
      <div className='w-screen h-full bg-[#0B091A] overflow-x-hidden relative'>
        {/* RuleBook Link */}
        <a 
          href='https://www.instagram.com/p/DFzyPBgyWmk/?img_index=3&igsh=MXBkdnRiNDJ5ZzlyYQ==' 
          target='_blank' 
          rel='noopener noreferrer'
          className='absolute pt-[3%] md:pt-[6%] right-0 pr-[6%] text-lg md:text-4xl text-white DMSans font-bold'
        >
          RuleBook
        </a>
        
        {/* Main Content */}
        <img src={Econ} alt='Econ' className='w-[20%] h-auto pt-[0.3%] pl-[0.5%]' />
        <PinBoard />
        <RoundNews /> {/* Render NewsBox which will fetch and display round 1 news */}
        <Stocks />
      </div>
    </>
  );
}

export default Home;
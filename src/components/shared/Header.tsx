import { Button } from '../utils/button.tsx';
import { Ghostify } from './Icons.tsx';

export type Header = {
  auth: boolean;
};

const header = ({ auth }: Header) => {
  return (
    <>
      {/* Mobile branding start */}
      <div
        id='mobileSiteIcon'
        className='transition-all lg:hidden fixed left-2 sm:top-4 top-2 z-40'
      >
        <a className='flex flex-col justify-center h-full items-center' href='/'>
          <h1 className='text-xl text-bold text-white font-cookie bg-transparent'>
            Ghostify
          </h1>
          <Ghostify color='w-6 h-6' />
        </a>
      </div>
      <nav className='mobile-nav -translate-x-full text-gray-400 fixed'>
        <ul className='flex flex-col gap-4 w-full'>
          <div className='close-btn absolute right-3'>
            <i className='fa-solid fa-xmark fa-lg'></i>
          </div>
          <li className='flex items-center font-bold justify-center cursor-pointer hover:text-orange-400 transition-all'>
            <a href='/'>Home</a>
          </li>
          <li className='flex items-center font-bold justify-center cursor-pointer hover:text-orange-400 transition-all'>
            <a href='#services'>Products</a>
          </li>
          <li className='flex items-center font-bold justify-center cursor-pointer hover:text-orange-400 transition-all'>
            <a href='/pricing'>Pricing</a>
          </li>
          <li className='flex items-center font-bold justify-center cursor-pointer hover:text-orange-400 transition-all'>
            <a href='/contact'>Contact</a>
          </li>
          {auth ? (
            ''
          ) : (
            <>
              <Button
                content='Get Started'
                elClass='bg-orange-500 text-white w-[98%] mx-auto py-2 bg-orange-400'
              />
              <Button
                content='Login'
                elClass='bg-orange-500 text-white w-[98%] mx-auto py-2 bg-orange-400'
              />
            </>
          )}
        </ul>
      </nav>
      {/* Mobile branding end */}

      {/* Mobile Icon */}
      <div className='lg:hidden bg-transparent transition-all flex gap-x-4 fixed sm:right-8 md:right-10 md:top-8 right-4 top-4 z-50'>
        {auth && (
          <div id='ghostifyPowerMob' className='w-8 transition-all'>
            <i className='fa-solid fa-power-off fa-lg text-white'></i>
          </div>
        )}
        <div className='w-8 mobile-nav-icon transition-all'>
          <div className='w-full h-1 rounded-xl bg-white mb-1'></div>
          <div className='w-full h-1 rounded-xl bg-white mb-1'></div>
          <div className='w-full h-1 rounded-xl bg-white mb-1'></div>
        </div>
      </div>

      {/* Desktop navbar */}
      <nav className='default-nav transition-all w-full h-20 bg-transparent text-gray-400 lg:flex p-3 items-center justify-between hidden fixed top-0 z-10'>
        <div
          id='officialIcon'
          className='flex flex-col p-5 justify-center h-full items-center transition-all mt-10'
        >
          <h1 className='text-4xl text-bold font-cookie bg-transparent'>
            Ghostify
          </h1>
          <img src='/static/SVG/ghost.svg' className='w-12 h-12' alt='' />
        </div>
        <ul className='flex justify-between w-2/4 items-center pr-16'>
          <li className='flex items-center font-bold text-orange-400 justify-center cursor-pointer hover:text-orange-400 transition-all'>
            <a href='/'>Home</a>
          </li>
          <li className='flex items-center font-bold justify-center hover:text-orange-400 transition-all'>
            <a href='#services'>Products</a>
          </li>
          <li className='flex items-center font-bold justify-center hover:text-orange-400 transition-all'>
            <a href='/pricing'>Pricing</a>
          </li>
          <li className='flex items-center font-bold justify-center hover:text-orange-400 transition-all'>
            <a href='/contact'>Contact</a>
          </li>
          {auth ? (
            <li
              id='ghostifyPower'
              className='flex items-center font-bold justify-center cursor-pointer hover:text-orange-400 transition-all w-8 relative left-4 z-50'
            >
              <i className='fa-solid fa-power-off fa-lg text-white'></i>
            </li>
          ) : (
            <>
              <li className='flex items-center font-bold justify-center hover:text-orange-400 transition-all'>
                <Button
                  content='Get Started'
                  link='#'
                  elClass='bg-orange-500 text-white px-8 mx-auto py-2 bg-orange-400'
                />
              </li>
              <li className='flex items-center font-bold justify-center hover:text-orange-400 transition-all'>
                <Button
                  content='Login'
                  link='#'
                  elClass='bg-orange-500 text-white px-8 mx-auto py-2 bg-orange-400'
                />
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Flash notification container */}
      <div id='flash' className='toast toast-top toast-center top-[10rem]'></div>
    </>
  );
};

export default header;

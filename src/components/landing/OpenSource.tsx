import { Heart } from 'lucide-react';
import { Button } from '../utils/button.tsx';

const OpenSourceSection = () => {
  return (
    <section className='py-20 px-6 lg:px-12 bg-background text-foreground relative overflow-hidden'>
      <div className='container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12'>
        <div className='relative flex-1 flex justify-center lg:justify-start'>
          <div className='relative w-full max-w-md h-64 lg:h-96'>
            {/* Illustration - simplified for code, ideally an SVG */}
            <svg
              className='absolute inset-0 w-full h-full'
              viewBox='0 0 500 300'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              {/* Simplified man sitting on chair */}
              <rect
                x='250'
                y='100'
                width='80'
                height='180'
                fill='#E0E0E0'
                rx='10'
              />{' '}
              {/* Chair back */}
              <rect
                x='250'
                y='220'
                width='100'
                height='60'
                fill='#B0B0B0'
                rx='10'
              />{' '}
              {/* Chair seat */}
              <circle cx='280' cy='80' r='30' fill='#FFC107' /> {/* Head */}
              <rect
                x='260'
                y='100'
                width='40'
                height='100'
                fill='#FF8C00'
                rx='5'
              />{' '}
              {/* Body */}
              <path d='M280 180 L290 250 L320 250 L310 180 Z' fill='#FF8C00' />
              {' '}
              {/* Legs */}
              <path
                d='M290 120 C310 100, 340 100, 360 120'
                stroke='#FF8C00'
                strokeWidth='15'
                fill='none'
              />{' '}
              {/* Arm */}

              {/* Heart icon on hand */}
              <Heart
                className='absolute top-1/4 left-[calc(50%+4rem)] transform -translate-x-1/2 -translate-y-1/2'
                size={80}
                fill='oklch(0.65 0.18 50)'
                stroke='none'
              />
              {/* Plants */}
              <path d='M150 280 C160 260, 170 260, 180 280 Z' fill='#339933' />
              <path d='M160 290 C170 270, 180 270, 190 290 Z' fill='#339933' />
              <path d='M140 295 C150 275, 160 275, 170 295 Z' fill='#339933' />
            </svg>
          </div>
        </div>

        <div className='flex-1 text-center lg:text-left'>
          <h2 className='text-5xl lg:text-6xl font-extrabold leading-tight text-foreground mb-8 font-nunito'>
            nous sommes en <span className='text-primary'>Open Source</span>
          </h2>
          <Button className='bg-primary text-primary-foreground px-10 py-4 rounded-md text-xl hover:bg-accent transition-colors font-nunito'>
            Voir sur Github
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OpenSourceSection;

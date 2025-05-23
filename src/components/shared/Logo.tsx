import { Ghostify } from './Icons.tsx';

const Logo = ({...props}: Record<string, unknown>) => (
  <div class='flex flex-col justify-center h-full items-center' {...props}>
    <h1 class='text-xl text-bold dark:text-white text-gray-950 font-cookie bg-transparent'>
      Ghostify
    </h1>
    <Ghostify color='w-6 h-6' />
  </div>
);

export default Logo;

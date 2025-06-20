import { PropsWithChildren } from 'react';
import Sidebar from './sidebar.tsx';

const Wrapper = ({ children }: PropsWithChildren) => {
  return (
    <div id='dashboardContainer' className='grid hide-dash-nav w-full gap-3 h-screen overflow-hidden'>
      <Sidebar />
      {children}
      <script
        type='module'
        src='/static/js/frontend/dashboard/index.js'
      ></script>
    </div>
  );
};

export default Wrapper;

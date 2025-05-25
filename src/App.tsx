import { Route, Routes } from 'react-router-dom';
import Index from './pages/Index.tsx';
import Wrapper from './components/shared/Layout.tsx';
import Login from './pages/Login.tsx';

export default function App() {
  return (
    <Wrapper>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Wrapper>
  );
}

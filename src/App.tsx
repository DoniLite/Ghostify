import { Route, Routes } from 'react-router-dom';
import Index from './pages/Index.tsx';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Index />} />
    </Routes>
  );
}

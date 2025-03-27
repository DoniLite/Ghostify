// import { useState } from 'hono/jsx';
import { render } from 'npm:hono/jsx/dom';
import { BrowserRouter, Routes, Route } from 'npm:react-router';
import Index from './hub/Index.tsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = document.getElementById('root')!;
render(<App />, root);
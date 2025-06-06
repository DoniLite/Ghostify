import { hydrateRoot } from 'react-dom/client';
import App from './src/App.tsx';
import { BrowserRouter } from 'react-router-dom';

hydrateRoot(
  document,
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  {
    onCaughtError(err) {
      console.error('error during the rendering ====> ', err)
    }
  }
);

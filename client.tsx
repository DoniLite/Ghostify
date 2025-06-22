import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './src/App'
import './src/assets/tailwind.css'

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
)

import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'tailwindcss'
import App from './src/App'

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

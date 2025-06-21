import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './src/App.tsx'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <BrowserRouter basename="/Ghostify">
      <App />
    </BrowserRouter>
  )
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TimetableProvider } from './context/TimetableContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TimetableProvider>
      <App />
    </TimetableProvider>
  </StrictMode>,
)

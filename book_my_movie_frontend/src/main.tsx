import { StrictMode } from 'react'
import { Toaster } from "sonner";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Toaster richColors position="top-right" />
    <App />
  </StrictMode>,
)

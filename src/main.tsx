import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async' // 1. Add this import
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 2. Wrap your App inside the provider */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
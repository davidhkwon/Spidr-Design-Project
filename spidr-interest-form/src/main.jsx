import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const footer = document.createElement('div');
footer.className = 'footer';
footer.innerHTML = '© Copyright 2002 - 2025 Spider Design, Inc';
document.body.appendChild(footer);

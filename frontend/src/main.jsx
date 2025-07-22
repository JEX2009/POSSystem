import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import Autenticacion from './autenticacion'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Autenticacion />
  </StrictMode>,
)

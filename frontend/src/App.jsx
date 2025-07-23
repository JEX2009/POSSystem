import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AutenticacionPage } from './pages/AutenticacionPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AutenticacionPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

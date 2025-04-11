import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard'
import PokemonDetail from './components/PokemonDetail/PokemonDetail'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

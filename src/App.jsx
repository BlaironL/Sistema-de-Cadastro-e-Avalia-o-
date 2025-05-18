import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './pages/Layout/Layout';
import Home from './pages/index/index';
import Sobre from './pages/Sobre/Sobre';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Aluno from './pages/Aluno/Aluno';
import Avaliacoes from './pages/Avaliacoes/Avaliacoes';
import Avaliador from './pages/Avaliador/Avaliador';
import Organizador from './pages/Organizador/Organizador';
import Resultados from './pages/Resultados/Resultados';

import './global.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/aluno" element={<Aluno />} />
          <Route path="/avaliacoes" element={<Avaliacoes />} />
          <Route path="/avaliador" element={<Avaliador />} />
          <Route path="/organizador" element={<Organizador />} />
          <Route path="/resultados" element={<Resultados />} />
        </Route>
      </Routes>
    </Router>
  );
}

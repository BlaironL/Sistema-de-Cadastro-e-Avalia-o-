import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './pages/layout';
import Home from './pages/index';
import Sobre from './pages/sobre';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Aluno from './pages/aluno';
import Avaliacoes from './pages/avaliacoes';
import Avaliador from './pages/avaliador';
import Organizador from './pages/organizador';
import Resultados from './pages/resultados';
import './css.css';

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

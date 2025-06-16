import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importe seus componentes de página e layout
import Layout from './pages/layout/layout';
import Home from './pages/index/index';
import Sobre from './pages/sobre/sobre';
import Login from './pages/Login/Login'; 
import Dashboard from './pages/dashboard/dashboard'; // Seu novo dashboard base
import Aluno from './pages/aluno/aluno'; 
import Avaliacoes from './pages/Avaliacoes/Avaliacoes';
import Avaliador from './pages/Avaliador/Avaliador';
import Organizador from './pages/Organizador/Organizador';
import Resultados from './pages/Resultados/resultados'; // Correção de capitalização (resultados)
import CriarEvento from './pages/criar-evento/criar-evento'; 
import GerenciarEventos from './pages/gerenciar-eventos/gerenciar-eventos'; 

// Importe seu CSS global (apenas uma vez, na raiz)
import './global.css';

// Componente principal da aplicação
export default function App() {
  console.log("App.jsx: Componente App renderizando...");
  const [userEmail, setUserEmail] = useState('');
  const [userProfile, setUserProfile] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedProfile = localStorage.getItem('userProfile');
    if (storedEmail && storedProfile) {
      setUserEmail(storedEmail);
      setUserProfile(storedProfile);
    }
  }, []);

  const handleGlobalLogout = () => {
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userEmail');
    setUserEmail('');
    setUserProfile('');
  };

  const handleLoginSuccess = (email, profile) => {
    setUserEmail(email);
    setUserProfile(profile);
  };

  return (
    <Router>
      {console.log("App.jsx: Rotas configuradas")}
      <Routes>
        {/*
          Todas as rotas estão aninhadas dentro do Layout.
          Isso garante que todas as páginas terão o header e footer do Layout,
          e os Context Providers.
        */}
        <Route element={
          <Layout 
            userEmail={userEmail} 
            userProfile={userProfile} 
            handleLogout={handleGlobalLogout} 
          />
        }>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/aluno" element={<Aluno />} />
          <Route path="/avaliacoes" element={<Avaliacoes />} />
          <Route path="/avaliador" element={<Avaliador />} />
          <Route path="/organizador" element={<Organizador />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/criar-evento" element={<CriarEvento />} />
          <Route path="/gerenciar-eventos" element={<GerenciarEventos />} />
        </Route>
      </Routes>
    </Router>
  );
}
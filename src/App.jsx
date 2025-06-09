import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importe seus componentes de página e layout
import Layout from './pages/Layout/Layout';
import Home from './pages/index/index';
import Sobre from './pages/sobre/sobre';
import Login from './pages/Login/Login'; 
import Dashboard from './pages/Dashboard/Dashboard';
import Aluno from './pages/Aluno/Aluno'; 
import Avaliacoes from './pages/Avaliacoes/Avaliacoes';
import Avaliador from './pages/Avaliador/Avaliador';
import Organizador from './pages/Organizador/Organizador';
import Resultados from './pages/Resultados/Resultados';

// Importe seu CSS global (apenas uma vez, na raiz)
import './global.css';

// Componente principal da aplicação
export default function App() {
  console.log("App.jsx: Componente App renderizando..."); // DEBUG LOG
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
      {console.log("App.jsx: Rotas configuradas")} {/* DEBUG LOG */}
      <Routes>
        {/*
          AGORA TODAS AS ROTAS ESTÃO ANINHADAS DENTRO DO LAYOUT.
          Isso garante que todas as páginas, incluindo /login e /,
          terão o header e footer do Layout.
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
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} /> {/* Login também usa o Layout */}
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
// src/App.jsx
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Importe Navigate


// Importe seus componentes de página e layout
import Layout from './pages/layout/layout';
import Home from './pages/index/index';
import Sobre from './pages/sobre/sobre';
import Login from './pages/Login/Login'; 
import Dashboard from './pages/dashboard/dashboard'; 
import Organizador from './pages/Organizador/Organizador';
import Resultados from './pages/Resultados/resultados'; 
import CriarEvento from './pages/criar-evento/criar-evento'; 
import GerenciarEventos from './pages/gerenciar-eventos/gerenciar-eventos'; 
import Cadastro from './pages/cadastro/cadastro'; 
import CriarProjeto from './pages/criar-projeto/criar-projeto'; 
import VerProjetos from './pages/ver-projetos/ver-projetos'; 
import AvaliarProjeto from './pages/avaliar-projeto/avaliar-projeto'; 
import SolicitarAvaliacao from './pages/solicitar-ava/solicitar-avaliacao'; 
import SolicitarOrg from './pages/solicitar-org/solicitar-org'; 
import MeuPerfil from './pages/meu-perfil/meu-perfil'; 
import Config from './pages/config/config'; 

// Importe seus Provedores de Contexto
import { NotificationProvider } from './pages/contexts/NotificationContext'; 
import { EventProjectProvider } from './pages/contexts/EventProjectContext'; 

// Importe o componente de debug (REMOVER EM PRODUÇÃO)
import DebugClearData from './DebugClearData'; 

// Importe o componente VLibras
import VLibras from './pages/contexts/VLibras';

// Importe seu CSS global
import './global.css';

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

  const handleGlobalLogout = (navigateFunc) => { 
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('events');
    localStorage.removeItem('notifications');
    localStorage.removeItem('hasTestEventsAdded');
    localStorage.removeItem('hasAttemptedToAddTestEvents');
    setUserEmail('');
    setUserProfile('');
    navigateFunc('/login');
  };

  const handleLoginSuccess = (email, profile) => {
    setUserEmail(email);
    setUserProfile(profile);
  };

  return (
    // O basename deve ser o caminho do repositório, sem a barra inicial para o Router
    // O React Router lida com isso internamente.
    <Router basename="/Sistema-de-Cadastro-e-Avalia-o-"> 
      {console.log("App.jsx: Rotas configuradas")}

      <NotificationProvider>
        <EventProjectProvider>

          {/* Componente de debug (REMOVER EM PRODUÇÃO) */}
          <DebugClearData />

          {/* Componente VLibras */}
          <VLibras />

          <Routes>
            <Route element={
              <Layout 
                userEmail={userEmail} 
                userProfile={userProfile} 
                handleLogout={handleGlobalLogout} 
              />
            }>

              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />


              {/* Rota inicial para o diretório raiz do basename */}
              <Route path="/" element={<Home />} /> 
              {/* Outras rotas permanecem como estão */}

              <Route path="/sobre" element={<Sobre />} />
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/organizador" element={<Organizador />} />
              <Route path="/resultados" element={<Resultados />} />
              <Route path="/criar-evento" element={<CriarEvento />} />
              <Route path="/gerenciar-eventos" element={<GerenciarEventos />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/criar-projeto" element={<CriarProjeto />} />
              <Route path="/ver-projetos" element={<VerProjetos />} />
              <Route path="/avaliar-projeto" element={<AvaliarProjeto />} />
              <Route path="/solicitar-avaliacao" element={<SolicitarAvaliacao />} />
              <Route path="/solicitar-org" element={<SolicitarOrg />} />
              <Route path="/meu-perfil" element={<MeuPerfil />} />
              <Route path="/config" element={<Config />} />
            </Route>
          </Routes>

        </EventProjectProvider>
      </NotificationProvider>
    </Router>
  );
}


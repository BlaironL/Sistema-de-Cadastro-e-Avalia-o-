import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importe seus componentes de página e layout
import Layout from './pages/layout/layout';
import Home from './pages/index/index';
import Sobre from './pages/sobre/sobre';
import Login from './pages/Login/Login'; 
import Dashboard from './pages/dashboard/dashboard'; 
import Avaliacoes from './pages/Avaliacoes/Avaliacoes';
import Avaliador from './pages/Avaliador/Avaliador';
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

// Importe seus Provedores de Contexto
// Assume que a pasta 'contexts' está dentro de 'pages'
import { NotificationProvider } from './pages/contexts/NotificationContext'; 
import { EventProjectProvider } from './pages/contexts/EventProjectContext'; 

// Importe o componente de debug (caminho relativo à raiz src)
// Certifique-se de criar a pasta src/components/
import DebugClearData from './DebugClearData'; 

// Importe seu CSS global (apenas uma vez, na raiz)
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

  const handleGlobalLogout = () => {
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userEmail');
    // Limpe também os dados de eventos e notificações do localStorage ao deslogar
    localStorage.removeItem('events');
    localStorage.removeItem('notifications');
    localStorage.removeItem('hasTestEventsAdded'); // Flag de teste de eventos
    localStorage.removeItem('hasAttemptedToAddTestEvents'); // Flag de tentativa de adição de eventos de teste

    setUserEmail('');
    setUserProfile('');
    // Redirecionar para a página de login após o logout
    window.location.href = '/login'; 
  };

  const handleLoginSuccess = (email, profile) => {
    setUserEmail(email);
    setUserProfile(profile);
  };

  return (
    <Router>
      {console.log("App.jsx: Rotas configuradas")}
      
      <NotificationProvider>
        <EventProjectProvider>
          
          {/* Componente de debug para limpar dados de teste no console (REMOVER EM PRODUÇÃO) */}
          <DebugClearData /> 

          <Routes>
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
              <Route path="/avaliacoes" element={<Avaliacoes />} />
              <Route path="/avaliador" element={<Avaliador />} />
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
            </Route>
          </Routes>

        </EventProjectProvider>
      </NotificationProvider>
    </Router>
  );
}
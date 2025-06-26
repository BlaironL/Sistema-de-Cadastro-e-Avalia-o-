import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../../global.css'; // O seu CSS global
import './layout.css'; // Estilos específicos do Layout

// Importe os provedores de contexto
import { NotificationProvider, NotificationWidget } from "../contexts/NotificationContext.jsx";
import { EventProjectProvider } from "../contexts/EventProjectContext.jsx";

// O componente Layout recebe userEmail e userProfile como props,
// que indicam o estado de autenticação do utilizador.
export default function Layout({ userEmail, userProfile, handleLogout }) {
    console.log("Layout.jsx: Componente Layout a ser renderizado...");
    const location = useLocation();
    const navigate = useNavigate(); // Hook useNavigate

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null); // Ref para o menu dropdown do cabeçalho

    // Função para lidar com o logout, incluindo uma confirmação
    const handleLogoutWithConfirmation = () => {
        const confirmLogout = window.confirm("Tem certeza que deseja sair?");
        if (confirmLogout) {
            handleLogout(); // Chama a função de logout passada via props
            navigate('/login'); // Redireciona para a página de login
            setIsMenuOpen(false); // Fecha o menu dropdown
        }
    };

    // Efeito para fechar o MENU DROPDOWN do cabeçalho ao clicar fora dele
    useEffect(() => {
        function handleClickOutside(event) {
            // Verifica se o clique foi fora do menu dropdown principal
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false); // Fecha o menu do cabeçalho
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []); // Dependência vazia, executa apenas na montagem e desmontagem

    // Alterna o estado de abertura/fechamento do menu dropdown do cabeçalho
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    // Função para navegar e fechar o menu do cabeçalho
    const handleMenuItemClick = (path) => {
        navigate(path);
        setIsMenuOpen(false); // Fecha o menu após a navegação
    };

    // Verifica se o utilizador está autenticado. userEmail será nulo ou vazio antes do login.
    const isAuthenticated = !!userEmail; // Converte para booleano: true se userEmail não for nulo/vazio

    // Efeito para carregar e inicializar o VLibras (este bloco está correto e permanece)
    useEffect(() => {
        // Verifica se o script já foi carregado
        if (!document.getElementById('vlibras-script')) {
            const script = document.createElement('script');
            script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
            script.id = 'vlibras-script'; // Adiciona um ID para evitar carregamento duplicado
            script.onload = () => {
                // Tenta inicializar o widget após o script carregar
                if (window.VLibras) {
                    new window.VLibras.Widget('https://vlibras.gov.br/app');
                } else {
                    console.error("VLibras object not found after script load.");
                }
            };
            script.onerror = (error) => {
                console.error("Failed to load VLibras script:", error);
            };
            document.body.appendChild(script);
        }

        return () => {}; // Sem limpeza específica necessária aqui para o VLibras
    }, []); // Array de dependências vazio para executar apenas uma vez na montagem

    return (
        // Os provedores de contexto envolvem toda a aplicação para que os dados fiquem disponíveis
        <NotificationProvider>
            <EventProjectProvider>
                {console.log("Layout.jsx: NotificationProvider e EventProjectProvider a envolver conteúdo")}
                <div className="app-main-container">

                    <header className="home-header">
                        <div className="header-left-content">
                            <h1 className="logo-text">SCAP</h1>
                            <p className="subtitulo">Sistema de Cadastro e Avaliação de Projetos.</p>
                        </div>

                        {/* Renderiza o menu dropdown e o botão de alternar APENAS se o utilizador estiver autenticado */}
                        {isAuthenticated && ( // <--- Renderização Condicional: Apenas se autenticado
                            <div className="header-right-content" ref={menuRef}>
                                <button onClick={toggleMenu} className="menu-toggle-btn">☰</button>
                                <div className={`dropdown-menu ${isMenuOpen ? 'active' : ''}`}>
                                    <ul>
                                        {/* Exibe o e-mail do utilizador autenticado no menu */}
                                        <li><span>Olá, {userEmail || 'Utilizador'}</span></li>
                                        {/* LINKS AGORA USAM handleMenuItemClick */}
                                        <li><button onClick={() => handleMenuItemClick('/meu-perfil')}>O Meu Perfil</button></li>
                                        <li><button onClick={() => handleMenuItemClick('/config')}>Configurações</button></li>
                                        <li><button onClick={handleLogoutWithConfirmation} className="menu-logout-btn">Sair</button></li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </header>

                    {/*
                        Renderize o NotificationWidget AQUI, logo abaixo do cabeçalho,
                        mas APENAS se o utilizador estiver autenticado (logado).
                        Se userEmail for verdadeiro (não nulo/vazio), o widget será exibido.
                    */}
                    {isAuthenticated && ( // <--- CHAVE! Renderização Condicional
                        <NotificationWidget />
                    )}

                    <main className="global-main-content">
                        {console.log("Layout.jsx: Outlet a ser renderizado")}
                        <Outlet /> {/* Aqui é onde o conteúdo da rota atual é renderizado */}
                    </main>

                    {/* ELEMENTOS VLIBRAS: REMOVIDOS DESTE FICHEIRO. DEVE ESTAR APENAS NO index.html PARA PROJETOS VITE */}
                    {/* (Bloco comentado ou removido para evitar avisos e erros) */}

                    {/* O seu rodapé existente */}
                    <footer className="main-footer">
                        <div className="footer-content">
                            <div className="footer-section about">
                                <h3>Sobre o SCAP</h3>
                                <p>O Sistema de Cadastro e Avaliação de Projetos (SCAP) é uma plataforma dedicada a simplificar a gestão de eventos académicos e a avaliação de projetos.</p>
                                <p>A nossa missão é impulsionar a inovação e o conhecimento, conectando organizadores, alunos e avaliadores de forma eficiente e transparente.</p>
                            </div>

                            <div className="footer-section links">
                                <h3>Links Rápidos</h3>
                                <ul>
                                    <li><a href="/">Início</a></li>
                                    <li><a href="/sobre">Sobre Nós</a></li>
                                </ul>
                            </div>

                            <div className="footer-section social">
                                <h3>Conecte-se</h3>
                                <div className="social-icons">
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                        <img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="[Imagem do ícone do Facebook]" />
                                    </a>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                        <img src="https://img.icons8.com/ios-filled/50/000000/twitter--v1.png" alt="[Imagem do ícone do Twitter]" />
                                    </a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                        <img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="[Imagem do ícone do Instagram]" />
                                    </a>
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                        <img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="[Imagem do ícone do LinkedIn]" />
                                    </a>
                                </div>
                            </div>

                            <div className="footer-section contact">
                                <h3>Contacto</h3>
                                <p>E-mail: <a href="mailto:contato@scap.com">blaironapple@gmail.com</a></p>
                                <p>Telefone: (99) 99919-7301</p>
                                <p>Floriano, PI, Brasil</p>
                            </div>
                        </div>

                        <div className="footer-bottom">
                            <p>&copy; {new Date().getFullYear()} <strong>SCAP</strong> – Todos os direitos reservados.</p>
                        </div>
                    </footer>
                </div>
            </EventProjectProvider>
        </NotificationProvider>
    );
}
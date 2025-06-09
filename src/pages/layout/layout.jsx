import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../../global.css'; // Seu CSS global
import './layout.css'; // Estilos específicos do Layout

// Importe APENAS o provedor de notificações aqui
import { NotificationProvider } from "../contexts/NotificationContext"; 

export default function Layout({ userEmail, userProfile, handleLogout }) {
    console.log("Layout.jsx: Componente Layout renderizando..."); // DEBUG LOG
    const location = useLocation();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Função de logout que inclui a confirmação
    // Esta função SOBRESCREVE a handleLogout passada pelo App.jsx (que é apenas para limpar localStorage)
    // Se a handleLogout global no App.jsx já inclui a navegação, este é o lugar para a confirmação.
    const handleLogoutWithConfirmation = () => {
        const confirmLogout = window.confirm("Tem certeza que deseja sair?");
        if (confirmLogout) {
            handleLogout(); // Chama a função handleLogout (que vem do App.jsx) para limpar o localStorage e navegar
            setIsMenuOpen(false); // Fecha o menu após sair
        }
    };


    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };
    
    return (
        <NotificationProvider> 
            {console.log("Layout.jsx: NotificationProvider envolvendo conteúdo")} {/* DEBUG LOG */}
            <div className="app-main-container"> 
                
                <header className="home-header"> 
                    <div className="header-left-content">
                        <h1 className="logo-text">SCAP</h1>
                        <p className="subtitulo">Sistema de Cadastro e Avaliacao de Projetos.</p>
                        <link href="https://fonts.googleapis.com/css2?family=Jersey+25&display=swap" rel="stylesheet" />
                    </div>
                    
                    {userEmail && ( // Renderiza o menu de usuário apenas se o usuário estiver logado
                        <div className="header-right-content" ref={menuRef}>
                            <button onClick={toggleMenu} className="menu-toggle-btn">☰</button>
                            <div className={`dropdown-menu ${isMenuOpen ? 'active' : ''}`}>
                                <ul>
                                    {/* REMOVIDO: Informações do usuário DENTRO do menu dropdown (Olá, email!) */}
                                    {/* <li>
                                        <span className="dropdown-user-info">
                                            Olá, <span id="userNameDisplay">{userEmail}</span>!
                                            (<span id="userProfileDisplay">{userProfile.charAt(0).toUpperCase() + userProfile.slice(1)}</span>)
                                        </span>
                                    </li> */}
                                    <li><a href="#">Meu Perfil</a></li> 
                                    <li><a href="#">Configurações</a></li> 
                                    {/* Usar handleLogoutWithConfirmation para o botão Sair */}
                                    <li><button onClick={handleLogoutWithConfirmation} className="menu-logout-btn">Sair</button></li>
                                </ul>
                            </div>
                        </div>
                    )}
                </header>

                <main className="global-main-content"> 
                    {console.log("Layout.jsx: Outlet sendo renderizado")} {/* DEBUG LOG */}
                    <Outlet /> 
                </main>

                <footer className="home-footer">
                    <p><strong>SCAP</strong> – Todos os direitos reservados.</p>
                </footer>
            </div>
        </NotificationProvider>
    );
}
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../../global.css'; // Seu CSS global
import './layout.css'; // Estilos específicos do Layout

// Importe os provedores de contexto
import { NotificationProvider } from "../contexts/NotificationContext.jsx"; 
import { EventProjectProvider } from "../contexts/EventProjectContext.jsx"; 

export default function Layout({ userEmail, userProfile, handleLogout }) {
    console.log("Layout.jsx: Componente Layout renderizando...");
    const location = useLocation();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLogoutWithConfirmation = () => {
        const confirmLogout = window.confirm("Tem certeza que deseja sair?");
        if (confirmLogout) {
            handleLogout(); 
            navigate('/login'); 
            setIsMenuOpen(false); 
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
        // Envolver a aplicação com AMBOS os provedores de contexto aqui
        <NotificationProvider> 
            <EventProjectProvider> 
                {console.log("Layout.jsx: NotificationProvider e EventProjectProvider envolvendo conteúdo")}
                <div className="app-main-container"> 
                    
                    <header className="home-header"> 
                        <div className="header-left-content">
                            <h1 className="logo-text">SCAP</h1>
                            <p className="subtitulo">Sistema de Cadastro e Avaliacao de Projetos.</p>
                        </div>
                        
                        {userEmail && ( 
                            <div className="header-right-content" ref={menuRef}>
                                <button onClick={toggleMenu} className="menu-toggle-btn">☰</button>
                                <div className={`dropdown-menu ${isMenuOpen ? 'active' : ''}`}>
                                    <ul>
                                        <li>
                                            <span className="dropdown-user-info">
                                                Olá, <span id="userNameDisplay">{userEmail}</span>!
                                                (<span id="userProfileDisplay">{userProfile.charAt(0).toUpperCase() + userProfile.slice(1)}</span>)
                                            </span>
                                        </li>
                                        <li><a href="#">Meu Perfil</a></li> 
                                        <li><a href="#">Configurações</a></li> 
                                        <li><button onClick={handleLogoutWithConfirmation} className="menu-logout-btn">Sair</button></li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </header>

                    <main className="global-main-content"> 
                        {console.log("Layout.jsx: Outlet sendo renderizado")}
                        <Outlet /> 
                    </main>

                    <footer className="home-footer">
                        <p><strong>SCAP</strong> – Todos os direitos reservados.</p>
                    </footer>
                </div>
            </EventProjectProvider> 
        </NotificationProvider>
    );
}
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

                    {/* NOVO FOOTER GRANDE E DETALHADO */}
                    <footer className="main-footer">
                        <div className="footer-content">
                            <div className="footer-section about">
                                <h3>Sobre o SCAP</h3>
                                <p>O Sistema de Cadastro e Avaliação de Projetos (SCAP) é uma plataforma dedicada a simplificar a gestão de eventos acadêmicos e a avaliação de projetos.</p>
                                <p>Nossa missão é impulsionar a inovação e o conhecimento, conectando organizadores, alunos e avaliadores de forma eficiente e transparente.</p>
                            </div>

                            <div className="footer-section links">
                                <h3>Links Rápidos</h3>
                                <ul>
                                    <li><a href="/">Home</a></li>
                                    <li><a href="/dashboard">Dashboard</a></li>
                                    <li><a href="/criar-evento">Criar Evento</a></li>
                                    <li><a href="/gerenciar-eventos">Gerenciar Eventos</a></li>
                                    <li><a href="/sobre">Sobre Nós</a></li>
                                </ul>
                            </div>

                            <div className="footer-section social">
                                <h3>Conecte-se</h3>
                                <div className="social-icons">
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                        <img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook" />
                                    </a>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                        <img src="https://img.icons8.com/ios-filled/50/000000/twitter--v1.png" alt="Twitter" />
                                    </a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                        <img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram" />
                                    </a>
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                        <img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn" />
                                    </a>
                                </div>
                            </div>

                            <div className="footer-section contact">
                                <h3>Contato</h3>
                                <p>Email: <a href="mailto:contato@scap.com">blaironapple@gmail.com</a></p>
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
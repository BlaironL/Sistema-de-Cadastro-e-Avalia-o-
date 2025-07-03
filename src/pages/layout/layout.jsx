import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom'; // Importe Link
import '../../global.css';
import './layout.css';

import { NotificationProvider, NotificationWidget } from "../../contexts/NotificationContext.jsx";
import { EventProjectProvider } from "../../contexts/EventProjectContext.jsx";

export default function Layout({ userEmail, userProfile, handleLogout }) {
    const location = useLocation();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLogoutWithConfirmation = () => {
        const confirmLogout = window.confirm("Tem certeza que deseja sair?");
        if (confirmLogout) {
            handleLogout(navigate); // Passa navigate para a função de logout do App.jsx
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

    const isAuthenticated = !!userEmail;

    return (
        <NotificationProvider>
            <EventProjectProvider>
                <div className="app-main-container">

                    <header className="home-header">
                        <div className="header-left-content">
                            <h1 className="logo-text">SCAP</h1>
                            <p className="subtitulo">Sistema de Cadastro e Avaliação de Projetos.</p>
                        </div>

                        {isAuthenticated && (
                            <div className="header-right-content" ref={menuRef}>
                                <button onClick={toggleMenu} className="menu-toggle-btn">☰</button>
                                <div className={`dropdown-menu ${isMenuOpen ? 'active' : ''}`}>
                                    <ul>
                                        <li><span>Olá, {userEmail || 'Utilizador'}</span></li>
                                        {/* ATUALIZADO: Usando Link para navegação interna */}
                                        <li><Link to="/meu-perfil" onClick={() => setIsMenuOpen(false)}>O Meu Perfil</Link></li>
                                        <li><Link to="/config" onClick={() => setIsMenuOpen(false)}>Configurações</Link></li>
                                        <li><button onClick={handleLogoutWithConfirmation} className="menu-logout-btn">Sair</button></li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </header>

                    {isAuthenticated && (
                        <NotificationWidget />
                    )}

                    <main className="global-main-content">
                        <Outlet />
                    </main>

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
                                    {/* ATUALIZADO: Usando Link para navegação interna */}
                                    <li><Link to="/home">Início</Link></li> {/* Rota /home para a página inicial real */}
                                    <li><Link to="/sobre">Sobre Nós</Link></li>
                                </ul>
                            </div>

                            <div className="footer-section social">
                                <h3>Conecte-se</h3>
                                <div className="social-icons">
                                    {/* Estes são links externos, podem permanecer como <a> */}
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
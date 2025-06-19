import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from "../contexts/NotificationContext.jsx";
import './dashboard.css'; // Estilos específicos do dashboard

// --- Componente da Sidebar de Notificações ---
const NotificationsSidebar = ({ isOpen, onClose }) => {
    const { notifications, markAsRead, removeNotification, addNotification } = useNotifications();
    const [expandedNotificationId, setExpandedNotificationId] = useState(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const toggleExpand = (id) => {
        setExpandedNotificationId(prevId => {
            const nextExpandedId = prevId === id ? null : id;
            if (nextExpandedId !== null && nextExpandedId !== prevId) {
                markAsRead(id);
            }
            return nextExpandedId;
        });
    };

    const handleAcceptInvite = (e, notifId, details) => {
        e.stopPropagation();
        addNotification(`Convite aceito para ${details.role === 'avaliador' ? 'avaliar' : 'organizar'}!`, 'info');
        removeNotification(notifId);
        setExpandedNotificationId(null);
    };

    const handleDeclineInvite = (e, notifId, details) => {
        e.stopPropagation();
        addNotification(`Convite recusado para ${details.role === 'avaliador' ? 'avaliar' : 'organizar'}.`, 'info');
        removeNotification(notifId);
        setExpandedNotificationId(null);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div ref={sidebarRef} className={`notifications-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h3>Notificações ({unreadCount} não lidas)</h3> 
                <button className="close-sidebar-btn" onClick={onClose}>&times;</button>
            </div>
            <ul className="notification-list">
                {notifications.length > 0 ? (
                    notifications.map(notif => {
                        const isExpanded = expandedNotificationId === notif.id;
                        return (
                            <li
                                key={notif.id}
                                className={`notification-item notification-${notif.type} ${notif.read ? 'read' : ''} ${isExpanded ? 'expanded' : ''}`}
                                onClick={() => toggleExpand(notif.id)}
                            >
                                <span className="notification-icon">
                                    {notif.type === 'convite' && '✉️'}
                                    {notif.type === 'info' && '✅'}
                                    {notif.type === 'evento' && '🗓️'}
                                    {notif.type === 'alerta' && '⚠️'}
                                </span>
                                <div className="notification-content-wrapper">
                                    <div className="notification-main-content">
                                        {notif.message}
                                        <span className="notification-timestamp">{new Date(notif.timestamp).toLocaleString()}</span>
                                    </div>
                                    <button
                                        className="remove-notification-btn"
                                        onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                                    >
                                        &times;
                                    </button>
                                    <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>&#9660;</span>
                                </div>

                                {isExpanded && (
                                    <div className="notification-expanded-content">
                                        <p className="expanded-details">
                                            {notif.type === 'convite' && notif.details?.role === 'avaliador' &&
                                                `Detalhes: Você foi convidado para avaliar o Evento "${notif.details?.eventId || 'Evento Desconhecido'}". ` +
                                                (notif.details?.additionalInfo ? `(${notif.details.additionalInfo})` : '')
                                            }
                                            {notif.type === 'convite' && notif.details?.role === 'organizador_colab' &&
                                                `Detalhes: Você foi convidado para colaborar no projeto "${notif.details?.projectId || 'Projeto Desconhecido'}". ` +
                                                (notif.details?.team ? `(Equipe: ${notif.details.team})` : '')
                                            }
                                            {notif.type !== 'convite' && `Mais informações sobre esta notificação do tipo '${notif.type}'.`}
                                        </p>
                                        {notif.type === 'convite' && (
                                            <div className="notification-actions-buttons">
                                                <button
                                                    className="btn-accept"
                                                    onClick={(e) => handleAcceptInvite(e, notif.id, notif.details)}
                                                >
                                                    Aceitar
                                                </button>
                                                <button
                                                    className="btn-decline"
                                                    onClick={(e) => handleDeclineInvite(e, notif.id, notif.details)}
                                                >
                                                    Recusar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </li>
                        );
                    })
                ) : (
                    <p className="no-notifications">Nenhuma notificação por enquanto.</p>
                )}
            </ul>
        </div>
    );
};

// --- Componente do Cartão de Dashboard ---
const DashboardCard = ({ title, description, onClick, className = '' }) => {
    return (
        <div className={`dashboard-card ${className}`} onClick={onClick}>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

// --- Componente Principal do Dashboard ---
export default function Dashboard() {
    const [userProfile, setUserProfile] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { addNotification, notifications } = useNotifications();

    useEffect(() => {
        const storedProfile = localStorage.getItem('userProfile');
        const storedEmail = localStorage.getItem('userEmail');

        console.log("Dashboard.jsx: userProfile lido do localStorage:", storedProfile);

        if (storedProfile) {
            setUserProfile(storedProfile);
            setUserEmail(storedEmail || 'Usuário');

            setTimeout(() => {
                console.log("Dashboard.jsx: Disparando addNotification (testes)...");
                addNotification(`Bem-vindo(a) de volta, ${storedEmail}!`, 'info');
                addNotification('Você foi convidado(a) para avaliar o Evento "Tech Summit 2025"!', 'convite', { eventId: 'tech_summit_2025', role: 'avaliador', additionalInfo: 'Prazo até 15/07' });
                addNotification('Convite: Ajude a organizar o projeto "App de Impacto Social"!', 'convite', { projectId: 'app_social_impact', role: 'organizador_colab', team: 'Equipe Alpha' });
                addNotification('Seu projeto "Inovação Sustentável" foi APROVADO para o evento!', 'info');
                addNotification('Atenção: Prazo final para avaliações do Evento X se aproxima.', 'alerta');
            }, 1000);
        } else {
            alert('Sessão expirada ou não iniciada. Faça login novamente.');
            navigate('/login');
        }
    }, [navigate, addNotification]);

    const renderOptions = () => {
        return [
            <DashboardCard
                key="createEvent"
                title="Criar Novo Evento"
                description="Configure um novo evento e defina seus detalhes."
                onClick={() => navigate('/criar-evento')}
            />,
            <DashboardCard
                key="manageMyEvents"
                title="Gerenciar Meus Eventos"
                description="Acompanhe e gerencie todos os eventos que você criou."
                onClick={() => navigate('/gerenciar-eventos')}
            />,
            <DashboardCard
                key="submitNewProject"
                title="Enviar Novo Projeto"
                description="Submeta seu projeto para avaliação em um evento existente."
                onClick={() => navigate('/criar-projeto')}
            />,
            <DashboardCard
                key="viewMyProjects"
                title="Meus Projetos Anteriores"
                description="Visualize o status de seus projetos já submetidos."
                onClick={() => navigate('/ver-projetos')}
            />,
            <DashboardCard
                key="requestEvaluate"
                title="Solicitar Avaliação de Evento"
                description="Envie uma solicitação para avaliar projetos em um evento."
                onClick={() => alert('Navegar para tela de Solicitação de Avaliação')}
            />,
            <DashboardCard
                key="requestOrganize"
                title="Solicitar Colaboração em Organização"
                description="Ofereça ajuda na organização de um evento ou projeto."
                onClick={() => alert('Navegar para tela de Solicitação de Colaboração')}
            />
        ];
    };

    const unreadNotificationCount = notifications.filter(n => !n.read).length;

    return (
        <div className="dashboard-page-container">
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
            <NotificationsSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="dashboard-main-content-wrapper">
                {/* Ícone de Notificações com contador */}
                <div className="notifications-icon-wrapper" onClick={() => setIsSidebarOpen(true)}>
                    <span className="material-icons notifications-icon">notifications</span>
                    {unreadNotificationCount > 0 && (
                        <span id="notification-badge-id">{unreadNotificationCount}</span>
                    )}
                </div>

                <h1 className="dashboard-motto">
                    Inove, avalie, destaque-se.<br />
                    Sua jornada de projeto começa aqui.
                </h1>

                <div className="dashboard-actions-section">
                    <h2>O que você gostaria de fazer?</h2>
                    <div className="dashboard-options-grid">
                        {renderOptions()}
                    </div>
                </div>
            </div>
        </div>
    );
}

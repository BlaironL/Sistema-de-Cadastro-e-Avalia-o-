import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css'; // Estilos específicos do dashboard

// Importe o hook useNotifications para adicionar e gerenciar notificações
import { useNotifications } from "../contexts/NotificationContext.jsx";
// Importe o hook useEventsProjects (se for usado no Dashboard, caso contrário, pode remover)
// import { useEventsProjects } from "../contexts/EventProjectContext.jsx"; 

export default function Dashboard() {
    const [userProfile, setUserProfile] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();
    const { addNotification } = useNotifications(); 

    useEffect(() => {
        const storedProfile = localStorage.getItem('userProfile');
        const storedEmail = localStorage.getItem('userEmail');

        console.log("Dashboard.jsx: userProfile lido do localStorage:", storedProfile); 

        if (storedProfile) {
            setUserProfile(storedProfile);
            setUserEmail(storedEmail || 'Usuário');

            // Notificações de teste ao carregar o Dashboard
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
        const options = [];

        // --- TODAS AS OPÇÕES APARECEM PARA QUALQUER PERFIL AGORA ---

        // Opções relacionadas a Eventos e Projetos
        options.push(
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
                onClick={() => alert('Navegar para tela de Envio de Projeto')} // Rota futura: /enviar-projeto
            />,
            <DashboardCard
                key="viewMyProjects"
                title="Meus Projetos Anteriores"
                description="Visualize o status de seus projetos já submetidos."
                onClick={() => alert('Navegar para tela de Meus Projetos')} // Rota futura: /meus-projetos
            />,
            <DashboardCard
                key="requestEvaluate"
                title="Solicitar Avaliação de Evento"
                description="Envie uma solicitação para avaliar projetos em um evento."
                onClick={() => alert('Navegar para tela de Solicitação de Avaliação')} // Rota futura: /solicitar-avaliacao
            />,
            <DashboardCard
                key="requestOrganize"
                title="Solicitar Colaboração em Organização"
                description="Ofereça ajuda na organização de um evento ou projeto."
                onClick={() => alert('Navegar para tela de Solicitação de Colaboração')} // Rota futura: /solicitar-organizacao
            />
        );
        
        return options;
    };

    // --- Componente interno para exibir as notificações ---
    const NotificationsPanel = () => {
        const { notifications, markAsRead, removeNotification, addNotification } = useNotifications(); 
        const [expandedNotificationId, setExpandedNotificationId] = useState(null); 

        console.log("NotificationsPanel: Notificações recebidas do contexto:", notifications); 
        console.log("NotificationsPanel: Notificação expandida ID:", expandedNotificationId); 

        // Ajuste na função toggleExpand: Lógica mais robusta para marcar como lida e expandir
        const toggleExpand = (id) => {
            console.log("Toggle expand para ID:", id); 
            
            // Usar atualização funcional para garantir que estamos trabalhando com o estado mais recente
            setExpandedNotificationId(prevId => {
                const nextExpandedId = prevId === id ? null : id; // Se já estiver expandido, contrai; senão, expande
                
                // Só marca como lida se estiver expandindo para uma nova notificação
                if (nextExpandedId !== null && nextExpandedId !== prevId) {
                    markAsRead(id); 
                }
                return nextExpandedId;
            });
        };

        const handleAcceptInvite = (e, notifId, details) => { 
            e.stopPropagation(); 
            alert(`Convite ACEITO! Detalhes: ${JSON.stringify(details)}. Notificação: ${notifId}`);
            addNotification(`Convite aceito para ${details.role === 'avaliador' ? 'avaliar' : 'organizar'}.`, 'info');
            removeNotification(notifId); 
            setExpandedNotificationId(null); 
        };

        const handleDeclineInvite = (e, notifId, details) => { 
            e.stopPropagation(); 
            alert(`Convite RECUSADO! Detalhes: ${JSON.stringify(details)}. Notificação: ${notifId}`);
            addNotification(`Convite recusado para ${details.role === 'avaliador' ? 'avaliar' : 'organizar'}.`, 'info');
            removeNotification(notifId); 
            setExpandedNotificationId(null); 
        };


        return (
            <div className="notifications-panel">
                <h3>Notificações ({notifications.filter(n => !n.read).length} não lidas)</h3>
                {notifications.length > 0 ? (
                    <ul className="notification-list">
                        {notifications.map(notif => {
                            const isExpanded = expandedNotificationId === notif.id;
                            console.log(`Notificação ID: ${notif.id}, isExpanded: ${isExpanded}, read: ${notif.read}, Type: ${notif.type}, Details: ${JSON.stringify(notif.details)}`);
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
                                    <div className="notification-content">
                                        {notif.message}
                                        <span className="notification-timestamp">{new Date(notif.timestamp).toLocaleString()}</span>
                                    </div>
                                    <button
                                        className="remove-notification-btn"
                                        onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }} 
                                    >
                                        &times; {/* Símbolo de 'x' para fechar */}
                                    </button>
                                    
                                    {/* Ícone de expansão/contração */}
                                    <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>&#9660;</span> {/* Triângulo para baixo/cima */}

                                    {/* Conteúdo expandido para notificações de convite e outros tipos */}
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
                                                {/* Para notificações que NÃO são de convite, um detalhe genérico */}
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
                        })}
                    </ul>
                ) : (
                    <p className="no-notifications">Nenhuma notificação por enquanto.</p>
                )}
            </div>
        );
    };

    return (
        <div className="dashboard-main-content-wrapper"> 
            <h1 className="dashboard-motto">
                Inove, avalie, destaque-se.<br />
                Sua jornada de projeto começa aqui.
            </h1>
            
            {/* NOVO LAYOUT DA SEÇÃO DE CONTEÚDO */}
            <div className="dashboard-content-area">
                {/* NOTIFICAÇÕES - AGORA EM MAIOR ÊNFASE */}
                <div className="dashboard-notifications-emphasis">
                    <NotificationsPanel />
                </div>

                {/* AÇÕES - ABAIXO DAS NOTIFICAÇÕES */}
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

const DashboardCard = ({ title, description, onClick, className = '' }) => {
    return (
        <div className={`dashboard-card ${className}`} onClick={onClick}>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};
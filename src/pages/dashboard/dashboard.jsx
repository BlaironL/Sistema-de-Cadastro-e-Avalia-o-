import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css'; // Estilos específicos do dashboard
import animatedImage from '../../components/ImagemFemininaSCAP.png'; // Sua imagem (PNG)

// Importe o hook useNotifications para adicionar e gerenciar notificações
import { useNotifications } from "../contexts/NotificationContext";

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
                // Alterado: Garantir que 'details' esteja presente e correto para convites
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

        // Opções específicas para ALUNO
        if (userProfile === 'aluno') {
            options.push(
                <DashboardCard
                    key="submitProject"
                    title="Submeter Novo Projeto"
                    description="Envie seu projeto para avaliação em um evento aberto."
                    onClick={() => alert('Navegar para tela de Submissão de Projeto')}
                />,
                <DashboardCard
                    key="mySubmittedProjects"
                    title="Meus Projetos Submetidos"
                    description="Visualize o status e os detalhes dos seus projetos enviados."
                    onClick={() => alert('Navegar para tela de Meus Projetos Submetidos')}
                />,
                 <DashboardCard
                    key="helpOrganize"
                    title="Ajudar a Organizar"
                    description="Colabore com a organização de um evento ou projeto existente."
                    onClick={() => alert('Navegar para tela de Colaboração em Organização')}
                />
            );
        }

        // Opções específicas para AVALIADOR
        else if (userProfile === 'avaliador') {
            options.push(
                <DashboardCard
                    key="evaluateProjects"
                    title="Avaliar Projetos"
                    description="Acesse os projetos de eventos para os quais foi convidado para avaliar."
                    onClick={() => alert('Navegar para tela de Avaliação de Projetos')}
                />,
                <DashboardCard
                    key="helpOrganize"
                    title="Ajudar a Organizar"
                    description="Colabore com a organização de um evento ou projeto existente."
                    onClick={() => alert('Navegar para tela de Colaboração em Organização')}
                />
            );
        }

        // Opções específicas para ORGANIZADOR
        else if (userProfile === 'organizador') {
            options.push(
                <DashboardCard
                    key="createEvent"
                    title="Criar Novo Evento"
                    description="Configure um novo evento, defina critérios de avaliação e convide avaliadores."
                    onClick={() => navigate('/criar-evento')}
                />,
                <DashboardCard
                    key="manageProjects"
                    title="Gerenciar Projetos Submetidos"
                    description="Aprove ou recuse projetos, e gerencie submissões."
                    onClick={() => alert('Navegar para tela de Gerenciamento de Projetos')}
                />,
                <DashboardCard
                    key="generateRanking"
                    title="Gerar Ranking de Projetos"
                    description="Calcule as médias e visualize o ranking final dos projetos avaliados."
                    onClick={() => alert('Navegar para tela de Geração de Ranking')}
                />,
                <DashboardCard
                    key="manageEvaluators"
                    title="Gerenciar Avaliadores"
                    description="Convide e acompanhe o progresso dos avaliadores em seus eventos."
                    onClick={() => alert('Navegar para tela de Gerenciamento de Avaliadores')}
                />,
                <DashboardCard
                    key="helpOrganize"
                    title="Ajudar a Organizar"
                    description="Colabore com a organização de um evento ou projeto existente."
                    onClick={() => alert('Navegar para tela de Colaboração em Organização')}
                />
            );
        }

        return options;
    };

    // --- Componente interno para exibir as notificações ---
    const NotificationsPanel = () => {
        const { notifications, markAsRead, removeNotification, addNotification } = useNotifications(); 
        const [expandedNotificationId, setExpandedNotificationId] = useState(null); // Estado para controlar qual notificação está expandida

        // DEBUG LOG: Vê o que o NotificationsPanel está recebendo do contexto
        console.log("NotificationsPanel: Notificações recebidas do contexto:", notifications); 
        console.log("NotificationsPanel: Notificação expandida ID:", expandedNotificationId); // DEBUG LOG

        const toggleExpand = (id) => {
            console.log("Toggle expand para ID:", id); // DEBUG LOG
            setExpandedNotificationId(prevId => {
                const newId = prevId === id ? null : id;
                if (newId !== null) { // Apenas marca como lida se for expandir
                    markAsRead(id); 
                }
                return newId;
            });
        };

        const handleAcceptInvite = (e, notifId, details) => { 
            e.stopPropagation(); // Impede que o clique suba para o li e o contraia
            alert(`Convite ACEITO! Detalhes: ${JSON.stringify(details)}. Notificação: ${notifId}`);
            addNotification(`Convite aceito para ${details.role === 'avaliador' ? 'avaliar' : 'organizar'}.`, 'info');
            removeNotification(notifId); // Remove após aceitar
            setExpandedNotificationId(null); // Fecha a notificação expandida
            console.log("Convite Aceito, Notificação removida:", notifId);
            // Lógica real de backend para aceitar o convite
        };

        const handleDeclineInvite = (e, notifId, details) => { 
            e.stopPropagation(); // Impede que o clique suba para o li e o contraia
            alert(`Convite RECUSADO! Detalhes: ${JSON.stringify(details)}. Notificação: ${notifId}`);
            addNotification(`Convite recusado para ${details.role === 'avaliador' ? 'avaliar' : 'organizar'}.`, 'info');
            removeNotification(notifId); // Remove após recusar
            setExpandedNotificationId(null); // Fecha a notificação expandida
            console.log("Convite Recusado, Notificação removida:", notifId);
            // Lógica real de backend para recusar o convite
        };


        return (
            <div className="notifications-panel">
                <h3>Notificações ({notifications.filter(n => !n.read).length} não lidas)</h3>
                {notifications.length > 0 ? (
                    <ul className="notification-list">
                        {notifications.map(notif => {
                            const isExpanded = expandedNotificationId === notif.id;
                            // Adicionando um console.log para cada notificação
                            console.log(`Notificação ID: ${notif.id}, isExpanded: ${isExpanded}, read: ${notif.read}, Type: ${notif.type}, Details: ${JSON.stringify(notif.details)}`);
                            return (
                                <li
                                    key={notif.id}
                                    className={`notification-item notification-${notif.type} ${notif.read ? 'read' : ''} ${isExpanded ? 'expanded' : ''}`}
                                    onClick={() => toggleExpand(notif.id)} // Expande/contrai ao clicar
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
                                        onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }} // Impede o clique do li ao clicar no 'x'
                                    >
                                        &times; {/* Símbolo de 'x' para fechar */}
                                    </button>

                                    {/* Conteúdo expandido para notificações de convite e outros tipos */}
                                    {isExpanded && (
                                        <div className="notification-expanded-content">
                                            <p className="expanded-details">
                                                {notif.type === 'convite' && notif.details?.role === 'avaliador' &&
                                                    `Detalhes: Você foi convidado para avaliar o evento "${notif.details?.eventId || 'Evento Desconhecido'}". ` +
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
                                                        onClick={(e) => handleAcceptInvite(e, notif.id, notif.details)} // Passa o evento 'e'
                                                    >
                                                        Aceitar
                                                    </button>
                                                    <button 
                                                        className="btn-decline" 
                                                        onClick={(e) => handleDeclineInvite(e, notif.id, notif.details)} // Passa o evento 'e'
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
            
            <div className="dashboard-content-grid">
                {/* Seção Esquerda: Imagem Futurista */}
                <div className="dashboard-left-section">
                    <img src={animatedImage} alt="Ilustração SCAP" className="dashboard-animated-image" />
                    <div className="animated-overlay"></div>
                </div>

                {/* Seção Direita: Notificações e Ações */}
                <div className="dashboard-right-section">
                    <NotificationsPanel />

                    <div className="dashboard-actions">
                        <h2>O que você gostaria de fazer?</h2>
                        <div className="dashboard-options-grid">
                            {renderOptions()}
                        </div>
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
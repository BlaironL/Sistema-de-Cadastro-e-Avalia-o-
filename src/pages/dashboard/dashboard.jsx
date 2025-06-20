import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css'; // Estilos específicos do dashboard

// Importe o hook useNotifications para adicionar e gerenciar notificações
import { useNotifications } from "../contexts/NotificationContext.jsx";
// Importe o hook useEventsProjects (se for usado no Dashboard para dados de eventos, senão remova)
import { useEventsProjects } from "../contexts/EventProjectContext.jsx";

export default function Dashboard() {
    const [userEmail, setUserEmail] = useState(''); // Estado para o email do usuário
    const navigate = useNavigate();
    const { addNotification, notifications } = useNotifications(); // Pegamos 'notifications' para o badge
    const { events } = useEventsProjects(); // Pegamos 'events' para garantir que o contexto está ativo (se necessário)

    useEffect(() => {
        const storedProfile = localStorage.getItem('userProfile');
        const storedEmail = localStorage.getItem('userEmail');

        // Se a sessão expirou ou não iniciou, redireciona para login
        if (!storedProfile) {
            alert('Sessão expirada ou não iniciada. Faça login novamente.');
            navigate('/login');
            return; // Importante para parar a execução do useEffect
        }

        // Define o email do usuário para exibir, usando um fallback seguro
        setUserEmail(storedEmail || 'Usuário');

        // Notificações de teste ao carregar o Dashboard
        // Dispara apenas se não houver muitas notificações já (para não lotar)
        if (notifications.length < 5) { // Limita as notificações de teste iniciais
            setTimeout(() => {
                addNotification(`Bem-vindo(a) de volta, ${storedEmail || 'usuário(a)'}!`, 'info');
                addNotification('Você tem um novo convite para avaliar um projeto!', 'convite', { eventId: 'exemplo_id', role: 'avaliador' });
                addNotification('Lembrete: Prazo final para submissão de projetos do Evento X se aproxima.', 'alerta');
            }, 1000);
        }

    }, [navigate, addNotification, notifications.length]); // Adicionado notifications.length como dependência

    const renderOptions = () => {
        const options = [];

        // Opções relacionadas a Eventos e Projetos
        options.push(
            <DashboardCard
                key="createEvent"
                title="Criar Novo Evento"
                description="Configure um novo evento e defina seus detalhes."
                onClick={() => navigate('/criar-evento')} // Rota futura: /criar-evento
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
                onClick={() => navigate('/solicitar-avaliacao')}
            />,
            <DashboardCard
                key="evaluateProjects"
                title="Avaliar Projetos"
                description="Acesse os projetos atribuídos para sua avaliação."
                onClick={() => navigate('/avaliar-projeto')}
            />,
            <DashboardCard
                key="requestOrganize"
                title="Solicitar Colaboração em Organização"
                description="Ofereça ajuda na organização de um evento ou projeto."
                onClick={() => navigate('/solicitar-org')}
            />
        );
        
        return options;
    };

    return (
        <div className="dashboard-page-container">
            {/* O NotificationWidget agora é renderizado globalmente pelo Layout.jsx */}
            {/* O bloco de código do botão duplicado foi REMOVIDO daqui. */}

            <div className="dashboard-main-content-wrapper"> 
                <h1 className="dashboard-motto">
                    Inove, avalie, destaque-se.<br />
                    Sua jornada de projeto começa aqui.
                </h1>
                
                <div className="dashboard-actions-section">
                    <div className="dashboard-options-grid">
                        {renderOptions()}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Mantenha o DashboardCard aqui, se ele for um componente auxiliar do Dashboard
const DashboardCard = ({ title, description, onClick, className = '' }) => {
    return (
        <div className={`dashboard-card ${className}`} onClick={onClick}>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};
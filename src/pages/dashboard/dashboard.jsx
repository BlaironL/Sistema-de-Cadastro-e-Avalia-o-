import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css'; // Estilos específicos do dashboard

// Importe o hook useNotifications para adicionar e gerenciar notificações
import { useNotifications } from "../contexts/NotificationContext.jsx";
// Importe o hook useEventsProjects (se for usado no Dashboard para dados de eventos, senão remova)
import { useEventsProjects } from "../contexts/EventProjectContext.jsx";

// Componente auxiliar para os cartões do Dashboard
// Adicionado prop 'icon' para elementos visuais e classes para estilização
const DashboardCard = ({ title, description, onClick, icon, className = '' }) => {
    return (
        <div className={`dashboard-card ${className}`} onClick={onClick}>
            <div className="card-icon">{icon}</div> {/* Ícone/Emoji do cartão */}
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{description}</p>
        </div>
    );
};

export default function Dashboard() {
    const [userEmail, setUserEmail] = useState(''); // Estado para o email do usuário
    const navigate = useNavigate();
    const { addNotification, notifications } = useNotifications(); // Pegamos 'notifications' para o badge
    const { events, createEvent } = useEventsProjects(); // Pegamos 'events' para garantir que o contexto está ativo (se necessário)

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
        setUserEmail(storedEmail || 'Utilizador');

        // Notificações de teste ao carregar o Dashboard
        // Dispara apenas se não houver muitas notificações já (para não lotar)
        if (notifications.length < 5) { // Limita as notificações de teste iniciais
            setTimeout(() => {
                addNotification(`Bem-vindo(a) de volta, ${storedEmail || 'utilizador(a)'}!`, 'info');
                addNotification('Você tem um novo convite para avaliar um projeto!', 'convite', { eventId: 'exemplo_id', role: 'avaliador' });
                addNotification('Lembrete: Prazo final para submissão de projetos do Evento X se aproxima.', 'alerta');
            }, 1000);
        }

        // Adiciona eventos de teste apenas uma vez para garantir dados para as funcionalidades
        const hasTestEventsAdded = localStorage.getItem('hasTestEventsAddedDashboard');
        if (!hasTestEventsAdded) {
            console.log("Dashboard: Adicionando eventos de teste...");
            createEvent({ id: 'test-event-001', titulo: "Feira de Inovação 2025", local: "Centro de Convenções", data: "2025-08-20", descricao: "A maior feira de inovação do ano!" });
            createEvent({ id: 'test-event-002', titulo: "Hackathon de Sustentabilidade", local: "Campus Tech", data: "2025-09-10", descricao: "Desenvolva soluções para um futuro mais verde." });
            createEvent({ id: 'test-event-003', titulo: "Semana Acadêmica Online", local: "Online", data: "2025-10-05", descricao: "Palestras e workshops com especialistas de diversas áreas." });
            localStorage.setItem('hasTestEventsAddedDashboard', 'true');
        }

    }, [navigate, addNotification, notifications.length, createEvent]); // Adicionado createEvent como dependência

    const renderOptions = () => {
        // Definição dos dados dos cartões com títulos, descrições e ícones (emojis para simplicidade)
        const cardData = [
            { key: "createEvent", title: "Criar Novo Evento", description: "Configure um novo evento e defina os seus detalhes.", icon: "✨", path: '/criar-evento' },
            { key: "manageMyEvents", title: "Gerir Os Meus Eventos", description: "Acompanhe e gira todos os eventos que criou, desde projetos a avaliadores.", icon: "📊", path: '/gerenciar-eventos' },
            { key: "submitNewProject", title: "Submeter Novo Projeto", description: "Apresente a sua ideia! Submeta o seu projeto para avaliação num evento existente.", icon: "🚀", path: '/criar-projeto' },
            { key: "viewMyProjects", title: "Os Meus Projetos Anteriores", description: "Visualize o estado e o feedback dos seus projetos já submetidos.", icon: "📖", path: '/ver-projetos' },
            { key: "requestEvaluate", title: "Solicitar Avaliação", description: "Ofereça-se para avaliar projetos em eventos. Partilhe o seu conhecimento!", icon: "🙋‍♀️", path: '/solicitar-avaliacao' },
            { key: "evaluateProjects", title: "Avaliar Projetos", description: "Aceda aos projetos que lhe foram atribuídos e registe as suas avaliações.", icon: "✅", path: '/avaliar-projeto' },
            { key: "requestOrganize", title: "Solicitar Colaboração", description: "Junte-se à equipa organizadora de um evento. Contribua para o sucesso!", icon: "🤝", path: '/solicitar-org' }
        ];

        return cardData.map(card => (
            <DashboardCard
                key={card.key}
                title={card.title}
                description={card.description}
                icon={card.icon}
                onClick={() => navigate(card.path)}
            />
        ));
    };

    return (
        <div className="dashboard-page-container">
            {/* Secção de Herói Revitalizada */}
            <div className="dashboard-hero-section">
                <h1 className="hero-title">
                    Inove, Avalie, Destaque-se.<br />
                    A Sua Jornada de Projeto Começa Aqui.
                </h1>
                <p className="hero-subtitle">
                    A plataforma completa para gerir os seus eventos e projetos académicos.
                </p>
                <div className="hero-decor"></div> {/* Elemento decorativo */}
                <div className="hero-decor hero-decor-alt"></div> {/* Segundo elemento decorativo */}
            </div>

            {/* Secção de Ações Principais */}
            <div className="dashboard-actions-section">
                <h2 className="section-title">Funcionalidades Principais</h2>
                <div className="dashboard-options-grid">
                    {renderOptions()}
                </div>
            </div>
        </div>
    );
}
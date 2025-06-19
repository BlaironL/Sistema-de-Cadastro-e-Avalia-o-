import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Usaremos useParams para pegar o ID do evento
import { useEventsProjects } from '../contexts/EventProjectContext';
import { useNotifications } from '../contexts/NotificationContext';
import './gerenciar-eventos.css';

export default function GerenciarEventos() {
    const navigate = useNavigate();
    const { events, addEvent, updateEvent, addProjectToEvent, updateProjectStatus, getEventByIdentifier } = useEventsProjects();
    const { addNotification } = useNotifications();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null); // Evento selecionado para gerenciar
    const [isEditingEvent, setIsEditingEvent] = useState(false); // Modo de edição do evento
    const [editedEventData, setEditedEventData] = useState({}); // Dados do evento em edição

    // Estados para controle das abas/seções dentro do gerenciamento do evento
    const [activeSection, setActiveSection] = useState('detalhes'); // 'detalhes', 'projetos', 'avaliadores', 'organizadores'

    // UseEffect para adicionar eventos de teste se não existirem (apenas para demonstração)
    useEffect(() => {
        const hasTestEventsAdded = localStorage.getItem('hasTestEventsAdded');
        if (!hasTestEventsAdded || events.length === 0) {
            addEvent({ id: 'event-test-001', titulo: "Feira de Inovação 2025", local: "Centro de Convenções", data: "2025-08-20", descricao: "A maior feira de inovação do ano, com projetos incríveis!" });
            addEvent({ id: 'event-test-002', titulo: "Hackathon de Sustentabilidade", local: "Campus Tech", data: "2025-09-10", descricao: "Desenvolva soluções para um futuro mais verde." });
            addEvent({ id: 'event-test-003', titulo: "Semana Acadêmica Online", local: "Online", data: "2025-10-05", descricao: "Palestras e workshops com especialistas de diversas áreas." });
            localStorage.setItem('hasTestEventsAdded', 'true');
        }
    }, [addEvent, events.length]);

    // Filtra os eventos com base no termo de pesquisa
    const filteredEvents = events.filter(event => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            (event.titulo || '').toLowerCase().includes(lowerCaseSearchTerm) ||
            (event.codigo || '').toLowerCase().includes(lowerCaseSearchTerm) ||
            (event.local || '').toLowerCase().includes(lowerCaseSearchTerm) ||
            (event.data || '').toLowerCase().includes(lowerCaseSearchTerm) ||
            (event.descricao || '').toLowerCase().includes(lowerCaseSearchTerm) // Adicionado pesquisa na descrição
        );
    });

    // Função para iniciar o gerenciamento de um evento específico
    const handleSelectEventToManage = useCallback((event) => {
        setSelectedEvent(event);
        setEditedEventData({ ...event }); // Preenche o formulário de edição com os dados do evento
        setIsEditingEvent(false); // Inicia no modo de visualização
        setActiveSection('detalhes'); // Volta para a aba de detalhes
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo da página
    }, []);

    // Função para salvar as edições do evento
    const handleSaveEventEdits = () => {
        if (!editedEventData.titulo || !editedEventData.local || !editedEventData.data) {
            addNotification('Título, local e data são obrigatórios para atualizar o evento.', 'alerta');
            return;
        }
        updateEvent(editedEventData.id, editedEventData); // Chama a função de atualização do contexto
        addNotification(`Evento "${editedEventData.titulo}" atualizado com sucesso!`, 'info');
        setIsEditingEvent(false); // Sai do modo de edição
        setSelectedEvent(editedEventData); // Atualiza o evento selecionado com os novos dados
    };

    // Funções de gerenciamento de projetos/avaliadores/organizadores (simuladas)
    const handleAddParticipant = (role) => {
        const email = prompt(`Digite o email do novo ${role}:`);
        if (email) {
            // Em uma implementação real, você adicionaria essa lógica ao EventProjectContext
            addNotification(`Simulando: ${email} convidado como ${role} para ${selectedEvent.titulo}.`, 'info');
            // selectedEvent.avaliadoresConvidados.push({ email, status: 'pendente' }); // Simulação direta (NÃO FAZER EM PROD)
            // Forçaria um re-render ou adicionaria uma função real no contexto
        }
    };

    const handleInviteEvaluator = () => handleAddParticipant('avaliador');
    const handleInviteOrganizer = () => handleAddParticipant('organizador');

    // Funções para gerenciar o status de um projeto (exemplo, já vem do EventProjectContext)
    const handleChangeProjectStatus = (project) => {
        const newStatus = prompt(`Mudar status de "${project.titulo}" para (Aprovado, Rejeitado, Em Avaliação, Pendente Avaliação):`, project.status);
        if (newStatus && ['Aprovado', 'Rejeitado', 'Em Avaliação', 'Pendente Avaliação'].includes(newStatus)) {
            let rejectionMessage = '';
            if (newStatus === 'Rejeitado') {
                rejectionMessage = prompt('Motivo da rejeição (opcional):', '');
            }
            updateProjectStatus(selectedEvent.id, project.id, newStatus, rejectionMessage);
            addNotification(`Status do projeto "${project.titulo}" atualizado para: ${newStatus}`, 'info');
            // Força o re-render do componente selecionado para refletir a mudança
            setSelectedEvent(prev => getEventByIdentifier(prev.id)); 
        } else if (newStatus !== null) { // Usuário não cancelou, mas inseriu inválido
            addNotification('Status inválido. Escolha entre Aprovado, Rejeitado, Em Avaliação ou Pendente Avaliação.', 'alerta');
        }
    };


    return (
        <div className="gerenciar-eventos-container">
            {selectedEvent ? (
                <div className="selected-event-details-wrapper">
                    <button className="back-to-list-btn" onClick={() => setSelectedEvent(null)}>
                        &larr; Voltar para a lista de eventos
                    </button>
                    <h1 className="selected-event-title">{selectedEvent.titulo}</h1>
                    <p className="selected-event-code">Código do Evento: <span>{selectedEvent.codigo}</span></p>

                    <div className="event-management-tabs">
                        <button 
                            className={`tab-btn ${activeSection === 'detalhes' ? 'active' : ''}`} 
                            onClick={() => setActiveSection('detalhes')}
                        >
                            Detalhes do Evento
                        </button>
                        <button 
                            className={`tab-btn ${activeSection === 'projetos' ? 'active' : ''}`} 
                            onClick={() => setActiveSection('projetos')}
                        >
                            Projetos Participantes ({selectedEvent.projetos ? selectedEvent.projetos.length : 0})
                        </button>
                        <button 
                            className={`tab-btn ${activeSection === 'avaliadores' ? 'active' : ''}`} 
                            onClick={() => setActiveSection('avaliadores')}
                        >
                            Avaliadores ({selectedEvent.avaliadoresConvidados ? selectedEvent.avaliadoresConvidados.length : 0})
                        </button>
                        <button 
                            className={`tab-btn ${activeSection === 'organizadores' ? 'active' : ''}`} 
                            onClick={() => setActiveSection('organizadores')}
                        >
                            Organizadores ({selectedEvent.organizadoresConvidados ? selectedEvent.organizadoresConvidados.length : 0})
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeSection === 'detalhes' && (
                            <div className="event-details-section">
                                <h2>Informações do Evento</h2>
                                {isEditingEvent ? (
                                    <form className="edit-event-form" onSubmit={(e) => { e.preventDefault(); handleSaveEventEdits(); }}>
                                        <div className="form-group">
                                            <label>Título:</label>
                                            <input type="text" value={editedEventData.titulo || ''} onChange={(e) => setEditedEventData({ ...editedEventData, titulo: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Local:</label>
                                            <input type="text" value={editedEventData.local || ''} onChange={(e) => setEditedEventData({ ...editedEventData, local: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Data:</label>
                                            <input type="date" value={editedEventData.data ? editedEventData.data.split('T')[0] : ''} onChange={(e) => setEditedEventData({ ...editedEventData, data: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Descrição:</label>
                                            <textarea value={editedEventData.descricao || ''} onChange={(e) => setEditedEventData({ ...editedEventData, descricao: e.target.value })} rows="4"></textarea>
                                        </div>
                                        <div className="edit-form-actions">
                                            <button type="submit" className="btn-save">Salvar</button>
                                            <button type="button" className="btn-cancel" onClick={() => setIsEditingEvent(false)}>Cancelar</button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <p>Local: <span>{selectedEvent.local || 'Não informado'}</span></p>
                                        <p>Data: <span>{selectedEvent.data ? new Date(selectedEvent.data).toLocaleDateString() : 'Não informada'}</span></p>
                                        <p>Descrição: <span>{selectedEvent.descricao || 'Nenhuma descrição fornecida.'}</span></p>
                                        <button className="btn-edit-event" onClick={() => setIsEditingEvent(true)}>
                                            Editar Informações
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {activeSection === 'projetos' && (
                            <div className="projects-list-section">
                                <h2>Projetos Participantes</h2>
                                {selectedEvent.projetos && selectedEvent.projetos.length > 0 ? (
                                    <div className="projects-grid">
                                        {selectedEvent.projetos.map(project => (
                                            <div key={project.id} className="project-item-card">
                                                <h4>{project.titulo}</h4>
                                                <p>Coordenador: <span>{project.professorCoordenador}</span></p>
                                                <p>Status: <span className={`status-${(project.status || '').toLowerCase().replace(/\s/g, '-')}`}>{project.status}</span></p>
                                                <p className="project-actions">
                                                    <button className="btn-details" onClick={() => alert(`Detalhes de ${project.titulo}`)}>Ver Detalhes</button>
                                                    <button className="btn-change-status" onClick={() => handleChangeProjectStatus(project)}>Mudar Status</button>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-items-message">Nenhum projeto submetido a este evento ainda.</p>
                                )}
                            </div>
                        )}

                        {activeSection === 'avaliadores' && (
                            <div className="participants-list-section">
                                <h2>Avaliadores Convidados</h2>
                                <button className="add-participant-btn" onClick={handleInviteEvaluator}>Convidar Avaliador</button>
                                {selectedEvent.avaliadoresConvidados && selectedEvent.avaliadoresConvidados.length > 0 ? (
                                    <ul className="participant-list">
                                        {selectedEvent.avaliadoresConvidados.map((p, index) => (
                                            <li key={index}>
                                                {p.email} - Status: <span>{p.status}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="no-items-message">Nenhum avaliador convidado ainda.</p>
                                )}
                            </div>
                        )}

                        {activeSection === 'organizadores' && (
                            <div className="participants-list-section">
                                <h2>Organizadores Convidados</h2>
                                <button className="add-participant-btn" onClick={handleInviteOrganizer}>Convidar Organizador</button>
                                {selectedEvent.organizadoresConvidados && selectedEvent.organizadoresConvidados.length > 0 ? (
                                    <ul className="participant-list">
                                        {selectedEvent.organizadoresConvidados.map((p, index) => (
                                            <li key={index}>
                                                {p.email} - Status: <span>{p.status}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="no-items-message">Nenhum organizador convidado ainda.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <h1 className="eventos-title">Gerenciar Meus Eventos</h1>
                    <p className="eventos-description">
                        Visualize, edite e organize os eventos que você criou.
                    </p>

                    <div className="eventos-controls">
                        <input
                            type="text"
                            placeholder="Pesquisar eventos por título, código, local..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="create-event-btn" onClick={() => navigate('/criar-evento')}>
                            + Criar Novo Evento
                        </button>
                    </div>

                    {filteredEvents.length === 0 ? (
                        <div className="no-events-message">
                            <p>Nenhum evento encontrado.</p>
                            {searchTerm && <p>Tente ajustar seu termo de pesquisa.</p>}
                            {!searchTerm && (
                                <button className="create-first-event-btn" onClick={() => navigate('/criar-evento')}>
                                    Crie seu primeiro evento agora!
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="eventos-list-grid">
                            {filteredEvents.map(event => (
                                <div key={event.id} className="event-card">
                                    <h3 className="event-card-title">{event.titulo}</h3>
                                    <p className="event-card-info">
                                        Código: <span>{event.codigo}</span>
                                    </p>
                                    <p className="event-card-info">
                                        Local: <span>{event.local || 'Não informado'}</span>
                                    </p>
                                    <p className="event-card-info">
                                        Data: <span>{event.data ? new Date(event.data).toLocaleDateString() : 'Não informada'}</span>
                                    </p>
                                    <p className="event-card-info">
                                        Projetos: <span>{event.projetos ? event.projetos.length : 0}</span>
                                    </p>
                                    <div className="event-card-actions">
                                        <button className="btn-manage" onClick={() => handleSelectEventToManage(event)}>
                                            Gerenciar
                                        </button>
                                        {/* <button className="btn-view-projects" onClick={() => handleViewEventProjects(event.id, event.titulo)}>
                                            Ver Projetos
                                        </button> */}
                                        <button className="btn-delete" onClick={() => handleDeleteEvent(event.id, event.titulo)}>
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
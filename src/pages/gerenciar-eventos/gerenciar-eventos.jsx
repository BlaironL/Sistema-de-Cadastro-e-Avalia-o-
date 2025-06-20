import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEventsProjects } from '../contexts/EventProjectContext';
import { useNotifications } from '../contexts/NotificationContext';
import './gerenciar-eventos.css';

export default function GerenciarEventos() {
    const navigate = useNavigate();
    const { events, createEvent, updateEvent, updateProjectStatus, getEventByIdentifier, handleEvaluatorRequest } = useEventsProjects(); 
    const { addNotification } = useNotifications();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditingEvent, setIsEditingEvent] = useState(false);
    const [editedEventData, setEditedEventData] = useState({});
    const [activeSection, setActiveSection] = useState('detalhes');
    const [isRankingMode, setIsRankingMode] = useState(false); // NOVO: Estado para controlar o modo de ranking

    // UseEffect para adicionar eventos de teste se não existirem
    useEffect(() => {
        const testEventIds = ['test-event-001', 'test-event-002', 'test-event-003'];
        const existingTestEvents = new Set((events || []).map(e => e.id));

        const needsToAddTestEvents = testEventIds.some(id => !existingTestEvents.has(id));

        if (needsToAddTestEvents) {
            console.log("GerenciarEventos: Adicionando eventos de teste...");
            if (!existingTestEvents.has('test-event-001')) {
                createEvent({ id: 'test-event-001', titulo: "Feira de Inovação 2025", local: "Centro de Convenções", data: "2025-08-20", descricao: "A maior feira de inovação do ano!" });
            }
            if (!existingTestEvents.has('test-event-002')) {
                createEvent({ id: 'test-event-002', titulo: "Hackathon de Sustentabilidade", local: "Campus Tech", data: "2025-09-10", descricao: "Desenvolva soluções para um futuro mais verde." });
            }
            if (!existingTestEvents.has('test-event-003')) {
                createEvent({ id: 'test-event-003', titulo: "Semana Acadêmica Online", local: "Online", data: "2025-10-05", descricao: "Palestras e workshops com especialistas de diversas áreas." });
            }
        }
    }, [events, createEvent]);

    // Filtra os eventos com base no termo de pesquisa
    const filteredEvents = (events || []).filter(event => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            (event?.titulo || '').toLowerCase().includes(lowerCaseSearchTerm) ||
            (event?.codigo || '').toLowerCase().includes(lowerCaseSearchTerm) ||
            (event?.local || '').toLowerCase().includes(lowerCaseSearchTerm) ||
            (event?.data || '').toLowerCase().includes(lowerCaseSearchTerm) ||
            (event?.descricao || '').toLowerCase().includes(lowerCaseSearchTerm)
        );
    });

    // Atualiza o selectedEvent sempre que os eventos do contexto mudarem
    useEffect(() => {
        if (selectedEvent && events) {
            const updatedSelectedEvent = getEventByIdentifier(selectedEvent.id);
            if (updatedSelectedEvent) {
                setSelectedEvent(updatedSelectedEvent);
            } else {
                setSelectedEvent(null);
            }
        }
    }, [events, selectedEvent, getEventByIdentifier]);


    const handleSelectEventToManage = useCallback((event) => {
        setSelectedEvent(event);
        setEditedEventData({ ...event });
        setIsEditingEvent(false);
        setActiveSection('detalhes');
        setIsRankingMode(false); // NOVO: Reseta o modo de ranking ao selecionar novo evento
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleSaveEventEdits = () => {
        if (!editedEventData.titulo || !editedEventData.local || !editedEventData.data) {
            addNotification('Título, local e data são obrigatórios para atualizar o evento.', 'alerta');
            return;
        }
        updateEvent(editedEventData.id, editedEventData);
        addNotification(`Evento "${editedEventData.titulo}" atualizado com sucesso!`, 'info');
        setIsEditingEvent(false);
    };

    const handleChangeProjectStatus = (project) => {
        const newStatus = prompt(`Mudar status de "${project.titulo}" para (Aprovado, Rejeitado, Em Avaliação, Pendente Avaliação):`, project.status);
        if (newStatus && ['Aprovado', 'Rejeitado', 'Em Avaliação', 'Pendente Avaliação'].includes(newStatus)) {
            let rejectionMessage = '';
            if (newStatus === 'Rejeitado') {
                rejectionMessage = prompt('Motivo da rejeição (opcional):', '');
            }
            updateProjectStatus(selectedEvent.id, project.id, newStatus, rejectionMessage);
            addNotification(`Status do projeto "${project.titulo}" atualizado para: ${newStatus}`, 'info');
        } else if (newStatus !== null) {
            addNotification('Status inválido. Escolha entre Aprovado, Rejeitado, Em Avaliação ou Pendente Avaliação.', 'alerta');
        }
    };

    const handleApproveRejectRequest = (request, status) => {
        if (!window.confirm(`Tem certeza que deseja ${status === 'aprovado' ? 'APROVAR' : 'REJEITAR'} a solicitação de ${request.nome || request.email}?`)) {
            return;
        }

        const acceptedParticipant = handleEvaluatorRequest(selectedEvent.id, request.id, status, request);

        if (status === 'aprovado') {
            addNotification(`Solicitação de ${request.nome || request.email} APROVADA para ${selectedEvent.titulo}!`, 'info');
            if (acceptedParticipant) {
                addNotification(`Parabéns! Você foi aprovado(a) como avaliador(a) no evento "${selectedEvent.titulo}"!`, 'aprovado-avaliador', { eventId: selectedEvent.id, eventTitle: selectedEvent.titulo, recipientEmail: acceptedParticipant.email });
            }
        } else {
            addNotification(`Solicitação de ${request.nome || request.email} REJEITADA para ${selectedEvent.titulo}.`, 'alerta');
            addNotification(`Sua solicitação para avaliar o evento "${selectedEvent.titulo}" foi rejeitada.`, 'rejeitado-avaliador', { eventId: selectedEvent.id, eventTitle: selectedEvent.titulo, recipientEmail: request.email });
        }
    };

    const handleDeleteEvent = (eventId, eventTitle) => {
        if (window.confirm(`Tem certeza que deseja SIMULAR a exclusão do evento "${eventTitle}"? (Esta função não remove realmente no contexto ainda)`)) {
            addNotification(`Simulando: Evento "${eventTitle}" excluído.`, 'info');
            setSelectedEvent(null);
        }
    };

    // Função auxiliar para calcular a média das avaliações de UM projeto
    const calculateAverageScore = (project) => {
        if (!project.avaliacoes || project.avaliacoes.length === 0) {
            return 'N/A';
        }
        // Média ponderada ou simples das médias finais de cada avaliador
        const validScores = project.avaliacoes.map(evalu => Number(evalu.mediaFinal)).filter(score => !isNaN(score));

        if (validScores.length === 0) {
            return 'N/A';
        }
        const sum = validScores.reduce((acc, score) => acc + score, 0);
        return (sum / validScores.length).toFixed(1);
    };

    // NOVO: Função para ordenar os projetos para o ranking
    const getRankedProjects = useCallback(() => {
        // Garante que selectedEvent e projetos existem
        if (!selectedEvent || !selectedEvent.projetos) {
            return [];
        }
        // Filtra projetos que já foram avaliados pelo menos uma vez
        const projectsWithScores = selectedEvent.projetos.filter(project => 
            project.avaliacoes && project.avaliacoes.length > 0 && calculateAverageScore(project) !== 'N/A'
        );

        // Ordena os projetos pela média final (do maior para o menor)
        return [...projectsWithScores].sort((a, b) => {
            const scoreA = parseFloat(calculateAverageScore(a));
            const scoreB = parseFloat(calculateAverageScore(b));
            return scoreB - scoreA; // Ordem decrescente
        });
    }, [selectedEvent, calculateAverageScore]);


    // Projetos a serem exibidos (ordenados ou não)
    const projectsToDisplay = isRankingMode ? getRankedProjects() : (selectedEvent?.projetos || []);


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
                        <button 
                            className={`tab-btn ${activeSection === 'solicitacoes' ? 'active' : ''}`} 
                            onClick={() => setActiveSection('solicitacoes')}
                        >
                            Solicitações ({selectedEvent.solicitacoesAvaliadores ? selectedEvent.solicitacoesAvaliadores.filter(r => r.status === 'pendente').length : 0})
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
                                <div className="projects-controls"> {/* NOVO: Controles de projetos */}
                                    <button 
                                        className={`toggle-ranking-btn ${isRankingMode ? 'active' : ''}`}
                                        onClick={() => setIsRankingMode(!isRankingMode)}
                                    >
                                        {isRankingMode ? 'Ver Todos Projetos' : 'Gerar Ranking'}
                                    </button>
                                </div>
                                {projectsToDisplay && projectsToDisplay.length > 0 ? (
                                    <div className="projects-grid">
                                        {projectsToDisplay.map((project, index) => ( // NOVO: index para ranking
                                            <div key={project.id} className="project-item-card">
                                                {isRankingMode && (
                                                    <div className="ranking-position">#{index + 1}</div> /* NOVO: Posição no ranking */
                                                )}
                                                <h4>{project.titulo}</h4>
                                                <p>Coordenador: <span>{project.professorCoordenador}</span></p>
                                                <p>Status: <span className={`status-${(project.status || '').toLowerCase().replace(/\s/g, '-')}`}>{project.status}</span></p>
                                                {project.avaliacoes && project.avaliacoes.length > 0 && (
                                                    <p className="project-average-score">Média Avaliações: <span>{calculateAverageScore(project)}</span></p>
                                                )}
                                                {!isRankingMode && ( /* Ações visíveis apenas fora do modo ranking */
                                                    <p className="project-actions">
                                                        <button className="btn-details" onClick={() => alert(`Detalhes de ${project.titulo}`)}>Ver Detalhes</button>
                                                        <button className="btn-change-status" onClick={() => handleChangeProjectStatus(project)}>Mudar Status</button>
                                                    </p>
                                                )}
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
                                {selectedEvent.avaliadoresConvidados && selectedEvent.avaliadoresConvidados.length > 0 ? (
                                    <ul className="participant-list">
                                        {selectedEvent.avaliadoresConvidados.map((p, index) => (
                                            <li key={p.email || index}>
                                                {p.nome || p.email} - Status: <span>{p.status}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="no-items-message">Nenhum avaliador convidado ou aprovado ainda.</p>
                                )}
                            </div>
                        )}

                        {activeSection === 'organizadores' && (
                            <div className="participants-list-section">
                                <h2>Organizadores Convidados</h2>
                                {selectedEvent.organizadoresConvidados && selectedEvent.organizadoresConvidados.length > 0 ? (
                                    <ul className="participant-list">
                                        {selectedEvent.organizadoresConvidados.map((p, index) => (
                                            <li key={p.email || index}>
                                                {p.nome || p.email} - Status: <span>{p.status}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="no-items-message">Nenhum organizador convidado ainda.</p>
                                )}
                            </div>
                        )}

                        {activeSection === 'solicitacoes' && (
                            <div className="requests-list-section">
                                <h2>Solicitações de Avaliadores</h2>
                                {selectedEvent.solicitacoesAvaliadores && selectedEvent.solicitacoesAvaliadores.length > 0 ? (
                                    <ul className="request-list">
                                        {selectedEvent.solicitacoesAvaliadores
                                            .filter(req => req.status === 'pendente')
                                            .map((request) => (
                                                <li key={request.id} className="request-item">
                                                    <div className="request-info">
                                                        <h4>Solicitação de: {request.nome || request.email}</h4>
                                                        <p>Motivação: "{request.motivation}"</p>
                                                        <p>Enviado em: {new Date(request.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="request-actions">
                                                        <button 
                                                            className="btn-approve" 
                                                            onClick={() => handleApproveRejectRequest(request, 'aprovado')}
                                                        >
                                                            Aprovar
                                                        </button>
                                                        <button 
                                                            className="btn-reject" 
                                                            onClick={() => handleApproveRejectRequest(request, 'rejeitado')}
                                                        >
                                                            Rejeitar
                                                        </button>
                                                    </div>
                                                </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="no-items-message">Nenhuma solicitação de avaliador pendente para este evento.</p>
                                )}
                            </div>
                        )}
                    </div> {/* Fim do tab-content */}
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
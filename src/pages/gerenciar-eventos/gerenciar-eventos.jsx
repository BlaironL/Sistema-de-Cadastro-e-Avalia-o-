import React, { useState } from 'react';
// Importações de Contexto (usando caminho relativo que funcionou)
import { useEventsProjects } from '../contexts/EventProjectContext.jsx';
import { useNotifications } from '../contexts/NotificationContext.jsx';
import { useNavigate } from 'react-router-dom';

// IMPORTAÇÃO DO CSS AGORA USANDO O ALIAS '@/'
import '@/pages/gerenciar-eventos/gerenciar-eventos.css';


export default function GerenciarEventos() {
    const { events, addProjectToEvent, updateProjectStatus } = useEventsProjects();
    const { addNotification } = useNotifications();

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('visaoGeral');
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    // Filtra os eventos com base no termo de pesquisa
    const filteredEvents = events.filter(event =>
        event.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.estado.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setActiveTab('visaoGeral');
    };

    const handleGoToCreateEvent = () => {
        navigate('/criar-evento');
    };

    const handleGoToDashboard = () => {
        navigate('/dashboard');
    };

    // Estados para o modal/input de rejeição
    const [showRejectionInput, setShowRejectionInput] = useState(false);
    const [currentProjectToReject, setCurrentProjectToReject] = useState(null);
    const [rejectionMessage, setRejectionMessage] = useState('');

    // Função para iniciar o processo de rejeição
    const handleRejectProject = (projectId) => {
        setCurrentProjectToReject(projectId);
        setRejectionMessage('');
        setShowRejectionInput(true);
    };

    // Função para confirmar a rejeição com mensagem
    const confirmRejectProject = () => {
        if (!currentProjectToReject || !selectedEvent) return;

        updateProjectStatus(selectedEvent.id, currentProjectToReject, 'rejeitado', rejectionMessage);
        addNotification(`Projeto '${currentProjectToReject}' rejeitado no evento "${selectedEvent.nome}".`, 'alerta');
        setShowRejectionInput(false);
        setCurrentProjectToReject(null);
        setRejectionMessage('');
    };

    // Função para aprovar um projeto
    const handleApproveProject = (projectId) => {
        if (!selectedEvent) return;
        updateProjectStatus(selectedEvent.id, projectId, 'aprovado');
        addNotification(`Projeto '${projectId}' aprovado no evento "${selectedEvent.nome}".`, 'info');
    };

    // Agrupamento de projetos por status
    const pendingProjects = selectedEvent?.projetos?.filter(p => p.status === 'pendente') || [];
    const approvedProjects = selectedEvent?.projetos?.filter(p => p.status === 'aprovado') || [];
    const rejectedProjects = selectedEvent?.projetos?.filter(p => p.status === 'rejeitado') || [];


    if (!selectedEvent) {
        return (
            <div className="gerenciar-eventos-container">
                <h2>Gerenciar Meus Eventos</h2>
                <p>Selecione um evento abaixo para ver e gerenciar todos os detalhes.</p>

                <div className="top-action-buttons">
                    <button className="btn-action-primary" onClick={handleGoToCreateEvent}>
                        Criar Novo Evento
                    </button>
                    <button className="btn-action-secondary" onClick={handleGoToDashboard}>
                        Voltar ao Menu Principal
                    </button>
                </div>

                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Pesquisar eventos por nome, local ou estado..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>


                {filteredEvents.length === 0 && events.length > 0 && searchTerm !== '' ? (
                    <p className="no-events-message">Nenhum evento encontrado para "{searchTerm}".</p>
                ) : filteredEvents.length === 0 ? (
                    <p className="no-events-message">Você ainda não criou nenhum evento. Crie um para começar a gerenciar!</p>
                ) : (
                    <div className="eventos-lista">
                        {filteredEvents.map(event => (
                            <div key={event.id} className="evento-card" onClick={() => handleSelectEvent(event)}>
                                <h3>{event.nome}</h3>
                                <p><strong>Código:</strong> {event.codigo || 'Gerando...'}</p>
                                <p><strong>Local:</strong> {event.local}, {event.estado}</p>
                                <p><strong>Submissão:</strong> {event.datas.submissao.inicio} a {event.datas.submissao.fim}</p>
                                {event.foto && (
                                    <img src={event.foto} alt={`Foto do evento ${event.nome}`} className="evento-lista-foto" />
                                )}
                                <button className="btn-selecionar-evento">Selecionar Evento</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="gerenciar-eventos-container">
            <button className="btn-voltar-eventos" onClick={() => setSelectedEvent(null)}>
                &larr; Voltar para a lista de Eventos
            </button>
            <h2 className="event-details-title">Gerenciar: {selectedEvent.nome}</h2>
            <p className="event-details-code">Código do Evento: <strong>{selectedEvent.codigo || 'N/A'}</strong></p>

            <div className="tabs-container">
                <button className={`tab-button ${activeTab === 'visaoGeral' ? 'active' : ''}`} onClick={() => setActiveTab('visaoGeral')}>Visão Geral</button>
                <button className={`tab-button ${activeTab === 'projetos' ? 'active' : ''}`} onClick={() => setActiveTab('projetos')}>Projetos Submetidos</button>
                <button className={`tab-button ${activeTab === 'avaliadores' ? 'active' : ''}`} onClick={() => setActiveTab('avaliadores')}>Gerenciar Avaliadores</button>
                <button className={`tab-button ${activeTab === 'prazos' ? 'active' : ''}`} onClick={() => setActiveTab('prazos')}>Editar Prazos</button>
                <button className={`tab-button ${activeTab === 'ranking' ? 'active' : ''}`} onClick={() => setActiveTab('ranking')}>Ranking e Médias</button>
            </div>

            <div className="tab-content">
                {activeTab === 'visaoGeral' && (
                    <div className="tab-section">
                        <h3>Detalhes do Evento</h3>
                        <p><strong>Descrição:</strong> {selectedEvent.descricao}</p>
                        <p><strong>Local:</strong> {selectedEvent.local}, {selectedEvent.estado}</p>
                        <p><strong>Período de Submissão:</strong> {selectedEvent.datas.submissao.inicio} a {selectedEvent.datas.submissao.fim}</p>
                        <p><strong>Período de Avaliação:</strong> {selectedEvent.datas.avaliacao.inicio} a {selectedEvent.datas.avaliacao.fim}</p>
                        {selectedEvent.foto && (
                            <div className="event-details-image-container">
                                <img src={selectedEvent.foto} alt={`Foto do evento ${selectedEvent.nome}`} className="event-details-image" />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'projetos' && (
                    <div className="tab-section">
                        <h3>Projetos Submetidos ({pendingProjects.length + approvedProjects.length + rejectedProjects.length})</h3>

                        {/* Botão para adicionar projeto de teste */}
                        <div className="add-test-project-section">
                            <h4>Adicionar Projeto de Teste (APENAS PARA TESTE)</h4>
                            <p>Clique para adicionar um projeto pendente a este evento selecionado para testar as funcionalidades de aprovação/rejeição.</p>
                            <button
                                onClick={() => {
                                    if (selectedEvent) {
                                        addProjectToEvent(selectedEvent.id, {
                                            nome: `Projeto Teste ${Math.random().toFixed(2)}`,
                                            alunoId: `aluno${Math.floor(Math.random() * 100)}`,
                                            descricao: "Descrição de um projeto de teste para simulação de gerenciamento.",
                                            arquivoUrl: "https://example.com/projeto-teste.pdf"
                                        });
                                        addNotification('Projeto de teste adicionado!', 'info');
                                    }
                                }}
                                className="btn-add-test-project"
                            >
                                Adicionar Projeto de Teste
                            </button>
                        </div>
                        <hr className="section-divider" />

                        {/* Projetos Pendentes */}
                        <div className="project-status-section">
                            <h4>Projetos Pendentes ({pendingProjects.length})</h4>
                            {pendingProjects.length === 0 ? (
                                <p className="no-projects-message">Nenhum projeto pendente de avaliação.</p>
                            ) : (
                                <div className="projects-grid">
                                    {pendingProjects.map(project => (
                                        <div key={project.id} className="project-card pending">
                                            <h5>{project.nome} <span className="project-status-badge pending">Pendente</span></h5>
                                            <p><strong>Aluno:</strong> {project.alunoId}</p>
                                            <p>{project.descricao}</p>
                                            {project.arquivoUrl && <a href={project.arquivoUrl} target="_blank" rel="noopener noreferrer" className="btn-view-project">Ver Projeto</a>}
                                            <div className="project-actions">
                                                <button onClick={() => handleApproveProject(project.id)} className="btn-approve">Aprovar</button>
                                                <button onClick={() => handleRejectProject(project.id)} className="btn-reject">Rejeitar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Modal/Input de Mensagem de Rejeição */}
                        {showRejectionInput && (
                            <div className="rejection-modal-overlay">
                                <div className="rejection-modal-content">
                                    <h4>Mensagem de Rejeição</h4>
                                    <textarea
                                        placeholder="Explique ao aluno o motivo da rejeição..."
                                        value={rejectionMessage}
                                        onChange={(e) => setRejectionMessage(e.target.value)}
                                        rows="5"
                                    ></textarea>
                                    <div className="modal-actions">
                                        <button onClick={confirmRejectProject} className="btn-modal-confirm">Confirmar Rejeição</button>
                                        <button onClick={() => setShowRejectionInput(false)} className="btn-modal-cancel">Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Projetos Aprovados */}
                        <div className="project-status-section">
                            <h4>Projetos Aprovados ({approvedProjects.length})</h4>
                            {approvedProjects.length === 0 ? (
                                <p className="no-projects-message">Nenhum projeto aprovado ainda.</p>
                            ) : (
                                <div className="projects-grid">
                                    {approvedProjects.map(project => (
                                        <div key={project.id} className="project-card approved">
                                            <h5>{project.nome} <span className="project-status-badge approved">Aprovado</span></h5>
                                            <p><strong>Aluno:</strong> {project.alunoId}</p>
                                            <p>{project.descricao}</p>
                                            {project.arquivoUrl && <a href={project.arquivoUrl} target="_blank" rel="noopener noreferrer" className="btn-view-project">Ver Projeto</a>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Projetos Rejeitados */}
                        <div className="project-status-section">
                            <h4>Projetos Rejeitados ({rejectedProjects.length})</h4>
                            {rejectedProjects.length === 0 ? (
                                <p className="no-projects-message">Nenhum projeto rejeitado ainda.</p>
                            ) : (
                                <div className="projects-grid">
                                    {rejectedProjects.map(project => (
                                        <div key={project.id} className="project-card rejected">
                                            <h5>{project.nome} <span className="project-status-badge rejected">Rejeitado</span></h5>
                                            <p><strong>Aluno:</strong> {project.alunoId}</p>
                                            <p>{project.descricao}</p>
                                            {project.mensagemRejeicao && <p className="rejection-reason"><strong>Motivo:</strong> {project.mensagemRejeicao}</p>}
                                            {project.arquivoUrl && <a href={project.arquivoUrl} target="_blank" rel="noopener noreferrer" className="btn-view-project">Ver Projeto</a>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'avaliadores' && (
                    <div className="tab-section">
                        <h3>Gerenciar Avaliadores</h3>
                        <p>Convide novos avaliadores ou remova avaliadores existentes para este evento.</p>
                        <div className="placeholder-content">
                            <p>Lógica de convite e remoção de avaliadores a ser implementada.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'prazos' && (
                    <div className="tab-section">
                        <h3>Editar Prazos do Evento</h3>
                        <p>Altere as datas de submissão e avaliação do evento.</p>
                        <div className="placeholder-content">
                            <p>Formulário de edição de datas a ser implementado.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'ranking' && (
                    <div className="tab-section">
                        <h3>Ranking e Médias dos Projetos</h3>
                        <p>Calcule a média de avaliação dos projetos e divulgue o ranking.</p>
                        <div className="placeholder-content">
                            <p>Lógica de cálculo de ranking e divulgação a ser implementada.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
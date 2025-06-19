import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventsProjects } from '../contexts/EventProjectContext';
import './ver-projetos.css';

export default function VerProjetos() {
    const navigate = useNavigate();
    const { events, updateProjectStatus } = useEventsProjects(); // <--- Pegue 'events' e 'updateProjectStatus'

    // Coleta todos os projetos de todos os eventos
    const allProjects = events.flatMap(event => 
        event.projetos.map(project => ({ ...project, eventTitle: event.titulo, eventCode: event.codigo, eventId: event.id }))
    );

    // Função para ver detalhes (ainda não implementada)
    const handleViewDetails = (projectId) => {
        alert(`Simulando: Ver detalhes do projeto ${projectId}`);
    };

    // Função para remover um projeto (ainda não implementada no contexto EventProject, mas pode ser adicionada)
    const handleRemoveProject = (projectId, projectName) => {
        if (window.confirm(`Tem certeza que deseja SIMULAR a remoção do projeto "${projectName}"? (Esta função não remove realmente no contexto ainda)`)) {
            alert(`Simulando: Projeto "${projectName}" (ID: ${projectId}) removido.`);
        }
    };

    // Função para mudar o status de um projeto (exemplo)
    const handleChangeStatus = (event, projectId, currentStatus) => {
        const newStatus = prompt(`Mudar status de "${event.titulo}" para (aprovado, rejeitado, em avaliação, pendente avaliacao):`, currentStatus);
        if (newStatus && ['aprovado', 'rejeitado', 'em avaliação', 'pendente avaliacao'].includes(newStatus.toLowerCase())) {
            let rejectionMessage = '';
            if (newStatus.toLowerCase() === 'rejeitado') {
                rejectionMessage = prompt('Motivo da rejeição (opcional):', '');
            }
            updateProjectStatus(event.id, projectId, newStatus, rejectionMessage);
            alert(`Status do projeto "${event.titulo}" atualizado para: ${newStatus}`);
        } else if (newStatus !== null) {
            alert('Status inválido. Use "aprovado", "rejeitado", "em avaliação" ou "pendente avaliacao".');
        }
    };


    return (
        <div className="ver-projetos-container">
            <h1 className="projetos-title">Meus Projetos Submetidos</h1>
            <p className="projetos-description">
                Aqui você pode acompanhar o status e gerenciar todos os projetos enviados.
            </p>
            
            {allProjects.length === 0 ? (
                <div className="no-projects-message">
                    <p>Você ainda não enviou nenhum projeto.</p>
                    <button className="add-first-project-btn" onClick={() => navigate('/criar-projeto')}>
                        Enviar meu primeiro projeto agora!
                    </button>
                </div>
            ) : (
                <div className="projetos-list-grid">
                    {allProjects.map((project) => (
                        <div key={project.id} className="projeto-card">
                            <h3 className="projeto-card-title">{project.titulo}</h3>
                            <p className="projeto-card-professor">
                                Coordenador: <span>{project.professorCoordenador}</span>
                            </p>
                            <p className="projeto-card-event"> {/* Novo campo para o evento */}
                                Evento: <span>{project.eventTitle} ({project.eventCode})</span>
                            </p>
                            <p className="projeto-card-category">
                                Categoria: <span>{project.categoriaApresentacao}</span>
                            </p>
                            <p className="projeto-card-status">
                                Status: <span className={`status-${project.status.toLowerCase().replace(/\s/g, '-')}`}>{project.status}</span>
                                {project.status.toLowerCase() === 'rejeitado' && project.mensagemRejeicao && (
                                    <span className="rejection-reason"> ({project.mensagemRejeicao})</span>
                                )}
                            </p>
                            <p className="projeto-card-date">
                                Enviado em: <span>{new Date(project.dataEnvio).toLocaleDateString()}</span>
                            </p>
                            <div className="projeto-card-actions">
                                <button className="btn-view-details" onClick={() => handleViewDetails(project.id)}>
                                    Ver Detalhes
                                </button>
                                {/* Adicione um botão para mudar o status (exemplo) */}
                                <button className="btn-change-status" onClick={() => handleChangeStatus(project, project.id, project.status)}>
                                    Mudar Status
                                </button>
                                <button className="btn-remove-project" onClick={() => handleRemoveProject(project.id, project.titulo)}>
                                    Remover
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
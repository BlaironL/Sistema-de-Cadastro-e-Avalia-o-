import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEventsProjects } from '../contexts/EventProjectContext';
import { useNotifications } from '../contexts/NotificationContext';
import './avaliar-projeto.css';

export default function AvaliarProjetos() {
    const navigate = useNavigate();
    const location = useLocation();
    const { events, updateProjectStatus, addOrUpdateProjectEvaluation } = useEventsProjects(); // Pegue a nova função
    const { addNotification } = useNotifications();

    const [selectedEventToEvaluate, setSelectedEventToEvaluate] = useState(null);
    const [selectedProjectForEvaluation, setSelectedProjectForEvaluation] = useState(null);
    const [evaluationScores, setEvaluationScores] = useState({
        originalidade: 0,
        relevancia: 0,
        metodologia: 0,
        apresentacao: 0
    });
    const [evaluationComments, setEvaluationComments] = useState('');

    // --- ID FIXO DO AVALIADOR PARA TESTE ---
    // Em uma aplicação real, este viria do contexto de autenticação do usuário logado.
    const currentAvaliadorEmail = 'avaliador-email@exemplo.com'; 

    // Filtra os eventos aos quais o avaliador foi aprovado
    const avaliadorApprovedEvents = events.filter(event => 
        (event.avaliadoresConvidados || []).some(
            avaliador => String(avaliador.email) === String(currentAvaliadorEmail) && avaliador.status === 'aceito'
        )
    );

    // Efeito para selecionar um evento automaticamente se vier do clique na notificação
    useEffect(() => {
        if (location.state?.eventId && avaliadorApprovedEvents.length > 0) {
            const eventFromNotification = avaliadorApprovedEvents.find(
                event => String(event.id) === String(location.state.eventId)
            );
            if (eventFromNotification) {
                setSelectedEventToEvaluate(eventFromNotification);
                addNotification(`Você foi redirecionado para avaliar projetos no evento "${eventFromNotification.titulo}".`, 'info');
                // Limpa o state da localização para não disparar novamente ao recarregar a página
                navigate(location.pathname, { replace: true, state: {} }); 
            }
        }
    }, [location.state, avaliadorApprovedEvents, addNotification, navigate]);

    // Função para abrir o formulário de avaliação de um projeto no modal
    const handleOpenEvaluationForm = useCallback((project) => {
        setSelectedProjectForEvaluation(project);
        // Preenche o formulário com a avaliação existente do avaliador atual
        const existingEvaluation = (project.avaliacoes || []).find(
            (evalu => String(evalu.avaliadorId) === String(currentAvaliadorEmail))
        );
        if (existingEvaluation) {
            setEvaluationScores(existingEvaluation.criterios);
            setEvaluationComments(existingEvaluation.comentarios);
        } else {
            setEvaluationScores({ originalidade: 0, relevancia: 0, metodologia: 0, apresentacao: 0 });
            setEvaluationComments('');
        }
    }, [currentAvaliadorEmail]);


    const handleScoreChange = (criterion, value) => {
        setEvaluationScores(prev => ({ ...prev, [criterion]: Math.max(0, Math.min(10, Number(value))) })); // Garante 0-10
    };

    const handleSubmitEvaluation = (e) => {
        e.preventDefault();
        if (!selectedProjectForEvaluation || !selectedEventToEvaluate) return;

        const scores = Object.values(evaluationScores);
        const totalScore = scores.reduce((sum, score) => sum + score, 0);
        const averageScore = scores.length > 0 ? (totalScore / scores.length).toFixed(1) : 0;

        const evaluationData = {
            avaliadorId: currentAvaliadorEmail, // ID do avaliador logado
            criterios: evaluationScores,
            comentarios: evaluationComments,
            mediaFinal: averageScore,
            dataAvaliacao: new Date().toISOString()
        };

        console.log(`Submetendo avaliação para Projeto ${selectedProjectForEvaluation.titulo}:`, evaluationData);

        // Chama a função do contexto para adicionar/atualizar a avaliação
        addOrUpdateProjectEvaluation(selectedEventToEvaluate.id, selectedProjectForEvaluation.id, evaluationData);

        addNotification(`Avaliação para "${selectedProjectForEvaluation.titulo}" enviada! Média: ${averageScore}.`, 'info');
        setSelectedProjectForEvaluation(null); // Fecha o modal/formulário

        // Limpa os estados do formulário após envio
        setEvaluationScores({ originalidade: 0, relevancia: 0, metodologia: 0, apresentacao: 0 });
        setEvaluationComments('');
    };


    return (
        <div className="avaliar-projetos-container">
            <h1 className="avaliar-title">Avaliar Projetos</h1>
            <p className="avaliar-description">
                Analise e forneça feedback sobre os projetos dos eventos aos quais você está inscrito.
            </p>

            {!selectedEventToEvaluate ? ( // Modo: Seleção de Evento
                <>
                    <h2>Selecione um Evento para Avaliar</h2>
                    {avaliadorApprovedEvents.length === 0 ? (
                        <div className="no-events-message">
                            <p>Você não está inscrito como avaliador em nenhum evento ainda.</p>
                            <button className="go-to-request-btn" onClick={() => navigate('/solicitar-avaliacao')}>
                                Solicitar participação em um evento
                            </button>
                            <button className="back-to-dashboard-btn" onClick={() => navigate('/dashboard')}>
                                Voltar para o Dashboard
                            </button>
                        </div>
                    ) : (
                        <div className="eventos-avaliacao-grid">
                            {avaliadorApprovedEvents.map(event => (
                                <div 
                                    key={event.id} 
                                    className="event-to-evaluate-card" 
                                    onClick={() => setSelectedEventToEvaluate(event)}
                                >
                                    <h3>{event.titulo}</h3>
                                    <p>Código: <span>{event.codigo}</span></p>
                                    <p>Local: <span>{event.local || 'Não informado'}</span></p>
                                    <p>Data: <span>{event.data ? new Date(event.data).toLocaleDateString() : 'Não informada'}</span></p>
                                    <p className="card-description">{event.descricao}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : ( // Modo: Avaliação de Projetos de um Evento Específico
                <>
                    <button className="back-to-event-list-btn" onClick={() => setSelectedEventToEvaluate(null)}>
                        &larr; Voltar para a lista de eventos
                    </button>
                    <h2 className="event-projects-title">Projetos para Avaliar em: <br/>{selectedEventToEvaluate.titulo}</h2>
                    <p className="event-projects-description">Código: {selectedEventToEvaluate.codigo}</p>

                    {selectedEventToEvaluate.projetos && selectedEventToEvaluate.projetos.length > 0 ? (
                        <div className="projetos-avaliacao-grid">
                            {selectedEventToEvaluate.projetos.map(project => {
                                // Verifica se o avaliador atual já avaliou este projeto
                                const hasEvaluated = (project.avaliacoes || []).some(
                                    evalu => String(evalu.avaliadorId) === String(currentAvaliadorEmail)
                                );
                                const averageScore = hasEvaluated 
                                    ? ((project.avaliacoes || []).find(evalu => String(evalu.avaliadorId) === String(currentAvaliadorEmail))?.mediaFinal || 'N/A')
                                    : 'N/A';

                                return (
                                    <div key={project.id} className={`projeto-avaliacao-card ${hasEvaluated ? 'evaluated' : ''}`}> {/* Adiciona classe 'evaluated' */}
                                        <h3 className="card-title">{project.titulo}</h3>
                                        <p className="card-event-info">Coordenador: <span>{project.professorCoordenador}</span></p>
                                        <p className="card-category-info">Categoria: <span>{project.categoriaApresentacao}</span></p>
                                        <p className="card-status-info">Status: <span className={`status-${(project.status || '').toLowerCase().replace(/\s/g, '-')}`}>{project.status}</span></p>
                                        {hasEvaluated && ( /* Exibe a média do avaliador */
                                            <p className="card-your-score">Sua Média: <span>{averageScore}</span></p>
                                        )}
                                        <div className="card-actions">
                                            <button className="btn-view-summary" onClick={() => alert(`Resumo do projeto <span class="math-inline">\{project\.titulo\}\:\\n\\n</span>{project.resumo}`)}>
                                                Ver Resumo
                                            </button>
                                            <button
                                                className="btn-evaluate"
                                                onClick={() => handleOpenEvaluationForm(project)}
                                            >
                                                {hasEvaluated ? 'Revisar Avaliação' : 'Avaliar Projeto'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="no-projects-message">
                            <p>Nenhum projeto disponível para avaliação neste evento ainda.</p>
                        </div>
                    )}
                </>
            )}

            {/* Modal/Formulário de Avaliação */}
            {selectedProjectForEvaluation && (
                <div className="evaluation-modal-overlay">
                    <div className="evaluation-modal-content">
                        <button className="close-modal-btn" onClick={() => setSelectedProjectForEvaluation(null)}>&times;</button>
                        <h2>Avaliar: {selectedProjectForEvaluation.titulo}</h2>
                        <form onSubmit={handleSubmitEvaluation} className="evaluation-form">
                            <p className="form-info-text">Avalie de 0 a 10 em cada critério:</p>
                            <div className="criteria-grid">
                                <div className="form-group-score">
                                    <label>Originalidade:</label>
                                    <input type="number" min="0" max="10" value={evaluationScores.originalidade} onChange={(e) => handleScoreChange('originalidade', e.target.value)} />
                                </div>
                                <div className="form-group-score">
                                    <label>Relevância:</label>
                                    <input type="number" min="0" max="10" value={evaluationScores.relevancia} onChange={(e) => handleScoreChange('relevancia', e.target.value)} />
                                </div>
                                <div className="form-group-score">
                                    <label>Metodologia:</label>
                                    <input type="number" min="0" max="10" value={evaluationScores.metodologia} onChange={(e) => handleScoreChange('metodologia', e.target.value)} />
                                </div>
                                <div className="form-group-score">
                                    <label>Apresentação:</label>
                                    <input type="number" min="0" max="10" value={evaluationScores.apresentacao} onChange={(e) => handleScoreChange('apresentacao', e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="comentarios">Comentários Adicionais:</label>
                                <textarea
                                    id="comentarios"
                                    value={evaluationComments}
                                    onChange={(e) => setEvaluationComments(e.target.value)}
                                    rows="4"
                                    placeholder="Forneça feedback detalhado..."
                                ></textarea>
                            </div>
                            <button type="submit" className="submit-evaluation-btn">Enviar Avaliação</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
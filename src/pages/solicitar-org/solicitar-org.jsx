import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Caminho ajustado: de 'src/pages/solicitar-org/' para 'src/contexts/'
import { useEventsProjects } from '../contexts/EventProjectContext.jsx'; // <-- Caminho Corrigido
// Caminho ajustado: de 'src/pages/solicitar-org/' para 'src/contexts/'
import { useNotifications } from '../contexts/NotificationContext.jsx'; // <-- Caminho Corrigido
import './solicitar-org.css'; // Certifique-se de que este ficheiro CSS existe na mesma pasta que SolicitarOrganizacao.jsx!

// O componente agora recebe 'userEmail' como uma prop (opcional, para redundância)
export default function SolicitarOrganizacao({ userEmail: propUserEmail }) { // <-- Renomeado para evitar conflito
    const navigate = useNavigate();
    const { events, getEventByIdentifier, createEvent, addOrganizerRequestToEvent } = useEventsProjects();
    const { addNotification } = useNotifications();

    const [searchTerm, setSearchTerm] = useState('');
    const [foundEvents, setFoundEvents] = useState([]);
    const [selectedEventToRequest, setSelectedEventToRequest] = useState(null);
    const [motivation, setMotivation] = useState('');

    // Adiciona eventos de teste na primeira vez que o componente montar
    useEffect(() => {
        const testEventIds = ['test-event-001', 'test-event-002', 'test-event-003'];
        const existingTestEvents = new Set((events || []).map(e => e.id));

        const needsToAddTestEvents = testEventIds.some(id => !existingTestEvents.has(id));

        if (needsToAddTestEvents) {
            console.log("SolicitarOrganizacao: Adicionando eventos de teste...");
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


    // Lógica de pesquisa de eventos
    useEffect(() => {
        if (searchTerm.length >= 3) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const filteredResults = (events || []).filter(event =>
                (event?.titulo || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (event?.codigo || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (event?.local || '').toLowerCase().includes(lowerCaseSearchTerm)
            );
            setFoundEvents(filteredResults);
        } else {
            setFoundEvents([]);
            setSelectedEventToRequest(null);
        }
    }, [searchTerm, events]);

    // Lógica para selecionar um evento para enviar a solicitação
    const handleSelectEvent = (event) => {
        setSelectedEventToRequest(event);
        setSearchTerm(event.titulo);
        setFoundEvents([]); // Limpa os resultados da busca
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // Rola para o formulário
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        if (!selectedEventToRequest) {
            addNotification('Por favor, selecione um evento para enviar a solicitação.', 'alerta');
            return;
        }
        if (!motivation.trim()) {
            addNotification('Por favor, digite sua motivação para a organização.', 'alerta');
            return;
        }

        // Tenta obter o e-mail da prop, se não estiver disponível, tenta do localStorage
        const currentEmail = propUserEmail || localStorage.getItem('userEmail');

        if (!currentEmail) { // Verifica se o e-mail está disponível
            addNotification('Erro: O seu e-mail de utilizador não está disponível. Faça login novamente.', 'alerta');
            return;
        }

        try {
            addOrganizerRequestToEvent(selectedEventToRequest.id, {
                email: currentEmail, // <-- AGORA USA O E-MAIL DISPONÍVEL
                nome: currentEmail.split('@')[0], // Simples nome baseado no e-mail (ajuste conforme necessário)
                motivation: motivation,
                status: 'pendente'
            });

            await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay

            addNotification(`Solicitação para organizar "${selectedEventToRequest.titulo}" enviada com sucesso!`, 'info');
            navigate('/dashboard'); // Redireciona após o envio
        } catch (error) {
            console.error("Erro ao enviar solicitação de organização:", error);
            addNotification('Erro ao enviar solicitação de organização. Tente novamente.', 'alerta');
        }
    };

    return (
        <div className="solicitar-organizacao-container">
            <h1 className="solicitar-title">Solicitar Colaboração em Organização</h1>
            <p className="solicitar-description">
                Pesquise por eventos e envie uma solicitação para participar da equipa de organização.
            </p>

            <div className="search-section">
                <input
                    type="text"
                    placeholder="Buscar evento por título, código ou local..."
                    className="search-event-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm.length >= 3 && foundEvents.length > 0 && (
                    <div className="search-results">
                        {foundEvents.map(event => (
                            <div key={event.id} className="search-result-item" onClick={() => handleSelectEvent(event)}>
                                <h4>{event.titulo} ({event.codigo})</h4>
                                <p>{event.local} - {new Date(event.data).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}
                {searchTerm.length >=3 && foundEvents.length === 0 && (
                    <p className="no-results-message">Nenhum evento encontrado com este termo.</p>
                )}
            </div>

            {selectedEventToRequest && (
                <div className="request-form-section">
                    <h2>Enviar Solicitação para Organizar:</h2>
                    <div className="selected-event-details-box">
                        <h3>{selectedEventToRequest.titulo}</h3>
                        <p>Código: <span>{selectedEventToRequest.codigo}</span></p>
                        <p>Local: <span>{selectedEventToRequest.local}</span></p>
                        <p>Data: <span>{new Date(selectedEventToRequest.data).toLocaleDateString()}</span></p>
                        <p className="event-description-text">{selectedEventToRequest.descricao}</p>
                    </div>

                    <form onSubmit={handleSubmitRequest} className="solicitation-form">
                        <div className="form-group">
                            <label htmlFor="motivation">Sua Motivação (Por que você quer organizar este evento?):</label>
                            <textarea
                                id="motivation"
                                value={motivation}
                                onChange={(e) => setMotivation(e.target.value)}
                                rows="5"
                                placeholder="Descreva brevemente sua experiência ou interesse..."
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="submit-solicitation-btn">Enviar Solicitação de Organização</button>
                        <button type="button" className="cancel-solicitation-btn" onClick={() => setSelectedEventToRequest(null)}>Cancelar</button>
                    </form>
                </div>
            )}
        </div>
    );
}
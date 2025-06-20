import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// 1. Criação do Contexto
export const EventProjectContext = createContext();

// Função auxiliar para gerar um código alfanumérico único e curto
const generateUniqueCode = (length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

// Função auxiliar para gerar um ID que é garantido ser único (mais robusto)
const generateUniqueId = (existingIds = new Set()) => {
    let newId;
    do {
        newId = Date.now().toString() + Math.random().toString(36).substr(2, 9); // Combina timestamp com parte aleatória
    } while (existingIds.has(newId)); // Garante que o ID não está nos IDs já existentes
    return newId;
};


// 2. Provedor do Contexto
export const EventProjectProvider = ({ children }) => {
    const [events, setEvents] = useState(() => {
        try {
            const storedEvents = localStorage.getItem('events');
            const parsedEvents = storedEvents ? JSON.parse(storedEvents) : [];
            return parsedEvents.map(event => ({
                ...event,
                id: String(event.id),
                codigo: event.codigo || generateUniqueCode(),
                projetos: event.projetos || [],
                avaliadoresConvidados: event.avaliadoresConvidados || [],
                organizadoresConvidados: event.organizadoresConvidados || [],
                solicitacoesAvaliadores: event.solicitacoesAvaliadores || [],
                solicitacoesOrganizadores: event.solicitacoesOrganizadores || [], // <--- NOVO: Array para solicitações de organizadores
            }));
        } catch (error) {
            console.error("Erro ao carregar eventos do localStorage:", error);
            return [];
        }
    });

    // Efeito para salvar eventos no localStorage sempre que 'events' mudar
    useEffect(() => {
        try {
            localStorage.setItem('events', JSON.stringify(events));
        } catch (error) {
            console.error("Erro ao salvar eventos no localStorage:", error);
        }
    }, [events]);

    // Função para adicionar um novo evento (chamada 'createEvent')
    const createEvent = useCallback((newEventData) => {
        setEvents(prevEvents => {
            const existingIds = new Set(prevEvents.map(e => e.id));
            let finalId = newEventData.id;
            if (!finalId || existingIds.has(String(finalId))) {
                if (finalId && String(finalId).startsWith('test-event-')) {
                     finalId = generateUniqueId(existingIds);
                } else if (!finalId) {
                    finalId = generateUniqueId(existingIds);
                } else {
                    console.warn(`Evento com ID ${finalId} já existe. Não adicionando duplicata.`);
                    return prevEvents;
                }
            } else {
                finalId = String(finalId);
            }

            const newEvent = {
                id: finalId,
                codigo: newEventData.codigo || generateUniqueCode(),
                projetos: [],
                avaliadoresConvidados: [],
                organizadoresConvidados: [],
                solicitacoesAvaliadores: [],
                solicitacoesOrganizadores: [], // <--- NOVO: Inicializa array
                ...newEventData,
                createdAt: new Date().toISOString()
            };
            return [newEvent, ...prevEvents];
        });
    }, []);

    // Função para adicionar um projeto a um evento específico
    const addProjectToEvent = useCallback((eventIdentifier, projectData) => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (String(event.id) === String(eventIdentifier) || String(event.codigo) === String(eventIdentifier)) {
                const newProject = {
                    id: generateUniqueId(new Set(event.projetos?.map(p => p.id) || [])),
                    ...projectData,
                    status: projectData.status || 'Pendente Avaliação',
                    createdAt: new Date().toISOString(),
                    avaliacoes: [],
                    mensagemRejeicao: '',
                };
                return {
                    ...event,
                    projetos: [...(event.projetos || []), newProject]
                };
            }
            return event;
        }));
    }, []);

    // Função para atualizar o status de um projeto (aprovar/rejeitar) e adicionar mensagem
    const updateProjectStatus = useCallback((eventIdentifier, projectId, newStatus, rejectionMessage = '') => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (String(event.id) === String(eventIdentifier) || String(event.codigo) === String(eventIdentifier)) {
                return {
                    ...event,
                    projetos: (event.projetos || []).map(project => {
                        if (String(project.id) === String(projectId)) {
                            return {
                                ...project,
                                status: newStatus,
                                mensagemRejeicao: newStatus === 'rejeitado' ? rejectionMessage : ''
                            };
                        }
                        return project;
                    })
                };
            }
            return event;
        }));
    }, []);

    // Função para atualizar informações gerais de um evento
    const updateEvent = useCallback((eventId, updatedData) => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (String(event.id) === String(eventId)) {
                return { ...event, ...updatedData };
            }
            return event;
        }));
        console.log('EventProjectProvider: Evento atualizado:', eventId, updatedData);
    }, []);

    // Função para convidar avaliadores/organizadores
    const inviteParticipant = useCallback((eventIdentifier, participantEmail, role) => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (String(event.id) === String(eventIdentifier) || String(event.codigo) === String(eventIdentifier)) {
                const newParticipant = { email: participantEmail, role: role, status: 'pendente' };
                let updatedEvent = { ...event };
                if (role === 'avaliador') {
                    if (!(updatedEvent.avaliadoresConvidados || []).some(p => String(p.email) === String(participantEmail))) {
                        updatedEvent.avaliadoresConvidados = [...(updatedEvent.avaliadoresConvidados || []), newParticipant];
                    }
                } else if (role === 'organizador') {
                    if (!(updatedEvent.organizadoresConvidados || []).some(p => String(p.email) === String(participantEmail))) {
                        updatedEvent.organizadoresConvidados = [...(updatedEvent.organizadoresConvidados || []), newParticipant];
                    }
                }
                return updatedEvent;
            }
            return event;
        }));
    }, []);

    // Função para adicionar uma solicitação de avaliador a um evento
    const addEvaluatorRequestToEvent = useCallback((eventId, requestData) => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (String(event.id) === String(eventId)) {
                const newRequest = {
                    id: generateUniqueId(new Set((event.solicitacoesAvaliadores || []).map(r => r.id))),
                    ...requestData, // email, nome, motivation, status (pendente)
                    createdAt: new Date().toISOString(),
                };
                if ((event.solicitacoesAvaliadores || []).some(req => String(req.email) === String(newRequest.email) && req.status === 'pendente')) {
                    console.warn(`Solicitação de ${newRequest.email} para ${event.titulo} já existe e está pendente.`);
                    return event;
                }
                return {
                    ...event,
                    solicitacoesAvaliadores: [...(event.solicitacoesAvaliadores || []), newRequest]
                };
            }
            return event;
        }));
    }, []);

    // Função para aceitar/rejeitar solicitação de avaliador
    const handleEvaluatorRequest = useCallback((eventId, requestId, newStatus, participantData) => {
        let acceptedParticipant = null;

        setEvents(prevEvents => prevEvents.map(event => {
            if (String(event.id) === String(eventId)) {
                const updatedSolicitations = (event.solicitacoesAvaliadores || []).map(request => {
                    if (String(request.id) === String(requestId)) {
                        return { ...request, status: newStatus, handledAt: new Date().toISOString() };
                    }
                    return request;
                });

                let updatedEvent = { ...event, solicitacoesAvaliadores: updatedSolicitations };

                if (newStatus === 'aprovado') {
                    const requester = (event.solicitacoesAvaliadores || []).find(req => String(req.id) === String(requestId));
                    if (requester && !(updatedEvent.avaliadoresConvidados || []).some(p => String(p.email) === String(requester.email))) {
                        acceptedParticipant = { email: requester.email, nome: requester.nome || requester.email, status: 'aceito' };
                        updatedEvent.avaliadoresConvidados = [...(updatedEvent.avaliadoresConvidados || []), acceptedParticipant];
                    }
                }
                return updatedEvent;
            }
            return event;
        }));
        return acceptedParticipant;
    }, []);

    // Função para adicionar ou atualizar a avaliação de um projeto
    const addOrUpdateProjectEvaluation = useCallback((eventId, projectId, evaluation) => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (String(event.id) === String(eventId)) {
                return {
                    ...event,
                    projetos: (event.projetos || []).map(project => {
                        if (String(project.id) === String(projectId)) {
                            const existingEvaluations = project.avaliacoes || [];
                            const updatedEvaluations = existingEvaluations.some(
                                (evalu) => String(evalu.avaliadorId) === String(evaluation.avaliadorId)
                            )
                                ? existingEvaluations.map((evalu) =>
                                      String(evalu.avaliadorId) === String(evaluation.avaliadorId) ? evaluation : evalu
                                  )
                                : [...existingEvaluations, evaluation];

                            return {
                                ...project,
                                avaliacoes: updatedEvaluations,
                            };
                        }
                        return project;
                    }),
                };
            }
            return event;
        }));
    }, []);

    // <--- NOVO: Função para adicionar uma solicitação de organizador a um evento --->
    const addOrganizerRequestToEvent = useCallback((eventId, requestData) => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (String(event.id) === String(eventId)) {
                const newRequest = {
                    id: generateUniqueId(new Set((event.solicitacoesOrganizadores || []).map(r => r.id))), // ID único
                    ...requestData, // email, nome, motivation, status (pendente)
                    createdAt: new Date().toISOString(),
                };
                if ((event.solicitacoesOrganizadores || []).some(req => String(req.email) === String(newRequest.email) && req.status === 'pendente')) {
                    console.warn(`Solicitação de organização de ${newRequest.email} para ${event.titulo} já existe e está pendente.`);
                    return event;
                }
                return {
                    ...event,
                    solicitacoesOrganizadores: [...(event.solicitacoesOrganizadores || []), newRequest]
                };
            }
            return event;
        }));
    }, []);

    // <--- NOVO: Função para aceitar/rejeitar solicitação de organizador --->
    const handleOrganizerRequest = useCallback((eventId, requestId, newStatus, participantData) => {
        let acceptedParticipant = null;

        setEvents(prevEvents => prevEvents.map(event => {
            if (String(event.id) === String(eventId)) {
                const updatedSolicitations = (event.solicitacoesOrganizadores || []).map(request => {
                    if (String(request.id) === String(requestId)) {
                        return { ...request, status: newStatus, handledAt: new Date().toISOString() };
                    }
                    return request;
                });

                let updatedEvent = { ...event, solicitacoesOrganizadores: updatedSolicitations };

                if (newStatus === 'aprovado') {
                    const requester = (event.solicitacoesOrganizadores || []).find(req => String(req.id) === String(requestId));
                    if (requester && !(updatedEvent.organizadoresConvidados || []).some(p => String(p.email) === String(requester.email))) {
                        acceptedParticipant = { email: requester.email, nome: requester.nome || requester.email, status: 'aceito' };
                        updatedEvent.organizadoresConvidados = [...(updatedEvent.organizadoresConvidados || []), acceptedParticipant];
                    }
                }
                return updatedEvent;
            }
            return event;
        }));
        return acceptedParticipant;
    }, []);


    // Função para buscar um evento por código ou ID
    const getEventByIdentifier = useCallback((identifier) => {
        return events.find(event => String(event.id) === String(identifier) || String(event.codigo) === String(identifier));
    }, [events]);

    const contextValue = {
        events,
        createEvent,
        updateEvent,
        addProjectToEvent,
        updateProjectStatus,
        inviteParticipant,
        addEvaluatorRequestToEvent,
        handleEvaluatorRequest,
        addOrUpdateProjectEvaluation,
        addOrganizerRequestToEvent,   // <--- NOVO: Adicionado ao contextValue
        handleOrganizerRequest,       // <--- NOVO: Adicionado ao contextValue
        getEventByIdentifier,
    };

    return (
        <EventProjectContext.Provider value={contextValue}>
            {children}
        </EventProjectContext.Provider>
    );
};

// 3. Hook customizado para fácil consumo
export const useEventsProjects = () => {
    const context = useContext(EventProjectContext);
    if (!context) {
        throw new Error('useEventsProjects must be used within an EventProjectProvider');
    }
    return context;
};
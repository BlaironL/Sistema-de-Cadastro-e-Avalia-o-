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

// 2. Provedor do Contexto
export const EventProjectProvider = ({ children }) => {
    // Estado inicial: tentar carregar eventos do localStorage
    const [events, setEvents] = useState(() => {
        try {
            const storedEvents = localStorage.getItem('events'); // Usar 'events' como chave
            return storedEvents ? JSON.parse(storedEvents) : [];
        } catch (error) {
            console.error("Erro ao carregar eventos do localStorage:", error);
            return [];
        }
    });

    // Efeito para salvar eventos no localStorage sempre que 'events' mudar
    useEffect(() => {
        try {
            localStorage.setItem('events', JSON.stringify(events)); // Salvar 'events'
        } catch (error) {
            console.error("Erro ao salvar eventos no localStorage:", error);
        }
    }, [events]);

    // Função para adicionar um novo evento
    const addEvent = useCallback((newEventData) => {
        const newEvent = {
            id: Date.now().toString(), // ID único como string
            codigo: generateUniqueCode(), // Gera código único para o evento
            projetos: [], // Array para armazenar projetos submetidos a este evento
            avaliadoresConvidados: [],
            organizadoresConvidados: [],
            ...newEventData,
            createdAt: new Date().toISOString()
        };
        setEvents(prevEvents => [newEvent, ...prevEvents]); // Adiciona no início da lista
        console.log('EventProjectProvider: Evento adicionado:', newEvent);
        return newEvent;
    }, []);

    // NOVO: Função para adicionar um projeto a um evento específico (simulando submissão de aluno)
    // Os campos do projeto virão direto do formulário EnviarProjeto
    const addProjectToEvent = useCallback((eventIdentifier, projectData) => {
        setEvents(prevEvents => prevEvents.map(event => {
            // Pode ser pelo ID ou pelo CÓDIGO do evento
            if (event.id === eventIdentifier || event.codigo === eventIdentifier) {
                const newProject = {
                    id: Date.now().toString(), // ID único para o projeto
                    ...projectData, // Todos os dados do formulário do projeto
                    status: projectData.status || 'Pendente Avaliação', // Garante um status inicial
                    createdAt: new Date().toISOString(),
                    avaliacoes: [],
                    mensagemRejeicao: '',
                };
                return {
                    ...event,
                    projetos: [...event.projetos, newProject]
                };
            }
            return event;
        }));
    }, []);


    // NOVO: Função para atualizar o status de um projeto (aprovar/rejeitar) e adicionar mensagem
    const updateProjectStatus = useCallback((eventIdentifier, projectId, newStatus, rejectionMessage = '') => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (event.id === eventIdentifier || event.codigo === eventIdentifier) {
                return {
                    ...event,
                    projetos: event.projetos.map(project => {
                        if (project.id === projectId) {
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

    // NOVO (Placeholder): Função para convidar avaliadores/organizadores
    const inviteParticipant = useCallback((eventId, participantEmail, role) => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (event.id === eventId) {
                const newParticipant = { email: participantEmail, role: role, status: 'pendente' };
                if (role === 'avaliador') {
                    return { ...event, avaliadoresConvidados: [...event.avaliadoresConvidados, newParticipant] };
                } else if (role === 'organizador') {
                    return { ...event, organizadoresConvidados: [...event.organizadoresConvidados, newParticipant] };
                }
            }
            return event;
        }));
    }, []);

    // NOVO: Função para buscar um evento por código ou ID
    const getEventByIdentifier = useCallback((identifier) => {
        return events.find(event => event.id === identifier || event.codigo === identifier);
    }, [events]);

    const contextValue = {
        events,
        addEvent,
        addProjectToEvent,
        updateProjectStatus,
        inviteParticipant,
        getEventByIdentifier, // Disponibiliza a função de busca
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
import React, { createContext, useContext, useState, useCallback } from 'react';

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
    const [events, setEvents] = useState([]);

    // Função para adicionar um novo evento
    const addEvent = useCallback((newEventData) => {
        const newEvent = {
            id: Date.now() + Math.random(), // Garante ID único
            codigo: generateUniqueCode(), // NOVO: Gerar código único para o evento
            projetos: [], // NOVO: Array para armazenar projetos submetidos a este evento
            avaliadoresConvidados: [], // NOVO: Array para gerenciar avaliadores convidados (email, status)
            organizadoresConvidados: [], // NOVO: Array para gerenciar outros organizadores
            ...newEventData,
            createdAt: new Date().toISOString()
        };
        setEvents(prevEvents => [newEvent, ...prevEvents]);
        console.log('EventProjectProvider: Evento adicionado:', newEvent);
        return newEvent;
    }, []);

    // NOVO: Função para adicionar um projeto a um evento específico (simulando submissão de aluno)
    // Para fins de teste, pode ser chamado manualmente, mas no futuro virá de um formulário de aluno.
    const addProjectToEvent = useCallback((eventId, projectData) => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (event.id === eventId) {
                const newProject = {
                    id: Date.now() + Math.random(),
                    nome: projectData.nome,
                    alunoId: projectData.alunoId, // ID do aluno que submeteu
                    descricao: projectData.descricao,
                    arquivoUrl: projectData.arquivoUrl, // Ex: link para um PDF, GitHub, etc.
                    status: 'pendente', // Status inicial do projeto (pendente, aprovado, rejeitado)
                    mensagemRejeicao: '', // Mensagem caso seja rejeitado
                    avaliacoes: [], // Array para notas dos avaliadores
                    createdAt: new Date().toISOString(),
                    // Outros campos relevantes do projeto
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
    const updateProjectStatus = useCallback((eventId, projectId, newStatus, rejectionMessage = '') => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (event.id === eventId) {
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
                const newParticipant = { email: participantEmail, role: role, status: 'pendente' }; // Status do convite
                if (role === 'avaliador') {
                    return { ...event, avaliadoresConvidados: [...event.avaliadoresConvidados, newParticipant] };
                } else if (role === 'organizador') {
                    return { ...event, organizadoresConvidados: [...event.organizadoresConvidados, newParticipant] };
                }
            }
            return event;
        }));
        // FUTURO: Aqui você chamaria o addNotification para o usuário (email) convidado
    }, []);


    const contextValue = {
        events,
        addEvent,
        addProjectToEvent, // NOVO
        updateProjectStatus, // NOVO
        inviteParticipant, // NOVO (Placeholder)
        // Adicione outras funções de gerenciamento de eventos/projetos aqui (ex: updateEvent, deleteEvent, getEventById)
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
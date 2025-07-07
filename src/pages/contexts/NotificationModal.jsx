// src/components/NotificationModal/NotificationModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../pages/contexts/NotificationContext.jsx'; // Ajuste o caminho conforme a sua estrutura
import './NotificationModal.css'; // O CSS para o modal

// Este componente agora é o modal centralizado
export default function NotificationModal({ isOpen, onClose }) {
    const { notifications, markAsRead, removeNotification, addNotification } = useNotifications();
    const navigate = useNavigate();
    const [expandedNotificationId, setExpandedNotificationId] = useState(null);
    const modalContentRef = useRef(null); // Ref para o conteúdo do modal

    // Adiciona notificação de teste inicial se não houver nenhuma
    useEffect(() => {
        if (notifications.length === 0) {
            console.log("Adicionando notificações de teste no modal...");
            addNotification('Bem-vindo ao sistema de avaliação!', 'info');
            addNotification('Parabéns! Você foi aprovado(a) como avaliador(a) no evento "Feira de Inovação 2025"!', 'aprovado-avaliador', { eventId: 'event-test-001', eventTitle: 'Feira de Inovação 2025', recipientEmail: 'avaliador@example.com' });
            addNotification('Você tem um novo convite para colaborar em um projeto!', 'convite', { eventId: 'project-test-002', role: 'organizador_colab', projectId: 'proj-abc', team: 'Equipe Alpha' });
            // NOVO: Adicionado um convite de avaliador para testar o fluxo
            addNotification('Você foi convidado(a) para avaliar o evento "Conferência Tech 2025"!', 'convite', { eventId: 'event-test-004', eventTitle: 'Conferência Tech 2025', role: 'avaliador', recipientEmail: 'avaliador_convidado@example.com' });
        }
    }, [notifications.length, addNotification]);

    // Lógica para fechar o modal ao clicar fora do conteúdo
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
                onClose(); // Fecha o modal
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Lógica para expandir/contrair a notificação e marcá-la como lida
    const toggleExpand = (id) => {
        setExpandedNotificationId(prevId => {
            const nextExpandedId = prevId === id ? null : id;
            if (nextExpandedId !== null && nextExpandedId !== prevId) {
                markAsRead(id);
            }
            return nextExpandedId;
        });
    };

    // Lógica de Clique na Notificação Individual (APENAS EXPANDIR/MARCAR LIDA)
    const handleNotificationClick = (notif) => {
        markAsRead(notif.id);
        toggleExpand(notif.id);

        console.log(`Notificação clicada: ${notif.message} (Tipo: ${notif.type})`);

        // REMOVIDO: A navegação imediata para 'convite' e 'aprovado-avaliador'.
        // A navegação agora acontece APENAS ao clicar nos botões 'Aceitar'/'Recusar'
        // ou se for um tipo de notificação que *sempre* navega ao clicar (ex: aprovado-avaliador).
        if (notif.type === 'aprovado-avaliador' && notif.details?.eventId) {
            // Este tipo de notificação ainda navega diretamente ao clicar no item
            navigate('/avaliar-projeto', { state: { eventId: notif.details.eventId } }); // <--- CORRIGIDO AQUI
            onClose(); // Fecha o modal ao navegar
        }
    };

    // Lógica para Aceitar/Recusar convite (botões dentro da notificação expandida)
    const handleAcceptInvite = (e, notifId, details) => {
        e.stopPropagation(); // Previne que o clique no botão feche/abra o item da notificação pai
        
        // Simula a lógica de aceitação (que no futuro interagiria com o EventProjectContext)
        addNotification(`Convite aceito para ${details.role === 'avaliador' ? 'avaliar' : 'organizar'}.`, 'info');
        markAsRead(notifId); // Marca como lida
        removeNotification(notifId); // Remove a notificação de convite

        setExpandedNotificationId(null); // Fecha a notificação expandida

        // NOVO: Navega para a página de avaliação APENAS SE FOR UM CONVITE DE AVALIADOR ACEITO
        if (details.role === 'avaliador' && details.eventId) {
            navigate('/avaliar-projeto', { state: { eventId: details.eventId } }); // <--- CORRIGIDO AQUI
            onClose(); // Fecha o modal após a navegação
        } else if (details.role === 'organizador_colab' && details.projectId) {
            navigate('/gerenciar-eventos', { state: { projectId: notif.details.projectId } }); // Exemplo para organizador
            onClose();
        }
    };

    const handleDeclineInvite = (e, notifId, details) => {
        e.stopPropagation(); // Previne que o clique no botão feche/abra o item da notificação pai
        addNotification(`Convite recusado para ${details.role === 'avaliador' ? 'avaliar' : 'organizar'}.`, 'alerta'); // Alerta para recusa
        markAsRead(notifId); // Marca como lida
        removeNotification(notifId); // Remove a notificação de convite
        setExpandedNotificationId(null);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (!isOpen) return null; // Não renderiza nada se o modal não estiver aberto

    return (
        <div className="notification-modal-backdrop">
            <div className="notification-modal-content" ref={modalContentRef}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h3>Notificações ({unreadCount} não lidas)</h3>
                <ul className="notification-list">
                    {notifications.length > 0 ? (
                        notifications.map(notif => {
                            const isExpanded = expandedNotificationId === notif.id;
                            return (
                                <li
                                    key={notif.id}
                                    className={`notification-item notification-${notif.type} ${notif.read ? 'read' : ''} ${isExpanded ? 'expanded' : ''}`}
                                    onClick={() => handleNotificationClick(notif)}
                                >
                                    <span className="notification-icon">
                                        {notif.type === 'convite' && '✉️'}
                                        {notif.type === 'info' && '✅'}
                                        {notif.type === 'evento' && '🗓️'}
                                        {notif.type === 'alerta' && '⚠️'}
                                        {notif.type === 'aprovado-avaliador' && '🎉'}
                                        {notif.type === 'rejeitado-avaliador' && '❌'}
                                    </span>
                                    <div className="notification-content">
                                        {notif.message}
                                        <span className="notification-timestamp">{new Date(notif.timestamp).toLocaleString()}</span>
                                    </div>
                                    {/* Wrapper para os botões de ação direita */}
                                    <div className="notification-actions-right">
                                        <button
                                            className="remove-notification-btn"
                                            onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                                        >
                                            &times;
                                        </button>
                                        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`} onClick={(e) => e.stopPropagation()}>&#9660;</span>
                                    </div>
                                    {isExpanded && (
                                        <div className="notification-expanded-content">
                                            <p className="expanded-details">
                                                {notif.type === 'convite' && notif.details?.role === 'avaliador' &&
                                                    `Detalhes: Você foi convidado para avaliar o Evento "${notif.details?.eventTitle || 'Evento Desconhecido'}". ` +
                                                    (notif.details?.additionalInfo ? `(${notif.details.additionalInfo})` : '')
                                                }
                                                {notif.type === 'aprovado-avaliador' &&
                                                    `Parabéns! Você foi aprovado(a) como avaliador(a) no evento "${notif.details?.eventTitle || 'Evento Desconhecido'}". Clique nesta notificação para ir à tela de avaliação.`
                                                }
                                                {notif.type === 'rejeitado-avaliador' &&
                                                    `Sua solicitação para avaliar o evento "${notif.details?.eventTitle || 'Evento Desconhecido'}" foi analisada.`
                                                }
                                                {notif.type === 'convite' && notif.details?.role === 'organizador_colab' &&
                                                    `Detalhes: Você foi convidado para colaborar no projeto "${notif.details?.projectId || 'Projeto Desconhecido'}". ` +
                                                    (notif.details?.team ? `(Equipe: ${notif.details.team})` : '')
                                                }
                                                {!['convite', 'aprovado-avaliador', 'rejeitado-avaliador'].includes(notif.type) && `Mais informações sobre esta notificação do tipo '${notif.type}'.`}
                                            </p>
                                            {notif.type === 'convite' && (
                                                <div className="notification-actions-buttons">
                                                    <button
                                                    className="btn-accept"
                                                        onClick={(e) => handleAcceptInvite(e, notif.id, notif.details)}
                                                    >
                                                        Aceitar
                                                    </button>
                                                    <button
                                                        className="btn-decline"
                                                        onClick={(e) => handleDeclineInvite(e, notif.id, notif.details)}
                                                    >
                                                        Recusar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </li>
                            );
                        })
                    ) : (
                        <p className="no-notifications">Nenhuma notificação por enquanto.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}
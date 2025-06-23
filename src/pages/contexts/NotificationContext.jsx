import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const storedNotifications = localStorage.getItem('notifications');
      const parsedNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
      return parsedNotifications.map(n => ({ ...n, timestamp: new Date(n.timestamp) }));
    } catch (error) {
      console.error("Erro ao carregar notificações do localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error("Erro ao salvar notificações no localStorage:", error);
    }
  }, [notifications]);

  const addNotification = useCallback((message, type = 'info', details = {}) => {
    setNotifications(prevNotifications => {
      const newNotification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        message,
        type,
        read: false,
        timestamp: new Date(),
        details
      };
      return [newNotification, ...prevNotifications];
    });
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notif => notif.id !== id)
    );
  }, []);

  const value = {
    notifications,
    addNotification,
    markAsRead,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Componente para exibir e interagir com as notificações (Sidebar/Popover)
export const NotificationWidget = () => {
    const { notifications, markAsRead, removeNotification, addNotification } = useNotifications();
    const navigate = useNavigate();
    const [showPanel, setShowPanel] = useState(false); // <--- ESTADO CHAVE PARA ABRIR/FECHAR
    const [expandedNotificationId, setExpandedNotificationId] = useState(null);
    const widgetRef = useRef(null); // <--- REFERÊNCIA PARA DETECTAR CLIQUE FORA

    // NOVO: Adiciona notificação de teste inicial se não houver nenhuma
    // Remova isso em produção quando tiver um fluxo real de nots.
    useEffect(() => {
        if (notifications.length === 0) {
            console.log("Adicionando notificações de teste no widget...");
            addNotification('Bem-vindo ao sistema de avaliação!', 'info');
            // Para testar a navegação
            addNotification('Parabéns! Você foi aprovado(a) como avaliador(a) no evento "Feira de Inovação 2025"!', 'aprovado-avaliador', { eventId: 'event-test-001', eventTitle: 'Feira de Inovação 2025', recipientEmail: 'avaliador@example.com' });
        }
    }, [notifications.length, addNotification]);

    // Lógica para fechar o painel de notificações ao clicar fora do widget
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Se o painel está visível E o clique foi fora do widget (ícone + popover)
            if (showPanel && widgetRef.current && !widgetRef.current.contains(event.target)) {
                setShowPanel(false); // <--- FECHA O PAINEL
            }
        };
        // Adiciona o listener quando o painel está aberto
        if (showPanel) {
            document.addEventListener('mousedown', handleClickOutside);
        } else { // Remove o listener quando o painel está fechado ou showPanel é falso
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => { // Função de limpeza para remover o listener ao desmontar ou dependências mudarem
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPanel]); // showPanel é a única dependência relevante aqui

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

    // --- Lógica de Clique na Notificação Individual para Navegar ---
    const handleNotificationClick = (notif) => {
        markAsRead(notif.id); // Marca como lida ao clicar
        toggleExpand(notif.id); // Expande/contrai o item da lista

        // REMOVIDO: o alert de depuração que estava lá. Agora apenas console.log.
        console.log(`Notificação clicada: ${notif.message} (Tipo: ${notif.type})`);

        // Lógica de navegação baseada no tipo ou detalhes
        if (notif.type === 'aprovado-avaliador' && notif.details?.eventId) {
            console.log("Navegando para /avaliar-projetos para evento:", notif.details.eventId);
            navigate('/avaliar-projetos', { state: { eventId: notif.details.eventId } }); // Passa o eventId via state
            setShowPanel(false); // Fecha o painel de notificações após a navegação
        } else if (notif.type === 'convite' && notif.details?.eventId) {
            console.log("Navegando para /solicitar-avaliacao para convite:", notif.details.eventId);
            // Você pode ajustar a rota e os dados do state conforme a necessidade do convite
            navigate('/solicitar-avaliacao', { state: { eventId: notif.details.eventId, prefillEmail: notif.details.recipientEmail } });
            setShowPanel(false);
        }
        // Adicione mais `else if` para outros tipos de notificação que devem navegar
    };

    // Lógica para Aceitar/Recusar convite (botões dentro da notificação expandida)
    const handleAcceptInvite = (e, notifId, details) => {
        e.stopPropagation(); // <--- IMPORTANTE: Previne que o clique no botão feche/abra o item da notificação pai
        addNotification(`Convite aceito para ${details.role === 'avaliador' ? 'avaliar' : 'organizar'}.`, 'info');
        removeNotification(notifId);
        setExpandedNotificationId(null);
        // Lógica adicional, como atualizar o status do convite no EventProjectContext ou navegar
    };

    const handleDeclineInvite = (e, notifId, details) => {
        e.stopPropagation(); // <--- IMPORTANTE: Previne que o clique no botão feche/abra o item da notificação pai
        addNotification(`Convite recusado para ${details.role === 'avaliador' ? 'avaliar' : 'organizar'}.`, 'info');
        removeNotification(notifId);
        setExpandedNotificationId(null);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="notification-widget-container" ref={widgetRef}> {/* <--- ASSOCIA A REF A ESTE DIV PAI */}
            {/* Botão do Ícone de Notificação - O clique aqui ABRE/FECHA o painel */}
            <div className="notification-icon-button" onClick={() => setShowPanel(!showPanel)}>
                <span className="material-icons">📩</span>
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </div>

            {/* Painel de Notificações (Popover) - Renderiza CONDICIONALMENTE SE showPanel FOR TRUE */}
            {showPanel && (
                <div className="notifications-panel-popover">
                    <h3>Notificações ({unreadCount} não lidas)</h3>
                    <ul className="notification-list">
                        {notifications.length > 0 ? (
                            notifications.map(notif => {
                                const isExpanded = expandedNotificationId === notif.id;
                                return (
                                    <li
                                        key={notif.id}
                                        className={`notification-item notification-${notif.type} ${notif.read ? 'read' : ''} ${isExpanded ? 'expanded' : ''}`}
                                        // O clique na LI principal aciona handleNotificationClick
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
                                        {/* Botão de remover, usa e.stopPropagation para não acionar o clique da LI */}
                                        <button
                                            className="remove-notification-btn"
                                            onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                                        >
                                            &times;
                                        </button>
                                        {/* Ícone de expansão, também usa e.stopPropagation para evitar conflito com clique da LI */}
                                        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`} onClick={(e) => e.stopPropagation()}>&#9660;</span> {/* Adicionado onClick e.stopPropagation */}

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
                                                    {/* Fallback para outros tipos de notificação sem detalhes específicos */}
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
            )}
        </div>
    );
};
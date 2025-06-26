import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext'; // Ajuste o caminho se necessário
import './config.css'; // O CSS para esta página

export default function Configuracoes() {
    const navigate = useNavigate();
    const { addNotification } = useNotifications();

    // Estados para simular configurações do usuário
    // Em um sistema real, estes seriam carregados de um backend ou contexto de usuário
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [emailNotificacoes, setEmailNotificacoes] = useState('');
    const [preferenciaTema, setPreferenciaTema] = useState('claro');
    const [receberNewsletters, setReceberNewsletters] = useState(true);

    // Carregar configurações existentes ao montar o componente
    useEffect(() => {
        // Simula o carregamento de dados do usuário
        const storedName = localStorage.getItem('userName') || '';
        const storedEmailNotif = localStorage.getItem('userEmailNotif') || '';
        const storedTheme = localStorage.getItem('userThemePref') || 'claro';
        const storedNewsletters = localStorage.getItem('userNewsletters') === 'true';

        setNomeUsuario(storedName);
        setEmailNotificacoes(storedEmailNotif);
        setPreferenciaTema(storedTheme);
        setReceberNewsletters(storedNewsletters);

        // Exemplo de notificação de boas-vindas à página
        addNotification('Bem-vindo(a) à página de Configurações!', 'info');
    }, [addNotification]);

    const handleSaveChanges = (e) => {
        e.preventDefault();
        // Simular salvamento de dados
        localStorage.setItem('userName', nomeUsuario);
        localStorage.setItem('userEmailNotif', emailNotificacoes);
        localStorage.setItem('userThemePref', preferenciaTema);
        localStorage.setItem('userNewsletters', receberNewsletters);

        addNotification('Configurações salvas com sucesso!', 'info');
        console.log('Configurações salvas:', { nomeUsuario, emailNotificacoes, preferenciaTema, receberNewsletters });
        // Opcional: navegar de volta para o dashboard ou perfil
        // navigate('/dashboard');
    };

    const handleResetSettings = () => {
        if (window.confirm("Tem certeza que deseja redefinir todas as configurações para o padrão?")) {
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmailNotif');
            localStorage.removeItem('userThemePref');
            localStorage.removeItem('userNewsletters');

            setNomeUsuario('');
            setEmailNotificacoes('');
            setPreferenciaTema('claro');
            setReceberNewsletters(true);
            addNotification('Configurações redefinidas para o padrão.', 'alerta');
        }
    };

    return (
        <div className="configuracoes-page-container">
            <div className="configuracoes-header-section">
                <h1 className="configuracoes-title">Configurações da Conta</h1>
                <p className="configuracoes-description">
                    Gerencie as suas informações de perfil e preferências do sistema.
                </p>
            </div>

            <div className="configuracoes-form-section">
                <form onSubmit={handleSaveChanges} className="configuracoes-form">
                    {/* Secção de Informações do Perfil */}
                    <div className="form-section-group">
                        <h3 className="section-group-title">Informações do Perfil</h3>
                        <div className="form-group-config">
                            <label htmlFor="nomeUsuario">Nome Completo:</label>
                            <input
                                type="text"
                                id="nomeUsuario"
                                value={nomeUsuario}
                                onChange={(e) => setNomeUsuario(e.target.value)}
                                placeholder="Seu nome"
                            />
                        </div>
                        {/* O email do usuário é geralmente de leitura, mas pode ser exibido */}
                        <div className="form-group-config">
                            <label>Seu Email:</label>
                            <input
                                type="email"
                                value={localStorage.getItem('userEmail') || ''}
                                disabled
                                className="disabled-input"
                            />
                        </div>
                    </div>

                    {/* Secção de Preferências de Notificação */}
                    <div className="form-section-group">
                        <h3 className="section-group-title">Preferências de Notificação</h3>
                        <div className="form-group-config">
                            <label htmlFor="emailNotificacoes">Email para Notificações:</label>
                            <input
                                type="email"
                                id="emailNotificacoes"
                                value={emailNotificacoes}
                                onChange={(e) => setEmailNotificacoes(e.target.value)}
                                placeholder="email@notificacoes.com"
                            />
                        </div>
                        <div className="form-group-config switch-group">
                            <label htmlFor="receberNewsletters">Receber Newsletters:</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    id="receberNewsletters"
                                    checked={receberNewsletters}
                                    onChange={(e) => setReceberNewsletters(e.target.checked)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>

                    {/* Secção de Preferências de Aparência */}
                    <div className="form-section-group">
                        <h3 className="section-group-title">Preferências de Aparência</h3>
                        <div className="form-group-config">
                            <label htmlFor="preferenciaTema">Tema do Sistema:</label>
                            <select
                                id="preferenciaTema"
                                value={preferenciaTema}
                                onChange={(e) => setPreferenciaTema(e.target.value)}
                            >
                                <option value="claro">Claro</option>
                                <option value="escuro">Escuro (Em breve)</option>
                                <option value="alto-contraste">Alto Contraste (Em breve)</option>
                            </select>
                        </div>
                    </div>

                    <div className="configuracoes-actions">
                        <button type="submit" className="btn-save-settings">
                            Salvar Alterações <span className="icon-save">💾</span>
                        </button>
                        <button type="button" onClick={handleResetSettings} className="btn-reset-settings">
                            Redefinir Padrões <span className="icon-reset">🔄</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
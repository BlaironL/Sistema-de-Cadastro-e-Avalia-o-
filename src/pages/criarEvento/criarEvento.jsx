import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext'; // Para adicionar notificações
import './criarEvento.css'; // Estilos específicos para esta página

export default function CriarEvento() {
    const [nomeEvento, setNomeEvento] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataInicioSubmissao, setDataInicioSubmissao] = useState('');
    const [dataFimSubmissao, setDataFimSubmissao] = useState('');
    const [dataInicioAvaliacao, setDataInicioAvaliacao] = useState('');
    const [dataFimAvaliacao, setDataFimAvaliacao] = useState('');

    const navigate = useNavigate();
    const { addNotification } = useNotifications(); // Hook para adicionar notificações

    const handleSubmit = (e) => {
        e.preventDefault();

        // --- VALIDAÇÃO BÁSICA NO FRONTEND ---
        if (!nomeEvento || !descricao || !dataInicioSubmissao || !dataFimSubmissao || !dataInicioAvaliacao || !dataFimAvaliacao) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            addNotification('Erro: Preencha todos os campos para criar o evento.', 'alerta');
            return;
        }

        // Validação de datas (simples)
        const inicioSub = new Date(dataInicioSubmissao);
        const fimSub = new Date(dataFimSubmissao);
        const inicioAva = new Date(dataInicioAvaliacao);
        const fimAva = new Date(dataFimAvaliacao);

        if (fimSub < inicioSub) {
            alert('A data de fim da submissão não pode ser anterior à data de início da submissão.');
            addNotification('Erro nas datas: Fim da submissão inválida.', 'alerta');
            return;
        }
        if (inicioAva < fimSub) { // Avaliação não pode começar antes do fim da submissão
            alert('A data de início da avaliação não pode ser anterior à data de fim da submissão.');
            addNotification('Erro nas datas: Início da avaliação inválida.', 'alerta');
            return;
        }
        if (fimAva < inicioAva) {
            alert('A data de fim da avaliação não pode ser anterior à data de início da avaliação.');
            addNotification('Erro nas datas: Fim da avaliação inválida.', 'alerta');
            return;
        }

        // --- SIMULAÇÃO DE CRIAÇÃO DE EVENTO (SEM BACKEND) ---
        const novoEvento = {
            id: Date.now(), // Simula um ID único
            nome: nomeEvento,
            descricao: descricao,
            datas: {
                submissao: { inicio: dataInicioSubmissao, fim: dataFimSubmissao },
                avaliacao: { inicio: dataInicioAvaliacao, fim: dataFimAvaliacao }
            }
        };

        console.log('Novo evento criado (simulado):', novoEvento);
        // Em um sistema real, você enviaria `novoEvento` para seu backend aqui (API Call).

        // Adiciona uma notificação de sucesso usando o CONTEXTO
        addNotification(`Evento "${nomeEvento}" criado com sucesso!`, 'info');

        // Redireciona o organizador de volta para o dashboard ou para uma tela de gerenciamento de eventos
        // alert('Evento criado com sucesso! Você será redirecionado para o dashboard.'); // Comentado para evitar alert duplicado com notificação
        navigate('/dashboard');
    };

    return (
        <div className="criar-evento-container">
            <h2>Criar Novo Evento</h2>
            <p>Preencha os detalhes para configurar um novo evento de avaliação.</p>

            <form onSubmit={handleSubmit} className="criar-evento-form">
                <div className="form-group">
                    <label htmlFor="nomeEvento">Nome do Evento:</label>
                    <input
                        type="text"
                        id="nomeEvento"
                        value={nomeEvento}
                        onChange={(e) => setNomeEvento(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="descricao">Descrição do Evento:</label>
                    <textarea
                        id="descricao"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        rows="4"
                        required
                    ></textarea>
                </div>

                <div className="form-group-dates">
                    <h3>Período de Submissão:</h3>
                    <div className="date-inputs">
                        <div className="date-input-group">
                            <label htmlFor="dataInicioSubmissao">Início:</label>
                            <input
                                type="date"
                                id="dataInicioSubmissao"
                                value={dataInicioSubmissao}
                                onChange={(e) => setDataInicioSubmissao(e.target.value)}
                                required
                            />
                        </div>
                        <div className="date-input-group">
                            <label htmlFor="dataFimSubmissao">Fim:</label>
                            <input
                                type="date"
                                id="dataFimSubmissao"
                                value={dataFimSubmissao}
                                onChange={(e) => setDataFimSubmissao(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group-dates">
                    <h3>Período de Avaliação:</h3>
                    <div className="date-inputs">
                        <div className="date-input-group">
                            <label htmlFor="dataInicioAvaliacao">Início:</label>
                            <input
                                type="date"
                                id="dataInicioAvaliacao"
                                value={dataInicioAvaliacao}
                                onChange={(e) => setDataInicioAvaliacao(e.target.value)}
                                required
                            />
                        </div>
                        <div className="date-input-group">
                            <label htmlFor="dataFimAvaliacao">Fim:</label>
                            <input
                                type="date"
                                id="dataFimAvaliacao"
                                value={dataFimAvaliacao}
                                onChange={(e) => setDataFimAvaliacao(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn-confirmar">Criar Evento</button>
            </form>
        </div>
    );
}
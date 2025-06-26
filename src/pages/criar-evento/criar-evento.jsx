import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventsProjects } from '../contexts/EventProjectContext';
import { useNotifications } from '../contexts/NotificationContext';
import './criar-evento.css'; // Estilos específicos da página
import eventImage from '../../components/imagemCriarEvento.png'; // Importe a imagem para o layout

export default function CriarEvento() {
    const [nomeEvento, setNomeEvento] = useState('');
    const [local, setLocal] = useState('');
    const [estado, setEstado] = useState('');
    const [dataInicioSubmissao, setDataInicioSubmissao] = useState('');
    const [dataFimSubmissao, setDataFimSubmissao] = useState('');
    const [dataInicioAvaliacao, setDataInicioAvaliacao] = useState('');
    const [dataFimAvaliacao, setDataFimAvaliacao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [foto, setFoto] = useState(null); // Armazena o objeto File da foto

    const navigate = useNavigate();
    const { addNotification } = useNotifications();
    // CORREÇÃO AQUI: Mudado de 'addEvent' para 'createEvent' na desestruturação
    const { createEvent, events } = useEventsProjects(); // Pegamos 'events' para depuração

    // UseEffect para adicionar eventos de teste se não existirem
    useEffect(() => {
        const testEventIds = ['test-event-001', 'test-event-002', 'test-event-003'];
        const existingTestEvents = new Set((events || []).map(e => e.id));

        const needsToAddTestEvents = testEventIds.some(id => !existingTestEvents.has(id));

        if (needsToAddTestEvents) {
            console.log("CriarEvento: Adicionando eventos de teste...");
            if (!existingTestEvents.has('test-event-001')) {
                createEvent({ id: 'test-event-001', titulo: "Feira de Inovação 2025", local: "Centro de Convenções", data: "2025-08-20", descricao: "A maior feira de inovação do ano!", codigo: "FIRA25" });
            }
            if (!existingTestEvents.has('test-event-002')) {
                createEvent({ id: 'test-event-002', titulo: "Hackathon de Sustentabilidade", local: "Campus Tech", data: "2025-09-10", descricao: "Desenvolva soluções para um futuro mais verde.", codigo: "HACKSUST" });
            }
            if (!existingTestEvents.has('test-event-003')) {
                createEvent({ id: 'test-event-003', titulo: "Semana Acadêmica Online", local: "Online", data: "2025-10-05", descricao: "Palestras e workshops com especialistas de diversas áreas.", codigo: "SEMAON" });
            }
        }
    }, [events, createEvent]);


    const handleSubmit = async (e) => { // Tornar handleSubmit assíncrono para lidar com leitura de arquivo
        e.preventDefault();

        // Validação básica de todos os campos obrigatórios
        if (!nomeEvento || !local || !estado || !dataInicioSubmissao || !dataFimSubmissao || !dataInicioAvaliacao || !dataFimAvaliacao || !descricao) {
            // alert('Por favor, preencha todos os campos obrigatórios.'); // Substituir alert
            addNotification('Erro: Preencha todos os campos para criar o evento.', 'alerta');
            return;
        }

        // Lógica para ler a foto como base64 (se uma foto foi selecionada)
        let fotoBase64 = null;
        if (foto) {
            try {
                fotoBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(foto); // Lê o arquivo como URL de dados (base64)
                });
            } catch (error) {
                console.error("Erro ao ler a foto:", error);
                addNotification('Erro ao carregar a foto do evento.', 'alerta');
                return;
            }
        }

        // Validação de datas
        const inicioSub = new Date(dataInicioSubmissao);
        const fimSub = new Date(dataFimSubmissao);
        const inicioAva = new Date(dataInicioAvaliacao);
        const fimAva = new Date(dataFimAvaliacao);

        if (fimSub < inicioSub) {
            // alert('A data de fim da submissão não pode ser anterior à data de início da submissão.'); // Substituir alert
            addNotification('Erro nas datas: Fim da submissão inválida.', 'alerta');
            return;
        }
        if (inicioAva < fimSub) {
            // alert('A data de início da avaliação não pode ser anterior à data de fim da submissão.'); // Substituir alert
            addNotification('Erro nas datas: Início da avaliação inválida.', 'alerta');
            return;
        }
        if (fimAva < inicioAva) {
            // alert('A data de fim da avaliação não pode ser anterior à data de início da avaliação.'); // Substituir alert
            addNotification('Erro nas datas: Fim da avaliação inválida.', 'alerta');
            return;
        }

        // Adiciona o evento usando o contexto EventProjectContext
        // CORREÇÃO AQUI: Chamando 'createEvent' (função correta)
        const newEvent = createEvent({
            titulo: nomeEvento, // Propriedade 'titulo' do objeto evento
            local: local,
            estado: estado,
            descricao: descricao,
            foto: fotoBase64, // Foto em base64
            datas: {
                submissao: { inicio: dataInicioSubmissao, fim: dataFimSubmissao },
                avaliacao: { inicio: dataInicioAvaliacao, fim: dataFimAvaliacao }
            },
            // O código será gerado automaticamente pelo EventProjectProvider
            // ou você pode definir um campo de código aqui se quiser que o usuário digite.
        });

        console.log('Novo evento criado (usando contexto):', newEvent);

        // Dispara notificações (usando NotificationContext)
        addNotification(`Evento "${nomeEvento}" criado com sucesso! Código: ${newEvent?.codigo || 'N/A'}`, 'info');
        addNotification(`Novo evento disponível: "${nomeEvento}"! Submissões abrem em breve.`, 'evento');

        // alert(`Evento criado com sucesso! Código do Evento: ${newEvent?.codigo || 'N/A'}. Você será redirecionado para gerenciar seus eventos.`); // Substituir alert
        navigate('/gerenciar-eventos'); // Redireciona para a página de gerenciamento
    };

    return (
        <div className="criar-evento-container">
            {/* Container da imagem à esquerda */}
            <div className="criar-evento-image-container">
                <img
                    src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Imagem ilustrativa de projeto ou inovação"
                    className="criar-evento-image"
                />
                <div className="image-overlay">
                    <h2>Criar Seu Evento</h2>
                    <p>Configure e organize eventos acadêmicos com facilidade.</p>
                </div>
            </div>

            {/* Container do formulário à direita */}
            <div className="criar-evento-form-container">
                <h2>Detalhes do Novo Evento</h2>
                <p className="form-description">Preencha os detalhes para configurar um novo evento de avaliação.</p>
                <form onSubmit={handleSubmit} className="criar-evento-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="nomeEvento">Nome do Evento:</label>
                            <input
                                type="text"
                                id="nomeEvento"
                                value={nomeEvento}
                                onChange={(e) => setNomeEvento(e.target.value)}
                                placeholder="Ex: Feira de Inovação Anual"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="local">Local do Evento:</label>
                            <input
                                type="text"
                                id="local"
                                value={local}
                                onChange={(e) => setLocal(e.target.value)}
                                placeholder="Ex: Centro de Convenções XYZ"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="estado">Estado (UF):</label>
                            <input
                                type="text"
                                id="estado"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                maxLength="2" // Limita a 2 caracteres para UF
                                placeholder="Ex: SP, RJ, MG"
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="descricao">Descrição do Evento:</label>
                            <textarea
                                id="descricao"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                rows="4"
                                placeholder="Descreva o propósito, público-alvo e temas do evento."
                                required
                            ></textarea>
                        </div>

                        <div className="form-group full-width file-upload-group">
                            <label htmlFor="fotoEvento">Foto do Evento (Opcional):</label>
                            <div className="file-input-wrapper">
                                <input
                                    type="file"
                                    id="fotoEvento"
                                    accept="image/*" // Aceita apenas arquivos de imagem
                                    onChange={(e) => setFoto(e.target.files[0])} // Armazena o objeto File
                                />
                                <span className="file-input-label">
                                    {foto ? foto.name : 'Selecione uma imagem para o evento'}
                                </span>
                            </div>
                            {foto && <p className="file-name-display">Arquivo selecionado: {foto.name}</p>}
                        </div>


                        {/* Período de Submissão */}
                        <div className="form-group-dates full-width">
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

                        {/* Período de Avaliação */}
                        <div className="form-group-dates full-width">
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
                    </div>

                    <button type="submit" className="btn-confirmar submit-event-btn">
                        Criar Evento <span className="icon-send-event">➕</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
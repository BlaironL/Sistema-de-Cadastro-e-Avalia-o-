import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// IMPORTAÇÕES DOS CONTEXTOS (usando o caminho que está funcionando agora)
import { useNotifications } from '../contexts/NotificationContext.jsx';
import { useEventsProjects } from '../contexts/EventProjectContext.jsx';
import './criar-evento.css'; // CSS específico da página
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
    const { addEvent } = useEventsProjects();

    const handleSubmit = async (e) => { // Tornar handleSubmit assíncrono para lidar com leitura de arquivo
        e.preventDefault();

        // Validação básica de todos os campos obrigatórios
        if (!nomeEvento || !local || !estado || !dataInicioSubmissao || !dataFimSubmissao || !dataInicioAvaliacao || !dataFimAvaliacao || !descricao) {
            alert('Por favor, preencha todos os campos obrigatórios.');
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
            alert('A data de fim da submissão não pode ser anterior à data de início da submissão.');
            addNotification('Erro nas datas: Fim da submissão inválida.', 'alerta');
            return;
        }
        if (inicioAva < fimSub) {
            alert('A data de início da avaliação não pode ser anterior à data de fim da submissão.');
            addNotification('Erro nas datas: Início da avaliação inválida.', 'alerta');
            return;
        }
        if (fimAva < inicioAva) {
            alert('A data de fim da avaliação não pode ser anterior à data de início da avaliação.');
            addNotification('Erro nas datas: Fim da avaliação inválida.', 'alerta');
            return;
        }

        // Adiciona o evento usando o contexto EventProjectContext
        const newEvent = addEvent({
            nome: nomeEvento,
            local: local,
            estado: estado,
            descricao: descricao,
            foto: fotoBase64, // Foto em base64
            datas: {
                submissao: { inicio: dataInicioSubmissao, fim: dataFimSubmissao },
                avaliacao: { inicio: dataInicioAvaliacao, fim: dataFimAvaliacao }
            }
        });

        console.log('Novo evento criado (usando contexto):', newEvent);

        // Dispara notificações (usando NotificationContext)
        addNotification(`Evento "${nomeEvento}" criado com sucesso! Código: ${newEvent.codigo || 'N/A'}`, 'info');
        addNotification(`Novo evento disponível: "${nomeEvento}"! Submissões abrem em breve.`, 'evento');

        alert(`Evento criado com sucesso! Código do Evento: ${newEvent.codigo || 'N/A'}. Você será redirecionado para gerenciar seus eventos.`);
        navigate('/gerenciar-eventos'); // Redireciona para a página de gerenciamento
    };

    return (
        <div className="criar-evento-container">
            {/* Container da imagem à esquerda */}
            <div className="criar-evento-image-container">
                <img src={eventImage} alt="Imagem do Evento" className="criar-evento-image" />
            </div>

            {/* Container do formulário à direita */}
            <div className="criar-evento-form-container">
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
                        <label htmlFor="local">Local do Evento:</label>
                        <input
                            type="text"
                            id="local"
                            value={local}
                            onChange={(e) => setLocal(e.target.value)}
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

                    <div className="form-group">
                        <label htmlFor="fotoEvento">Foto do Evento (Opcional):</label>
                        <input
                            type="file"
                            id="fotoEvento"
                            accept="image/*" // Aceita apenas arquivos de imagem
                            onChange={(e) => setFoto(e.target.files[0])} // Armazena o objeto File
                        />
                        {foto && <p className="file-name">Arquivo selecionado: {foto.name}</p>}
                    </div>

                    {/* Período de Submissão */}
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

                    {/* Período de Avaliação */}
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
        </div>
    );
}
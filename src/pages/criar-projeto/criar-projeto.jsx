import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Caminho ajustado com base na sua estrutura 'src/contexts/'
import { useEventsProjects } from '../contexts/EventProjectContext.jsx'; 
// Caminho ajustado com base na sua estrutura 'src/contexts/'
import { useNotifications } from '../contexts/NotificationContext.jsx'; 
import './criar-projeto.css'; // Estilos atualizados para um design fantástico

export default function EnviarProjeto() {
    const [titulo, setTitulo] = useState('');
    const [professorCoordenador, setProfessorCoordenador] = useState('');
    const [categoriaApresentacao, setCategoriaApresentacao] = useState('');
    const [resumo, setResumo] = useState('');
    const [temaRelacionado, setTemaRelacionado] = useState('');
    const [materiais, setMateriais] = useState('');
    const [quantidadeAlunos, setQuantidadeAlunos] = useState('');
    const [arquivoPDF, setArquivoPDF] = useState(null);
    const [codigoEvento, setCodigoEvento] = useState('');
    const [eventoSelecionado, setEventoSelecionado] = useState(null);

    const navigate = useNavigate();
    // CORRIGIDO: Importa 'createEvent' e não 'addEvent'
    const { addProjectToEvent, getEventByIdentifier, createEvent, events } = useEventsProjects(); 
    const { addNotification } = useNotifications();

    // Apenas para teste inicial: Adiciona eventos de demonstração se não existirem
    // A flag `hasTestEventsAddedCreateProject` garante que só é executado uma vez para esta página
    useEffect(() => {
        const hasTestEventsAddedCreateProject = localStorage.getItem('hasTestEventsAddedCreateProject');
        if (!hasTestEventsAddedCreateProject || events.length === 0) {
            console.log("EnviarProjeto: Adicionando eventos de teste...");
            // CORRIGIDO: Chama createEvent (já estava correto, mas a importação estava errada)
            createEvent({ id: 'event-test-001', titulo: "Feira de Inovação 2025", local: "Centro de Convenções", data: "2025-08-20", codigo: "INOV2025" });
            createEvent({ id: 'event-test-002', titulo: "Hackathon de Sustentabilidade", local: "Campus Tech", data: "2025-09-10", codigo: "SUSTHACK" });
            createEvent({ id: 'test-event-003', titulo: "Semana Acadêmica", local: "Online", data: "2025-10-05", codigo: "SEMACA" });
            localStorage.setItem('hasTestEventsAddedCreateProject', 'true');
        }
    }, [createEvent, events.length]); // CORRIGIDO: 'createEvent' na dependência

    const handleCodigoEventoChange = (e) => {
        const inputCode = e.target.value;
        setCodigoEvento(inputCode);
        
        setEventoSelecionado(null); // Reseta a seleção a cada digitação
        if (inputCode.length >= 2) { // Começa a buscar com 2 caracteres para ser mais reativo
            const lowerCaseInput = inputCode.toLowerCase();
            const foundEvent = events.find(event => 
                (event?.codigo || '').toLowerCase().includes(lowerCaseInput) || 
                (event?.titulo || '').toLowerCase().includes(lowerCaseInput)
            );
            
            if (foundEvent) {
                setEventoSelecionado(foundEvent);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!titulo || !professorCoordenador || !categoriaApresentacao || !resumo || !quantidadeAlunos || !arquivoPDF || !codigoEvento) {
            addNotification('Por favor, preencha todos os campos obrigatórios.', 'alerta');
            return;
        }
        if (!eventoSelecionado) {
            addNotification('Por favor, vincule o projeto a um evento válido. Use o código/nome e aguarde a seleção.', 'alerta');
            return;
        }
        if (Number(quantidadeAlunos) <= 0) {
            addNotification('A quantidade de alunos deve ser pelo menos 1.', 'alerta');
            return;
        }

        const novoProjetoData = {
            titulo,
            professorCoordenador,
            categoriaApresentacao,
            resumo,
            temaRelacionado,
            materiais,
            quantidadeAlunos: Number(quantidadeAlunos),
            arquivoPDF: arquivoPDF ? arquivoPDF.name : null, 
        };

        try {
            // Simulação de atraso de rede
            // await new Promise(resolve => setTimeout(resolve, 1500)); 
            
            addProjectToEvent(eventoSelecionado.id, novoProjetoData); // Usa o ID do evento para vincular

            addNotification('Projeto enviado com sucesso!', 'info');
            navigate('/dashboard'); 
            
        } catch (error) {
            console.error('Erro ao enviar projeto:', error);
            addNotification(`Erro ao enviar projeto: ${error.message || 'Tente novamente.'}`, 'alerta');
        }
    };

    return (
        <div className="enviar-projeto-container">
            {/* Secção da Imagem Hero com Texto Aprimorado */}
            <div className="projeto-image-section">
                <img
                    src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Imagem ilustrativa de projeto ou inovação"
                    className="projeto-hero-image"
                />
                <div className="image-overlay">
                    <h2 className="overlay-title">Submeta o Seu Projeto</h2>
                    <p className="overlay-description">Transforme as suas ideias em realidade e participe em eventos inovadores. O seu futuro começa aqui!</p>
                </div>
            </div>

            {/* Secção do Formulário com Novo Design */}
            <div className="projeto-form-section">
                <h1 className="form-title">Detalhes do Novo Projeto</h1>
                <form onSubmit={handleSubmit} className="projeto-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="titulo">Título do Projeto:</label>
                            <input
                                type="text"
                                id="titulo"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                placeholder="Ex: Robô de Reciclagem Inteligente"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="professorCoordenador">Professor Coordenador:</label>
                            <input
                                type="text"
                                id="professorCoordenador"
                                value={professorCoordenador}
                                onChange={(e) => setProfessorCoordenador(e.target.value)}
                                placeholder="Nome completo do professor"
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="categoriaApresentacao">Categoria de Apresentação:</label>
                            <select
                                id="categoriaApresentacao"
                                value={categoriaApresentacao}
                                onChange={(e) => setCategoriaApresentacao(e.target.value)}
                                required
                            >
                                <option value="">Selecione uma categoria</option>
                                <option value="salaTematica">Projeto em Sala Temática</option>
                                <option value="foraDeSala">Projeto Fora de Sala</option>
                                <option value="laboratorio">Laboratório</option>
                                <option value="auditorio">Apresentação no Auditório</option>
                                <option value="pesquisaCientifica">Pesquisa Científica</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="resumo">Resumo Breve do Projeto:</label>
                            <textarea
                                id="resumo"
                                value={resumo}
                                onChange={(e) => setResumo(e.target.value)}
                                rows="4"
                                placeholder="Descreva o seu projeto em 3-5 frases."
                                required
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="temaRelacionado">Tema Relacionado:</label>
                            <input
                                type="text"
                                id="temaRelacionado"
                                value={temaRelacionado}
                                onChange={(e) => setTemaRelacionado(e.target.value)}
                                placeholder="Ex: Sustentabilidade, Tecnologia, Educação"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="quantidadeAlunos">Alunos Participantes:</label>
                            <input
                                type="number"
                                id="quantidadeAlunos"
                                value={quantidadeAlunos}
                                onChange={(e) => setQuantidadeAlunos(e.target.value)}
                                min="1"
                                placeholder="Mínimo 1 aluno"
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="materiais">Lista de Materiais Necessários:</label>
                            <textarea
                                id="materiais"
                                value={materiais}
                                onChange={(e) => setMateriais(e.target.value)}
                                rows="3"
                                placeholder="Liste os materiais e recursos que precisará para a apresentação."
                            ></textarea>
                        </div>

                        <div className="form-group full-width file-upload-group">
                            <label htmlFor="arquivoPDF">Enviar PDF do Projeto:</label>
                            <div className="file-input-wrapper">
                                <input
                                    type="file"
                                    id="arquivoPDF"
                                    accept=".pdf"
                                    onChange={(e) => setArquivoPDF(e.target.files[0])}
                                    required
                                />
                                <span className="file-input-label">
                                    {arquivoPDF ? arquivoPDF.name : 'Selecione o ficheiro PDF do seu projeto'}
                                </span>
                            </div>
                            {arquivoPDF && <p className="file-name-display">Ficheiro selecionado: {arquivoPDF.name}</p>}
                        </div>

                        {/* SEÇÃO DE VINCULAÇÃO AO EVENTO */}
                        <div className="form-group event-selection full-width">
                            <label htmlFor="codigoEvento">Vincular ao Evento:</label>
                            <input
                                type="text"
                                id="codigoEvento"
                                value={codigoEvento}
                                onChange={handleCodigoEventoChange}
                                placeholder="Digite o código ou nome do evento"
                                required
                            />
                            {eventoSelecionado && (
                                <p className="evento-selecionado-info success">
                                    Evento selecionado: <strong>{eventoSelecionado.titulo}</strong> (Código: {eventoSelecionado.codigo})
                                </p>
                            )}
                            {!eventoSelecionado && codigoEvento.length > 0 && (
                                <p className="evento-selecionado-info alerta">
                                    Nenhum evento válido encontrado com este termo.
                                </p>
                            )}
                            {(!eventoSelecionado && codigoEvento.length < 2 && codigoEvento.length > 0) && (
                                <p className="evento-selecionado-info info">
                                    Continue a digitar para pesquisar eventos...
                                </p>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">
                        Enviar Projeto <span className="icon-send">✉️</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
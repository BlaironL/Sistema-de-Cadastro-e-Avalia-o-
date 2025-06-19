import React, { useState, useEffect } from 'react'; // Importe useEffect aqui também
import { useNavigate } from 'react-router-dom';
import { useEventsProjects } from '../contexts/EventProjectContext';
import { useNotifications } from '../contexts/NotificationContext';
import './criar-projeto.css';

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
    const { addProjectToEvent, getEventByIdentifier, addEvent, events } = useEventsProjects(); // Certifique-se de pegar 'events' para depuração
    const { addNotification } = useNotifications();

    // Apenas para teste inicial: Adiciona eventos de demonstração se não existirem
    useEffect(() => {
        const hasTestEventsAdded = localStorage.getItem('hasTestEventsAdded');
        if (!hasTestEventsAdded || events.length === 0) { // Verifica se já adicionou ou se não há eventos
            console.log("Adicionando eventos de teste...");
            // Assegure que os IDs sejam consistentes para evitar duplicação ou bugs
            addEvent({ id: 'event-test-001', titulo: "Feira de Inovação 2025", local: "Centro de Convenções", data: "2025-08-20" });
            addEvent({ id: 'event-test-002', titulo: "Hackathon de Sustentabilidade", local: "Campus Tech", data: "2025-09-10" });
            addEvent({ id: 'event-test-003', titulo: "Semana Acadêmica", local: "Online", data: "2025-10-05" });
            localStorage.setItem('hasTestEventsAdded', 'true'); // Marca que os eventos de teste foram adicionados
        }
    }, [addEvent, events.length]); // Dependência em events.length para re-verificar


    const handleCodigoEventoChange = (e) => {
        const inputCode = e.target.value;
        setCodigoEvento(inputCode);
        
        setEventoSelecionado(null); // Reseta a seleção a cada digitação
        if (inputCode.length >= 3) { // Começa a buscar com 3 caracteres para ser mais reativo
            // Procura por ID ou por parte do Título do evento
            const foundEvent = events.find(event => 
                event.codigo.toLowerCase().includes(inputCode.toLowerCase()) || 
                event.titulo.toLowerCase().includes(inputCode.toLowerCase())
            );
            
            if (foundEvent) {
                setEventoSelecionado(foundEvent);
                // addNotification(`Evento encontrado: ${foundEvent.titulo}`, 'info'); // Opcional: feedback visual
            } else {
                // addNotification('Nenhum evento encontrado com este termo.', 'alerta'); // Opcional: feedback visual
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
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            
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
            <div className="projeto-image-section">
                <img 
                    src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Imagem ilustrativa de projeto ou inovação" 
                    className="projeto-hero-image"
                />
                <div className="image-overlay">
                    <h2>Submeta Seu Projeto</h2>
                    <p>Transforme suas ideias em realidade. Seu futuro começa aqui!</p>
                </div>
            </div>
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
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="resumo">Resumo Breve do Projeto:</label>
                            <textarea
                                id="resumo"
                                value={resumo}
                                onChange={(e) => setResumo(e.target.value)}
                                rows="3"
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
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="materiais">Lista de Materiais Necessários:</label>
                            <textarea
                                id="materiais"
                                value={materiais}
                                onChange={(e) => setMateriais(e.target.value)}
                                rows="2"
                                placeholder="Liste os materiais aqui..."
                            ></textarea>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="arquivoPDF">Enviar PDF do Projeto:</label>
                            <input
                                type="file"
                                id="arquivoPDF"
                                accept=".pdf"
                                onChange={(e) => setArquivoPDF(e.target.files[0])}
                                required
                            />
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
                                <p className="evento-selecionado-info">
                                    Evento selecionado: <strong>{eventoSelecionado.titulo}</strong> (Código: {eventoSelecionado.codigo})
                                </p>
                            )}
                            {!eventoSelecionado && codigoEvento.length > 0 && (
                                <p className="evento-selecionado-info alerta">
                                    Nenhum evento válido encontrado com este termo.
                                </p>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">Enviar Projeto</button>
                </form>
            </div>
        </div>
    );
}
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../global.css';
import './dashboard.css';

export default function Dashboard() {
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [usuarioAtual, setUsuarioAtual] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [projetos, setProjetos] = useState([]);
    const [eventosDisponiveis, setEventosDisponiveis] = useState([]);
    const [mostrarFormularioEvento, setMostrarFormularioEvento] = useState(false);
    const [codigosGerados, setCodigosGerados] = useState(null);
    const [projetosPorEvento, setProjetosPorEvento] = useState({});
    const [codigoAvaliador, setCodigoAvaliador] = useState('');
    const [projetosAvaliacao, setProjetosAvaliacao] = useState([]);
    const [infoProjetosVisiveis, setInfoProjetosVisiveis] = useState({});
    const [mostrarProjetosAvaliacao, setMostrarProjetosAvaliacao] = useState(false);
    const [avaliadoresPorEvento, setAvaliadoresPorEvento] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const tipo = localStorage.getItem('tipoUsuario');
        const usuario = localStorage.getItem('usuarioAtual');
        if (!tipo || !usuario) {
            navigate('/');
        } else {
            setTipoUsuario(tipo);
            setUsuarioAtual(usuario);

            const todosProjetos = JSON.parse(localStorage.getItem('projetosPorUsuario')) || {};
            const projetosDoUsuario = todosProjetos[usuario] || [];
            setProjetos(projetosDoUsuario);

            const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
            setEventosDisponiveis(eventos);

            const porEvento = JSON.parse(localStorage.getItem('projetosPorEvento')) || {};
            setProjetosPorEvento(porEvento);

            const avaliadores = JSON.parse(localStorage.getItem('avaliadoresPorEvento')) || {};
            setAvaliadoresPorEvento(avaliadores);
        }
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('tipoUsuario');
        localStorage.removeItem('usuarioAtual');
        navigate('/');
    };

    const handleCadastroProjeto = (e) => {
        e.preventDefault();
        const titulo = e.target.titulo.value;
        const coordenador = e.target.coordenador.value;
        const categoria = e.target.categoria.value;
        const resumo = e.target.resumo.value;
        const tema = e.target.tema.value;
        const materiais = e.target.materiais.value;
        const qtdAlunos = e.target.qtdAlunos.value;
        const imagem = "#";
        const codigoEvento = e.target.codigoEvento.value;

        const eventos = JSON.parse(localStorage.getItem('eventos'));
        if (!Array.isArray(eventos)) {
            alert("Nenhum evento encontrado. Recarregue a página ou cadastre um evento.");
            return;
        }

        const eventoRelacionado = eventos.find(ev => ev.codigoAluno === codigoEvento);
        if (!eventoRelacionado) {
            alert("Código do evento inválido.");
            return;
        }

        const nomeEvento = eventoRelacionado.nome;
        const novoProjeto = {
            titulo, coordenador, categoria, resumo, tema, materiais, qtdAlunos, imagem,
            evento: nomeEvento, autor: usuarioAtual, codigoEvento
        };

        const todosProjetos = JSON.parse(localStorage.getItem('projetosPorUsuario')) || {};
        const projetosAtualizados = [...(todosProjetos[usuarioAtual] || []), novoProjeto];
        todosProjetos[usuarioAtual] = projetosAtualizados;
        localStorage.setItem('projetosPorUsuario', JSON.stringify(todosProjetos));
        setProjetos(projetosAtualizados);

        const projetosPorEvento = JSON.parse(localStorage.getItem('projetosPorEvento')) || {};
        const projetosDoEvento = [...(projetosPorEvento[nomeEvento] || []), novoProjeto];
        projetosPorEvento[nomeEvento] = projetosDoEvento;
        localStorage.setItem('projetosPorEvento', JSON.stringify(projetosPorEvento));
        setProjetosPorEvento(projetosPorEvento);

        alert("Projeto cadastrado com sucesso!");
        setMostrarFormulario(false);
        e.target.reset();
    };

    const handleCadastrarEvento = (e) => {
        e.preventDefault();
        const nome = e.target.nome.value;
        const tema = e.target.tema.value;
        const banner = "#";
        const dataInicio = e.target.dataInicio.value;
        const dataFim = e.target.dataFim.value;
        const local = e.target.local.value;

        const codigoAluno = Math.random().toString(36).substring(2, 8).toUpperCase();
        const codigoAvaliador = Math.random().toString(36).substring(2, 8).toUpperCase();

        const novoEvento = {
            nome, tema, banner, dataInicio, dataFim, local,
            codigoAluno, codigoAvaliador
        };

        const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        eventos.push(novoEvento);
        localStorage.setItem('eventos', JSON.stringify(eventos));

        setCodigosGerados({ codigoAluno, codigoAvaliador });
        e.target.reset();
    };

    const buscarProjetosPorCodigo = () => {
        const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        const evento = eventos.find(e => e.codigoAvaliador === codigoAvaliador);

        if (!evento) {
            alert("Código do evento inválido.");
            return;
        }

        const avaliadores = JSON.parse(localStorage.getItem('avaliadoresPorEvento')) || {};
        const listaAtual = new Set(avaliadores[evento.nome] || []);
        listaAtual.add(usuarioAtual);
        avaliadores[evento.nome] = Array.from(listaAtual);
        localStorage.setItem('avaliadoresPorEvento', JSON.stringify(avaliadores));
        setAvaliadoresPorEvento(avaliadores);

        const todosProjetos = JSON.parse(localStorage.getItem('projetosPorUsuario')) || {};
        const encontrados = [];
        Object.values(todosProjetos).forEach(lista => {
            lista.forEach(proj => {
                if (proj.evento === evento.nome) {
                    encontrados.push(proj);
                }
            });
        });

        setProjetosAvaliacao(encontrados);
        setMostrarProjetosAvaliacao(true);
    };

    const toggleInfoProjeto = (idx) => {
        setInfoProjetosVisiveis(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const renderConteudo = () => {
        if (tipoUsuario === 'organizador') {
            return (
                <div className="painel-organizador">
                    <h2>Bem-vindo(a), Organizador(a)!</h2>
                    <button onClick={() => setMostrarFormularioEvento(!mostrarFormularioEvento)}>
                        {mostrarFormularioEvento ? 'Cancelar' : 'Cadastrar Novo Evento'}
                    </button>
                    {mostrarFormularioEvento && (
                        <form onSubmit={handleCadastrarEvento}>
                            <input name="nome" placeholder="Nome do Evento" required />
                            <input name="tema" placeholder="Tema" required />
                            <input name="dataInicio" type="date" required />
                            <input name="dataFim" type="date" required />
                            <input name="local" placeholder="Local" required />
                            <button type="submit">Cadastrar</button>
                        </form>
                    )}
                    {codigosGerados && (
                        <div>
                            <p><strong>Código para Alunos:</strong> <code>{codigosGerados.codigoAluno}</code></p>
                            <p><strong>Código para Avaliadores:</strong> <code>{codigosGerados.codigoAvaliador}</code></p>
                        </div>
                    )}
                    <h3>Projetos por Evento</h3>
                    {Object.entries(projetosPorEvento).map(([evento, lista]) => (
                        <div key={evento} className="evento">
                            <h4>{evento}</h4>
                            <ul>
                                {lista.map((proj, index) => (
                                    <li key={index}>
                                        <strong>{proj.titulo}</strong> - {proj.autor}
                                        <button onClick={() => toggleInfoProjeto(`${evento}-${index}`)}>
                                            Ver Mais
                                        </button>
                                        {infoProjetosVisiveis[`${evento}-${index}`] && (
                                            <div className="detalhes-projeto">
                                                <p><strong>Resumo:</strong> {proj.resumo}</p>
                                                <p><strong>Tema:</strong> {proj.tema}</p>
                                                <p><strong>Categoria:</strong> {proj.categoria}</p>
                                                <p><strong>Coordenador:</strong> {proj.coordenador}</p>
                                                <p><strong>Materiais:</strong> {proj.materiais}</p>
                                                <p><strong>Qtd. Alunos:</strong> {proj.qtdAlunos}</p>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <h5>Avaliadores Vinculados:</h5>
                            <ul>
                                {(avaliadoresPorEvento[evento] || []).map((aval, idx) => (
                                    <li key={idx}>{aval}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <button onClick={logout}>Sair</button>
                </div>
            );
        }

        if (tipoUsuario === 'aluno') {
            return (
                <div className="painel-aluno">
                    <h2>Bem-vindo(a), {usuarioAtual}!</h2>
                    <button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
                        {mostrarFormulario ? 'Cancelar' : 'Cadastrar Projeto'}
                    </button>
                    {mostrarFormulario && (
                        <form onSubmit={handleCadastroProjeto}>
                            <input name="titulo" placeholder="Título do Projeto" required />
                            <input name="coordenador" placeholder="Coordenador" required />
                            <select name="categoria" required>
                                <option value="">Categoria de Apresentação</option>
                                <option>Projeto em Sala Temática</option>
                                <option>Projeto Fora de Sala</option>
                                <option>Projeto em Laboratório</option>
                                <option>Apresentação no Auditório</option>
                            </select>
                            <textarea name="resumo" placeholder="Resumo Breve" required></textarea>
                            <input name="tema" placeholder="Tema Relacionado" required />
                            <input name="materiais" placeholder="Materiais do Campus" required />
                            <input name="qtdAlunos" type="number" placeholder="Qtd. Alunos" required />
                            <input name="codigoEvento" placeholder="Código do Evento" required />
                            <button type="submit">Salvar Projeto</button>
                        </form>
                    )}
                    <h3>Meus Projetos</h3>
                    <ul>
                        {projetos.map((proj, index) => (
                            <li key={index}>{proj.titulo} - {proj.evento}</li>
                        ))}
                    </ul>
                    <button onClick={logout}>Sair</button>
                </div>
            );
        }

        if (tipoUsuario === 'avaliador') {
            return (
                <div className="painel-avaliador">
                    <h2>Bem-vindo(a), Avaliador(a)!</h2>
                    <input
                        type="text"
                        placeholder="Digite o código do evento"
                        value={codigoAvaliador}
                        onChange={(e) => setCodigoAvaliador(e.target.value)}
                    />
                    <button onClick={buscarProjetosPorCodigo}>Entrar no Evento</button>
                    {mostrarProjetosAvaliacao && (
                        <div>
                            <button onClick={() => setMostrarProjetosAvaliacao(false)}>
                                Mostrar Menos
                            </button>
                            <ul>
                                {projetosAvaliacao.map((projeto, index) => (
                                    <li key={index}>
                                        <h4>{projeto.titulo}</h4>
                                        <button onClick={() => toggleInfoProjeto(index)}>
                                            {infoProjetosVisiveis[index] ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                                        </button>
                                        {infoProjetosVisiveis[index] && (
                                            <div className="detalhes-projeto">
                                                <p><strong>Resumo:</strong> {projeto.resumo}</p>
                                                <p><strong>Tema:</strong> {projeto.tema}</p>
                                                <p><strong>Categoria:</strong> {projeto.categoria}</p>
                                                <p><strong>Coordenador:</strong> {projeto.coordenador}</p>
                                                <p><strong>Materiais:</strong> {projeto.materiais}</p>
                                                <p><strong>Qtd. Alunos:</strong> {projeto.qtdAlunos}</p>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <button onClick={logout}>Sair</button>
                </div>
            );
        }

        return null;
    };

    return (
        <main>
            {renderConteudo()}
        </main>
    );
}

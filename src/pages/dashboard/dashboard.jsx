import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../global.css';
import './dashboard.css';

export default function Dashboard() {
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [usuarioAtual, setUsuarioAtual] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [projetos, setProjetos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const tipo = localStorage.getItem('tipoUsuario');
        const usuario = localStorage.getItem('usuarioAtual'); // <- aqui
        if (!tipo || !usuario) {
            navigate('/');
        } else {
            setTipoUsuario(tipo);
            setUsuarioAtual(usuario);

            const todosProjetos = JSON.parse(localStorage.getItem('projetosPorUsuario')) || {};
            const projetosDoUsuario = todosProjetos[usuario] || [];
            setProjetos(projetosDoUsuario);
        }
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('tipoUsuario');
        localStorage.removeItem('usuarioAtual');
        navigate('/');
    };

    const handleCadastroProjeto = (e) => {
        e.preventDefault();

        const nome = e.target.nomeProjeto.value;
        const descricao = e.target.descricao.value;
        const evento = e.target.evento.value;
        const pdf = "#"; // Simulado

        const novoProjeto = { nome, descricao, evento, pdf };

        const todosProjetos = JSON.parse(localStorage.getItem('projetosPorUsuario')) || {};
        const projetosAtualizados = [...(todosProjetos[usuarioAtual] || []), novoProjeto];
        todosProjetos[usuarioAtual] = projetosAtualizados;

        localStorage.setItem('projetosPorUsuario', JSON.stringify(todosProjetos));
        setProjetos(projetosAtualizados);

        alert("Projeto cadastrado com sucesso!");
        setMostrarFormulario(false);
        e.target.reset();
    };

    const renderConteudo = () => {
        if (tipoUsuario === 'aluno') {
            return (
                <section className="aluno-container">
                    <h2>Meus Projetos:</h2>

                    {projetos.length > 0 ? (
                        <div className="projetos-lista">
                            {projetos.map((proj, index) => (
                                <div className="projeto-card" key={index}>
                                    <h3>{proj.nome}</h3>
                                    <p>{proj.descricao}</p>
                                    <p><strong>Evento:</strong> {proj.evento}</p>
                                    <a href={proj.pdf} target="_blank" rel="noreferrer">Ver PDF</a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="sem-projetos">
                            <p>Você ainda não participou de nenhum projeto.</p>
                            <p>Participe de eventos acadêmicos e compartilhe suas ideias!</p>
                        </div>
                    )}

                    <div className="nova-acao">
                        <button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
                            {mostrarFormulario ? 'Cancelar' : 'Cadastrar Novo Projeto'}
                        </button>
                    </div>

                    {mostrarFormulario && (
                        <section className="form-container">
                            <h3>Cadastro de Novo Projeto</h3>
                            <form onSubmit={handleCadastroProjeto}>
                                <label htmlFor="nomeProjeto">Nome do Projeto:</label>
                                <input type="text" id="nomeProjeto" name="nomeProjeto" required />

                                <label htmlFor="descricao">Descrição:</label>
                                <textarea id="descricao" name="descricao" rows="4" required></textarea>

                                <label htmlFor="evento">Evento:</label>
                                <select id="evento" name="evento" required>
                                    <option value="">Selecione o evento</option>
                                    <option value="Semana Nacional de Ciência e Tecnologia">Semana Nacional de Ciência e Tecnologia</option>
                                    <option value="Inova IFPI">Inova IFPI</option>
                                    <option value="Cais Tech">Cais Tech</option>
                                </select>

                                <label htmlFor="arquivo">Enviar Arquivo (PDF):</label>
                                <input type="file" id="arquivo" name="arquivo" accept=".pdf" />

                                <button type="submit">Cadastrar Projeto</button>
                            </form>
                        </section>
                    )}
                </section>
            );
        } else if (tipoUsuario === 'organizador') {
            return (
                <>
                    <h2>Painel do Organizador</h2>
                    <p>Gerencie projetos e acompanhe inscrições.</p>
                </>
            );
        } else if (tipoUsuario === 'avaliador') {
            return (
                <>
                    <h2>Painel do Avaliador</h2>
                    <p>Consulte e avalie os projetos atribuídos a você.</p>
                </>
            );
        } else {
            return null;
        }
    };

    return (
        <main>
            {renderConteudo()}
        </main>
    );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../global.css';
import './dashboard.css'

export default function Dashboard() {
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [projetos, setProjetos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const tipo = localStorage.getItem('tipoUsuario');
        if (!tipo) {
            navigate('/'); // redireciona para login se não estiver logado
        } else {
            setTipoUsuario(tipo);
        }

        // Simulando projetos (pode ser substituído por fetch/axios)
        const projetosMock = [
            {
                nome: "Sistema de Irrigação Automatizada",
                descricao: "Um projeto para automatizar irrigação de hortas urbanas.",
                evento: "Inova IFPI",
                pdf: "#"
            },
            {
                nome: "Aplicativo Educacional",
                descricao: "App voltado ao ensino de matemática básica para crianças.",
                evento: "Semana Nacional de Ciência e Tecnologia",
                pdf: "#"
            },
            {
                nome: "Arduino Movel",
                descricao: "Hardware voltado para o auxilio de pessoas carentes.",
                evento: "Semana Nacional de Ciência e Tecnologia",
                pdf: "#"
            },
            {
                nome: "Comduza",
                descricao: "Software para realização de avaliações online.",
                evento: "Cais Tech",
                pdf: "#"
            }
        ];
        setProjetos(projetosMock); // Comente essa linha se for buscar de backend
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('tipoUsuario');
        navigate('/');
    };

    const handleCadastroProjeto = (e) => {
        e.preventDefault();
        // Lógica para cadastrar projeto pode ser implementada aqui
        alert("Projeto cadastrado!");
        setMostrarFormulario(false);
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

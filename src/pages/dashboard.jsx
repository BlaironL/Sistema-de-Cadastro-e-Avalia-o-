import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css.css";

export default function Dashboard() {
    const [tipoUsuario, setTipoUsuario] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const tipo = localStorage.getItem('tipoUsuario');
        if (!tipo) {
            navigate('/'); // redireciona para login se não estiver logado
        } else {
            setTipoUsuario(tipo);
        }
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('tipoUsuario');
        navigate('/');
    };

    const renderConteudo = () => {
        if (tipoUsuario === 'aluno') {
            return (
                <section className="form-container">
                    <h2>Cadastro de Novo Projeto</h2>
                    <form>
                        <label htmlFor="nomeProjeto">Nome do Projeto:</label>
                        <input type="text" id="nomeProjeto" name="nomeProjeto" required />

                        <label htmlFor="descricao">Descrição:</label>
                        <textarea id="descricao" name="descricao" rows="4" required></textarea>

                        <label htmlFor="evento">Evento:</label>
                        <select id="evento" name="evento" required>
                            <option value="">Selecione o evento</option>
                            <option value="evento1">Semana Nacional de Ciência e Tecnologia</option>
                            <option value="evento2">Inova IFPI</option>
                            <option value="evento3">Cais Tech</option>
                        </select>

                        <label htmlFor="arquivo">Enviar Arquivo (PDF):</label>
                        <input type="file" id="arquivo" name="arquivo" accept=".pdf" />

                        <button type="submit">Cadastrar Projeto</button>
                    </form>
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
        <>

            <main>
                {renderConteudo()}
            </main>

        </>
    );
}

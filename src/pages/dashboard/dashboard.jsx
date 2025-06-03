import React, { useState, useEffect } from 'react';
import './dashboard.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [tipoUsuario, setTipoUsuario] = useState('');
    // const [usuarioAtual, setUsuarioAtual] = useState(''); // Não mais necessário para o H2
    const [projetos, setProjetos] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const navigate = useNavigate();

    const [termoBusca, setTermoBusca] = useState('');

    useEffect(() => {
        const tipo = localStorage.getItem('tipoUsuario');
        // const usuario = localStorage.getItem('usuario'); // Buscava o nome
        setTipoUsuario(tipo);
        // setUsuarioAtual(usuario || ''); // Não precisamos mais setar para o H2

        const dadosSalvos = localStorage.getItem('projetos');
        if (dadosSalvos) {
            setProjetos(JSON.parse(dadosSalvos));
        }
    }, []);

    const handleCadastroProjeto = (e) => {
        e.preventDefault();
        const novoProjeto = {
            titulo: e.target.titulo.value,
            coordenador: e.target.coordenador.value,
            categoria: e.target.categoria.value,
            resumo: e.target.resumo.value,
            tema: e.target.tema.value,
            materiais: e.target.materiais.value,
            qtdAlunos: e.target.qtdAlunos.value,
            evento: e.target.codigoEvento.value
        };
        const listaAtualizada = [...projetos, novoProjeto];
        setProjetos(listaAtualizada);
        localStorage.setItem('projetos', JSON.stringify(listaAtualizada));
        setMostrarFormulario(false);
    };

    const logout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleBuscaChange = (e) => {
        setTermoBusca(e.target.value);
    };

    const renderConteudoAluno = () => {
        const projetosFiltrados = projetos.filter(proj =>
            proj.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
            (proj.categoria && proj.categoria.toLowerCase().includes(termoBusca.toLowerCase())) ||
            (proj.coordenador && proj.coordenador.toLowerCase().includes(termoBusca.toLowerCase())) ||
            (proj.tema && proj.tema.toLowerCase().includes(termoBusca.toLowerCase())) ||
            (proj.evento && proj.evento.toLowerCase().includes(termoBusca.toLowerCase()))
        );

        const mostrarFormularioSemProjetos = projetos.length === 0 && mostrarFormulario;
        const mostrarMensagemSemProjetos = projetos.length === 0 && !mostrarFormulario;

        return (
            <>
                {mostrarMensagemSemProjetos && (
                    <div className="sem-projetos">
                        <div className="imagem-container">
                            <img
                                src="src/components/ImagemCadastroAluno.png"
                                alt="Pessoa no notebook"
                                className="imagem-ilustrativa"
                            />
                        </div>
                        <div className="right-section-content">
                            <div className="mensagem">
                                <p className="texto-grande">Voce ainda nao possui projetos.</p>
                                <p className="texto-normal">
                                    Cadastre agora de maneira <span className="azul">rapida e facil.</span>
                                </p>
                                <button className="btn-cadastrar" onClick={() => setMostrarFormulario(true)}>
                                    Cadastrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {mostrarFormularioSemProjetos && (
                    <div className="sem-projetos">
                        <div className="imagem-container">
                            <img
                                src="src/components/ImagemCadastroAluno.png"
                                alt="Pessoa no notebook"
                                className="imagem-ilustrativa"
                            />
                        </div>
                        <div className="right-section-content">
                            <form className="formulario" onSubmit={handleCadastroProjeto}>
                                <input name="titulo" placeholder="Título" required />
                                <input name="coordenador" placeholder="Coordenador" required />
                                <input name="categoria" placeholder="Categoria" required />
                                <textarea name="resumo" placeholder="Resumo" required />
                                <input name="tema" placeholder="Tema" required />
                                <input name="materiais" placeholder="Materiais" required />
                                <input name="qtdAlunos" type="number" placeholder="Quantidade de Alunos" required />
                                <input name="codigoEvento" placeholder="Código do Evento" required />
                                <button type="submit">Cadastrar Projeto</button>
                            </form>
                        </div>
                    </div>
                )}

                {projetos.length > 0 && (
                    <div className="com-projetos">
                        {/* MODIFICADO AQUI: Texto de boas-vindas genérico */}
                        <h2>Painel de Projetos</h2>
                        <button
                            onClick={() => setMostrarFormulario(!mostrarFormulario)}
                            className="btn-cadastrar-novo-projeto"
                        >
                            {mostrarFormulario ? 'Cancelar Cadastro' : 'Cadastrar Novo Projeto'}
                        </button>

                        <div className="barra-pesquisa-container">
                            <input
                                type="text"
                                placeholder="Pesquisar projetos por título, categoria, etc..."
                                className="input-pesquisa-projetos"
                                value={termoBusca}
                                onChange={handleBuscaChange}
                            />
                        </div>

                        {mostrarFormulario && (
                            <form className="formulario" onSubmit={handleCadastroProjeto}>
                                <input name="titulo" placeholder="Título" required />
                                <input name="coordenador" placeholder="Coordenador" required />
                                <input name="categoria" placeholder="Categoria" required />
                                <textarea name="resumo" placeholder="Resumo" required />
                                <input name="tema" placeholder="Tema" required />
                                <input name="materiais" placeholder="Materiais" required />
                                <input name="qtdAlunos" type="number" placeholder="Quantidade de Alunos" required />
                                <input name="codigoEvento" placeholder="Código do Evento" required />
                                <button type="submit">Cadastrar Projeto</button>
                            </form>
                        )}
                        <h3>Meus Projetos</h3>
                        {projetosFiltrados.length > 0 ? (
                            <div className="projetos-lista">
                                {projetosFiltrados.map((proj, index) => (
                                    <div className="projeto-card" key={index}>
                                        <div className="card-header">
                                            <h4>{proj.titulo}</h4>
                                        </div>
                                        <div className="card-content">
                                            {proj.categoria && (<><p className="card-info-label">Categoria:</p><p className="card-info-value">{proj.categoria}</p></>)}
                                            {proj.coordenador && (<><p className="card-info-label">Coordenador:</p><p className="card-info-value">{proj.coordenador}</p></>)}
                                            {proj.tema && (<><p className="card-info-label">Tema:</p><p className="card-info-value">{proj.tema}</p></>)}
                                            {proj.evento && (<><p className="card-info-label">Cód. Evento:</p><p className="card-info-value">{proj.evento}</p></>)}
                                        </div>
                                        <div className="card-footer"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="nenhum-projeto-encontrado-busca">
                                {termoBusca ? `Nenhum projeto encontrado com o termo "${termoBusca}".` : "Nenhum projeto cadastrado no momento."}
                            </p>
                        )}
                    </div>
                )}
                <button className="btn-sair" onClick={logout}>Sair</button>
            </>
        );
    };

    const renderConteudoGeral = () => {
        // Mantido como antes, mas sem 'usuarioAtual' se não for usado aqui também
        return (
            <div>
                <h2>Usuário do tipo {tipoUsuario}</h2>
                <button className="btn-sair" onClick={logout}>Sair</button>
            </div>
        );
    };

    return (
        <div className="dashboard-container">
            {tipoUsuario === 'aluno' ? renderConteudoAluno() : renderConteudoGeral()}
        </div>
    );
}

export default Dashboard;
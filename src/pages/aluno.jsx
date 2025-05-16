import '../css.css';

export default function CadastroProjeto() {
    return (
        <>

            <nav>
                <ul>
                    <li><a href="/dashboard">Ino</a></li>
                    <li><a href="/cadastro-projeto">Cadastro de Projetos</a></li>
                    <li><a href="/sobre">Sobre</a></li>
                </ul>
            </nav>

            <main>
                <section className="form-container">
                    <h2>Cadastro de Novo Projeto</h2>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor="nomeProjeto">Nome do Projeto:</label>
                        <input type="text" id="nomeProjeto" name="nomeProjeto" required />

                        <label htmlFor="descricao">Descrição:</label>
                        <textarea id="descricao" name="descricao" rows="4" required></textarea>

                        <label htmlFor="evento">Evento:</label>
                        <select id="evento" name="evento" required>
                            <option value="">Selecione o evento</option>
                            <option value="evento1">Semana Acadêmica</option>
                            <option value="evento2">Feira de Ciência</option>
                            <option value="evento3">Mostra de Inovação</option>
                        </select>

                        <label htmlFor="arquivo">Enviar Arquivo (PDF):</label>
                        <input type="file" id="arquivo" name="arquivo" accept=".pdf" />

                        <button type="submit">Cadastrar Projeto</button>
                    </form>
                </section>
            </main>

        </>
    );
}

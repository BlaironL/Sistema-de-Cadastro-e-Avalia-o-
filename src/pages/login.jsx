import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [tipo, setTipo] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!tipo) {
            alert('Selecione um tipo de usuário.');
            return;
        }

        localStorage.setItem('tipoUsuario', tipo);
        navigate('/dashboard');  // navegação sem recarregar a página
    };

    return (
        <div>
            <main>
                <div className="login-wrapper">
                    <div className="login-container">
                        <h2>Login de Usuário</h2>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">E-mail ou Usuário:</label>
                            <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <label htmlFor="senha">Senha:</label>
                            <input
                                type="password"
                                id="senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />

                            <label htmlFor="tipo">Tipo de Usuário:</label>
                            <select
                                id="tipo"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                required
                            >
                                <option value="">Selecione</option>
                                <option value="avaliador">Avaliador</option>
                                <option value="organizador">Organizador</option>
                                <option value="aluno">Aluno</option>
                            </select>

                            <button type="submit">Entrar</button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );

}

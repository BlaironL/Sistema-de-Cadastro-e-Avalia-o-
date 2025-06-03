import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../global.css';
import './login.css';
import ilustracao from '../../components/ImagemLogin.png'; // Use a imagem correta

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
        localStorage.setItem('usuarioAtual', email.toLowerCase());

        navigate('/dashboard');
    };

    return (
        <div className="login-page">

            <main className="login-main">
                <div className="login-left">
                    <p className="login-msg">
                        Realize seu login<br />
                        com suas credenciais do SUAP.<br />:)
                    </p>
                    <img src={ilustracao} alt="Ilustração login" className="login-img" />
                </div>

                <div className="login-right">
                    <h2 className="bem-vindo">Seja Bem–Vindo!</h2>
                    <form onSubmit={handleSubmit} className="login-form">
                        <label htmlFor="email">E-mail:</label>
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


                        <button type="submit" className="btn-confirmar">
                            Confirmar
                        </button>
                    </form>
                </div>
            </main>

        </div>
    );
}

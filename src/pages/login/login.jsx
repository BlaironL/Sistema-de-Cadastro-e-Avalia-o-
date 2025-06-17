import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../global.css'; 
import './login.css';
import ilustracao from '../../components/ImagemLogin.png'; 

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.includes('@')) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        // >>> MUDANÇA CRÍTICA AQUI: FORÇA O PERFIL PARA 'ORGANIZADOR' PARA TESTE <<<
        // Em um sistema real, este perfil viria do backend após a autenticação.
        const userProfile = 'organizador'; // Agora SEMPRE será organizador para teste

        localStorage.setItem('userProfile', userProfile);
        localStorage.setItem('userEmail', email.toLowerCase());

        if (onLoginSuccess) {
            onLoginSuccess(email.toLowerCase(), userProfile);
        }

        navigate('/dashboard');
    };

    return (
        <div className="login-page">
            <main className="login-main">
                <div className="login-left">
                    <p className="login-msg">
                        Realize Seu Login<br />
                        De Maneira Rápida e Fácil.<br />:)
                    </p>
                    <img src={ilustracao} alt="Ilustração login" className="login-img" />
                </div>

                <div className="login-right">
                    <h2 className="bem-vindo">Seja Bem–Vindo!</h2>
                    <form onSubmit={handleSubmit} className="login-form">
                        <label htmlFor="email">E-mail:</label>
                        <input
                            type="email" 
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

                        <button type="submit" className="btn-confirmar">
                            Entrar
                        </button>
                    </form>
                    <p className="register-link">Ainda não tem conta? <a href="/cadastro">Cadastre-se aqui</a></p>
                </div>
            </main>
        </div>
    );
}
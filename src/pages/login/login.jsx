import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate
import '../../global.css'; 
import './login.css';

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.includes('@')) {
            console.warn('Por favor, insira um e-mail válido.');
            return;
        }

        const userProfile = 'organizador'; 
        localStorage.setItem('userProfile', userProfile);
        localStorage.setItem('userEmail', email.toLowerCase());

        if (onLoginSuccess) {
            onLoginSuccess(email.toLowerCase(), userProfile);
        }

        navigate('/dashboard'); // Usa navigate para o dashboard
    };

    const handleRegisterClick = () => { // Nova função para o link de cadastro
        navigate('/cadastro'); // Usa navigate para o cadastro
    };

    return (
        <div className="login-page">
            <main className="login-main">
                <div className="login-left">
                    <p className="login-msg welcome-text">
                        Bem-vindo ao SCAP.
                    </p>
                    <p className="login-msg motto-text">
                        Realize seu Login<br />
                        De Maneira Rápida e Fácil.<br />
                        ✨
                    </p>
                </div>

                <div className="login-right">
                    <h2 className="bem-vindo form-title-login">Seja Bem–Vindo!</h2>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group-login">
                            <label htmlFor="email">E-mail:</label>
                            <input
                                type="email" 
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="seu.email@exemplo.com"
                            />
                        </div>

                        <div className="form-group-login">
                            <label htmlFor="senha">Senha:</label>
                            <input
                                type="password"
                                id="senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                                placeholder="sua senha secreta"
                            />
                        </div>

                        <button type="submit" className="btn-confirmar login-submit-btn">
                            Entrar <span className="icon-arrow-right">→</span>
                        </button>
                    </form>
                    {/* ATUALIZADO: Usando onClick com navigate para o link de cadastro */}
                    <p className="register-link">Ainda não tem conta? <a onClick={handleRegisterClick}>Cadastre-se aqui</a></p>
                </div>
            </main>
        </div>
    );
}
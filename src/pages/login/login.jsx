import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../global.css'; 
import './login.css';
// REMOVIDO: import ilustracao from '../../components/ImagemLogin.png'; // Esta imagem será substituída por um design CSS

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.includes('@')) {
            // alert('Por favor, insira um e-mail válido.'); // Substituir alert por uma notificação mais amigável
            console.warn('Por favor, insira um e-mail válido.'); // Apenas para depuração, se não tiver sistema de notificação UI
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
                {/* Lado Esquerdo - Mensagem e Design Visual */}
                <div className="login-left">
                    <p className="login-msg welcome-text">
                        Bem-vindo ao SCAP.
                    </p>
                    <p className="login-msg motto-text">
                        Realize seu Login<br />
                        De Maneira Rápida e Fácil.<br />
                        ✨
                    </p>
                    {/* A imagem ilustrativa foi removida do JSX e será tratada via CSS para um design mais integrado */}
                </div>

                {/* Lado Direito - Formulário de Login */}
                <div className="login-right">
                    <h2 className="bem-vindo form-title-login">Seja Bem–Vindo!</h2>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group-login"> {/* Novo wrapper para label+input */}
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

                        <div className="form-group-login"> {/* Novo wrapper para label+input */}
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
                    <p className="register-link">Ainda não tem conta? <a href="/cadastro">Cadastre-se aqui</a></p>
                </div>
            </main>
        </div>
    );
}
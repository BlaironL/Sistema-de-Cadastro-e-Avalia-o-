import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cadastro.css'; // Estilos específicos do Cadastro

export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('aluno'); // Padrão: aluno

    const navigate = useNavigate();

    const handleCadastro = (e) => {
        e.preventDefault();

        // Validação básica
        if (!nome || !email || !senha || !confirmarSenha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }
        if (senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        // Validação de e-mail simples (você pode usar regex mais complexa)
        if (!email.includes('@') || !email.includes('.')) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        // Simulação de cadastro
        const novoUsuario = {
            nome,
            email,
            perfil: tipoUsuario,
            // Em uma aplicação real, a senha seria hashada no backend
            // Aqui, por simplicidade, não armazenamos ou hashamos a senha
        };

        console.log('Novo usuário cadastrado (simulado):', novoUsuario);
        alert(`Cadastro realizado com sucesso para ${nome}! Você será redirecionado para o login.`);
        navigate('/login'); // Redireciona para a página de login
    };

    return (
        <div className="cadastro-container">
            <div className="cadastro-form-wrapper">
                <h2>Cadastre-se no SCAP</h2>
                <p>Crie sua conta para começar a gerenciar ou participar de eventos.</p>

                <form onSubmit={handleCadastro} className="cadastro-form">
                    <div className="form-group">
                        <label htmlFor="nome">Nome Completo:</label>
                        <input
                            type="text"
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">E-mail:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="senha">Senha:</label>
                        <input
                            type="password"
                            id="senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmarSenha">Confirmar Senha:</label>
                        <input
                            type="password"
                            id="confirmarSenha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-cadastro">Cadastrar</button>
                </form>

                <p className="login-link-text">
                    Já tem uma conta? <span onClick={() => navigate('/login')} className="link-span">Faça login aqui</span>.
                </p>
            </div>
        </div>
    );
}
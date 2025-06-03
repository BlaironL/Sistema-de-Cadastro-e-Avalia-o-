import { Outlet, Link } from 'react-router-dom';
import '../../global.css';

export default function Layout() {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1 className="logo-text">SCAP</h1>
                <p className="subtitulo">Sistema de Cadastro e avaliacao de Projetos.</p>
                <link href="https://fonts.googleapis.com/css2?family=Jersey+25&display=swap" rel="stylesheet" />
            </header>

            <main>
                <Outlet />
            </main>

            <footer className="home-footer">
                <p><strong>SCAP</strong> – Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

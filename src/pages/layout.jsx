import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="layout">
            <header>
                <div className="header-content">
                    <div className="logo-box">
                        <h1 className="logo">SCAP</h1>
                        <p className="subtitle">Sistema de Cadastro e Avaliação de Projetos</p>
                    </div>
                </div>
            </header>

            <nav>
                <ul>
                    <li><Link to="/">Início</Link></li>
                    <li><Link to="/sobre">Sobre</Link></li>
                </ul>
            </nav>

            <main>
                <Outlet />
            </main>

            <footer>
                <p>&copy; 2025 SCAP - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

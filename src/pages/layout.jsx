import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="layout">
            <header class="header">
                <div class="header-content">
                    <h1 class="header-title">SCAP</h1>
                    <p class="header-subtitle">Sistema de Cadastro e Avaliação de Projetos</p>
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

import { Outlet, Link } from 'react-router-dom';
import '../../global.css';

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
                <a href="/">Início</a>
                <a href="/sobre">Sobre</a>
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

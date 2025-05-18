// src/pages/index.jsx
import { Link } from 'react-router-dom';
import '../../global.css';
import './index.css'


export default function Home() {
  return (
    <main>
        <section className="intro">
          <h2>Bem-vindo ao SCAP!</h2>
          <p>Gerencie e avalie projetos de forma organizada e eficiente.</p>
          <Link className="btn" to="/login">Começar</Link>
        </section>
    </main>
  );
}

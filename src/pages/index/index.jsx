import React from 'react';
import { useNavigate } from 'react-router-dom'; // IMPORTANTE
import './index.css';
import hero from '../../components/ImgCartoon.png';

export default function Index() {
  const navigate = useNavigate(); // hook de navegação

  const irParaLogin = () => {
    navigate('/login'); // troque "/login" pela rota desejada
  };

  return (
    <div className="home-container">
      <link href="https://fonts.googleapis.com/css2?family=Koulen&display=swap" rel="stylesheet" />

      <main className="home-main">
        <div className="home-text">
          <h2>
            <span className="blue">Impulsione</span> seus eventos<br />
            de maneira rapida<br />
            e gratuita com o <strong>SCAP</strong>.
          </h2>
          <button className="btn-login" onClick={irParaLogin}>
            Realizar Login
          </button>
        </div>
        <img src={hero} alt="Personagem com notebook" className="hero-img" />
      </main>
    </div>
  );
}

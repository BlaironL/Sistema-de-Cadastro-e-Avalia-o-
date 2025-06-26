import React from 'react';
import './meu-perfil.css'; // Você pode criar este CSS mais tarde

export default function MeuPerfil() {
  return (
    <div className="page-container meu-perfil-page">
      <h1>Meu Perfil</h1>
      <p>Bem-vindo à sua página de perfil!</p>
      <p>Aqui você poderá ver e editar suas informações pessoais.</p>
      <div className="profile-details-mock">
        <p><strong>Nome:</strong> Usuário Teste</p>
        <p><strong>Email:</strong> usuario@teste.com</p>
        <p><strong>Tipo de Perfil:</strong> Organizador</p>
        <p><strong>Bio:</strong> Entusiasta de projetos e tecnologia.</p>
      </div>
      <button onClick={() => alert('Funcionalidade de edição de perfil em desenvolvimento!')} className="btn-edit-profile">
        Editar Perfil
      </button>
    </div>
  );
}
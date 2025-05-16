import '../css.css';

export default function Sobre() {
    return (
        <>
            <main>
                <section className="sobre">
                    <div className="logo-box">
                        <img src="src/components/logo.png" alt="Logo SCAP" />
                    </div>
                    <div className="texto-box">
                        <h2>🔍 Sobre o SCAP:</h2>
                        <p>
                            O SCAP (Sistema de Cadastro e Avaliação de Projetos) foi desenvolvido com o objetivo de agilizar e
                            organizar os processos durante eventos acadêmicos, facilitando as inscrições de projetos e as
                            avaliações. Criado para atender tanto estudantes quanto coordenadores de eventos, o SCAP oferece uma
                            plataforma simples e eficiente para cadastrar projetos, realizar avaliações e consultar as notas finais
                            dos projetos avaliados.
                            <br /><br />
                            Com foco na simplicidade e facilidade de uso, o SCAP se destaca pela sua interface intuitiva e pelo
                            fluxo de trabalho direto. A missão do SCAP é oferecer uma solução ágil e funcional para o
                            gerenciamento de eventos acadêmicos.
                        </p>
                    </div>
                </section>
            </main>

        </>
    );
}

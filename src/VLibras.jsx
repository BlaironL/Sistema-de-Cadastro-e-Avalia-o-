import { useEffect } from 'react';

export default function VLibras() {
  useEffect(() => {
    const initializeVLibras = () => {
      // 1. Verifique se VLibras já foi carregado e inicializado
      if (window.VLibras) {
        console.log('VLibras já está disponível. Inicializando Widget...');
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      } else {
        console.log('VLibras não disponível. Tentando novamente em 100ms...');
        setTimeout(initializeVLibras, 100); // Tenta novamente após um pequeno atraso
      }
    };

    // Verifique se o script já existe para evitar duplicação em desenvolvimento
    // (Útil para hot-reloading do React)
    if (document.querySelector('script[src="https://vlibras.gov.br/app/vlibras-plugin.js"]')) {
      console.log('Script VLibras já presente no DOM.');
      initializeVLibras(); // Tente inicializar se o script já estiver lá
      return; // Saia para evitar adicionar outro script
    }

    // Crie e adicione o script do VLibras
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true; // Carrega o script de forma assíncrona
    script.setAttribute('id', 'vlibras-plugin-script'); // Adiciona um ID para fácil identificação

    script.onload = () => {
      console.log('Script VLibras carregado com sucesso!');
      initializeVLibras(); // Tenta inicializar o widget após o carregamento do script
    };

    script.onerror = (error) => {
      console.error('Erro ao carregar o script do VLibras:', error);
    };

    document.body.appendChild(script);

    // Limpeza ao desmontar o componente
    return () => {
      console.log('Componente VLibras desmontado. Removendo script...');
      const existingScript = document.getElementById('vlibras-plugin-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      // Opcional: remover as divs do VLibras também
      const vwDiv = document.querySelector('div[vw="true"]');
      if (vwDiv) {
        vwDiv.remove();
      }
    };
  }, []); // O array de dependências vazio garante que o efeito seja executado apenas uma vez

  return (
    // Renderize as divs do VLibras como parte do seu componente React
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active"></div>
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}
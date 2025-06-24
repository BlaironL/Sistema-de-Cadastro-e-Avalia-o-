import { useEffect } from 'react';

export default function VLibras() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.vlibras.gov.br/app/0.vlibras-plugin.js';
    script.async = true;

    script.onload = () => {
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };

    document.body.appendChild(script);

    // Limpeza ao desmontar o componente
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active"></div>
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}

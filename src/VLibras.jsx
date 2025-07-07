import { useEffect } from 'react';

export default function VLibras() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      new window.VLibras.Widget('https://vlibras.gov.br/app');
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="enabled">
      <div className="vw-access-button active"></div>
      <div className="vw-plugin-wrapper">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}

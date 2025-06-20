import React, { useEffect } from 'react';
import { useEventsProjects } from './pages/contexts/EventProjectContext'; // <--- Caminho correto do seu contexto

const DebugClearData = () => {
    const { clearAllTestData } = useEventsProjects();

    useEffect(() => {
        if (clearAllTestData) {
            window.clearAllMyTestData = clearAllTestData;
            console.log("FUNÇÃO DE DEBUG: Digite clearAllMyTestData() no console para limpar os dados.");
        }
    }, [clearAllTestData]);

    // Este componente não renderiza nada visível, é apenas para lógica de debug
    return null; 
};

export default DebugClearData;
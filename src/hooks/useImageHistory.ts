
import { useState, useEffect } from 'react';

interface HistoryItem {
  sourceImage: string;
  resultImage: string;
  timestamp: number;
}

export const useImageHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('imageHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.warn('Nelze načíst historii z localStorage:', error);
    }
  }, []);

  const addToHistory = (sourceImage: string, resultImage: string) => {
    const newItem = {
      sourceImage,
      resultImage,
      timestamp: Date.now()
    };
    
    try {
      // Uchováváme max 5 položek místo 10 pro snížení rizika překročení kvóty
      const updatedHistory = [newItem, ...history].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem('imageHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.warn('Nelze uložit historii do localStorage (pravděpodobně překročena velikost):', error);
      // Aktualizujeme aspoň state, i když se do localStorage nepovedlo uložit
      setHistory(prevHistory => [newItem, ...prevHistory].slice(0, 5));
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('imageHistory');
    } catch (error) {
      console.warn('Nelze vymazat historii z localStorage:', error);
    }
  };

  return { history, addToHistory, clearHistory };
};


import { useState, useEffect } from 'react';

interface HistoryItem {
  sourceImage: string;
  resultImage: string;
  timestamp: number;
}

export const useImageHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('imageHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addToHistory = (sourceImage: string, resultImage: string) => {
    const newItem = {
      sourceImage,
      resultImage,
      timestamp: Date.now()
    };
    
    const updatedHistory = [newItem, ...history].slice(0, 10); // Uchováváme max 10 položek
    setHistory(updatedHistory);
    localStorage.setItem('imageHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('imageHistory');
  };

  return { history, addToHistory, clearHistory };
};


import React from 'react';
import { Button } from "@/components/ui/button";
import ImagePreview from './ImagePreview';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";

interface ImageHistoryProps {
  history: Array<{
    sourceImage: string;
    resultImage: string;
    timestamp: number;
  }>;
  onClearHistory: () => void;
}

const ImageHistory: React.FC<ImageHistoryProps> = ({ history, onClearHistory }) => {
  if (history.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        Zatím žádná historie
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Historie generování</h2>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onClearHistory}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Vymazat historii
        </Button>
      </div>
      
      <ScrollArea className="h-[400px]">
        <div className="space-y-6">
          {history.map((item) => (
            <div 
              key={item.timestamp}
              className="p-4 bg-gray-50 rounded-lg space-y-2"
            >
              <div className="text-sm text-gray-500 mb-2">
                {new Date(item.timestamp).toLocaleString('cs-CZ')}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Vstupní fotografie</div>
                  <ImagePreview image={item.sourceImage} alt="Historická vstupní fotografie" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Výsledná kresba</div>
                  <ImagePreview image={item.resultImage} alt="Historická výsledná kresba" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ImageHistory;

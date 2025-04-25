
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface APIKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

const APIKeyInput: React.FC<APIKeyInputProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const { toast } = useToast();

  // Načíst API klíč z localStorage při načtení komponenty
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsSaved(true);
      onApiKeyChange(savedApiKey);
    }
  }, [onApiKeyChange]);

  const handleSave = () => {
    if (!apiKey || apiKey.trim() === "") {
      toast({
        title: "Chyba",
        description: "Prosím zadejte platný API klíč",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("openai_api_key", apiKey);
    setIsSaved(true);
    onApiKeyChange(apiKey);
    
    toast({
      title: "API klíč uložen",
      description: "Váš OpenAI API klíč byl úspěšně uložen",
    });
  };

  const handleClear = () => {
    localStorage.removeItem("openai_api_key");
    setApiKey("");
    setIsSaved(false);
    onApiKeyChange("");
    
    toast({
      title: "API klíč odstraněn",
      description: "Váš OpenAI API klíč byl odstraněn",
    });
  };

  return (
    <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h3 className="text-md font-medium">OpenAI API klíč</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="password"
          placeholder="Zadejte váš OpenAI API klíč"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-grow"
        />
        
        {isSaved ? (
          <Button 
            variant="outline" 
            onClick={handleClear}
            className="whitespace-nowrap"
          >
            Odstranit klíč
          </Button>
        ) : (
          <Button 
            onClick={handleSave}
            className="whitespace-nowrap"
          >
            Uložit klíč
          </Button>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Klíč je uložen pouze ve vašem prohlížeči. Je potřeba pro generování kreseb pomocí OpenAI API.
      </p>
    </div>
  );
};

export default APIKeyInput;

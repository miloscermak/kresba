
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import ImageUpload from '@/components/ImageUpload';
import ImagePreview from '@/components/ImagePreview';
import APIKeyInput from '@/components/APIKeyInput';
import StyleSelector from '@/components/StyleSelector';
import { useToast } from "@/hooks/use-toast";
import { generateDrawing } from '@/services/geminiService';
import { Download } from 'lucide-react';
import type { DrawingStyle } from '@/components/StyleSelector';

const Index = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<DrawingStyle>("komiks");
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    // Reset previous results when a new image is selected
    setResultImage(null);
    
    console.log("Processing file in Index component:", file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      console.log("FileReader onload triggered");
      if (e.target?.result) {
        setSourceImage(e.target.result as string);
        console.log("Source image set successfully");
      }
    };
    
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst fotografii. Zkuste to prosím znovu.",
        variant: "destructive",
      });
    };
    
    console.log("Starting to read file as data URL");
    reader.readAsDataURL(file);
  };

  const handleGenerateDrawing = async () => {
    if (!sourceImage) {
      console.error("No source image available");
      return;
    }

    if (!apiKey) {
      toast({
        title: "Chybí API klíč",
        description: "Pro generování kresby je potřeba zadat Gemini API klíč.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Calling Gemini API to generate drawing");
      const imageUrl = await generateDrawing(sourceImage, apiKey, selectedStyle);
      console.log("Drawing generated successfully:", imageUrl);
      setResultImage(imageUrl);
      
      toast({
        title: "Hotovo!",
        description: "Vaše kresba byla úspěšně vygenerována.",
      });
    } catch (error) {
      console.error("Error generating drawing:", error);
      const errorMessage = error instanceof Error ? error.message : "Neznámá chyba";
      toast({
        title: "Chyba",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `kresba-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Staženo",
        description: "Kresba byla úspěšně stažena.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Nahrajte fotku ...
          </h1>
          <p className="text-gray-600">
            ... a dostanete kresbu
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <APIKeyInput onApiKeyChange={setApiKey} />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Vstupní fotografie</h2>
              <ImageUpload onImageSelect={handleImageSelect} />
              <StyleSelector 
                selectedStyle={selectedStyle} 
                onStyleChange={setSelectedStyle}
              />
              {sourceImage && (
                <div className="mt-4">
                  <ImagePreview image={sourceImage} alt="Vstupní fotografie" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Výsledná kresba</h2>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={handleGenerateDrawing} 
                  disabled={!sourceImage || isLoading || !apiKey}
                  className="w-full sm:w-40"
                >
                  {isLoading ? "Generuji..." : "Vytvořit kresbu"}
                </Button>
                {resultImage && (
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full sm:w-40"
                  >
                    <Download className="mr-2" />
                    Stáhnout
                  </Button>
                )}
              </div>
              {resultImage && (
                <div className="mt-4">
                  <ImagePreview image={resultImage} alt="Výsledná kresba" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

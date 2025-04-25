
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import ImageUpload from '@/components/ImageUpload';
import ImagePreview from '@/components/ImagePreview';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSourceImage(e.target.result as string);
        setResultImage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const generateDrawing = async () => {
    if (!sourceImage) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: sourceImage }),
      });

      if (!response.ok) {
        throw new Error('Chyba při generování kresby');
      }

      const data = await response.json();
      setResultImage(data.url);
      toast({
        title: "Hotovo!",
        description: "Vaše kresba byla úspěšně vygenerována.",
      });
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodařilo se vygenerovat kresbu. Zkuste to prosím znovu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Převod fotografie na kresbu
          </h1>
          <p className="text-gray-600">
            Nahrajte fotografii a nechte AI vytvořit jedinečnou uměleckou kresbu
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Vstupní fotografie</h2>
              <ImageUpload onImageSelect={handleImageSelect} />
              {sourceImage && <ImagePreview image={sourceImage} alt="Vstupní fotografie" />}
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Výsledná kresba</h2>
              <div className="flex justify-center">
                <Button 
                  onClick={generateDrawing} 
                  disabled={!sourceImage || isLoading}
                  className="w-40"
                >
                  {isLoading ? "Generuji..." : "Vytvořit kresbu"}
                </Button>
              </div>
              {resultImage && <ImagePreview image={resultImage} alt="Výsledná kresba" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

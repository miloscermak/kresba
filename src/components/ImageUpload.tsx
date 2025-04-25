
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    setIsUploading(true);
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
    if (!validTypes.includes(file.type.toLowerCase()) && 
        !(file.name.toLowerCase().endsWith('.heic'))) {
      toast({
        title: "Neplatný formát",
        description: "Prosím nahrajte soubor typu JPG, PNG nebo HEIC.",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Příliš velký soubor",
        description: "Maximální velikost souboru je 10MB.",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }
    
    try {
      onImageSelect(file);
      toast({
        title: "Fotografie nahrána",
        description: "Fotografie byla úspěšně nahrána.",
      });
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodařilo se nahrát fotografii. Zkuste to prosím znovu.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg,.heic"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <Button variant="outline" className="cursor-pointer" disabled={isUploading}>
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Nahrávání..." : "Nahrát fotografii"}
        </Button>
      </label>
    </div>
  );
};

export default ImageUpload;

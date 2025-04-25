
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, ImageOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      console.log("No file selected");
      return;
    }
    
    console.log("File selected:", file.name, file.type, file.size);
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
      console.log("File passed to onImageSelect");
      toast({
        title: "Fotografie nahrána",
        description: "Fotografie byla úspěšně nahrána.",
      });
    } catch (error) {
      console.error("Error in image upload:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se nahrát fotografii. Zkuste to prosím znovu.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
        ref={fileInputRef}
      />
      <Button 
        variant="outline" 
        className="cursor-pointer w-full sm:w-auto" 
        disabled={isUploading}
        onClick={handleButtonClick}
      >
        {isUploading ? (
          <>
            <Upload className="w-4 h-4 mr-2 animate-pulse" />
            Nahrávání...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Nahrát fotografii
          </>
        )}
      </Button>
    </div>
  );
};

export default ImageUpload;

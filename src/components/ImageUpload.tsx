
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import heic2any from 'heic2any';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertHeicToJpeg = async (file: File): Promise<File> => {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8
      });
      
      // If the result is an array, take the first item
      const resultBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      
      // Create a new File from the blob
      return new File([resultBlob], file.name.replace(/\.heic$/i, '.jpg'), {
        type: 'image/jpeg'
      });
    } catch (error) {
      console.error('Error converting HEIC:', error);
      throw new Error('Nepodařilo se převést HEIC formát');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      console.log("No file selected");
      return;
    }
    
    console.log("File selected:", file.name, file.type, file.size);
    setIsUploading(true);
    
    try {
      let processedFile = file;
      
      // Check if file is HEIC
      if (file.type.toLowerCase() === 'image/heic' || 
          file.type.toLowerCase() === 'image/heif' || 
          file.name.toLowerCase().endsWith('.heic')) {
        processedFile = await convertHeicToJpeg(file);
      } else {
        // Check other file types
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type.toLowerCase())) {
          toast({
            title: "Neplatný formát",
            description: "Prosím nahrajte soubor typu JPG, PNG nebo HEIC.",
            variant: "destructive",
          });
          setIsUploading(false);
          return;
        }
      }
      
      // Check file size (max 10MB)
      if (processedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "Příliš velký soubor",
          description: "Maximální velikost souboru je 10MB.",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }
      
      onImageSelect(processedFile);
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

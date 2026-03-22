
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import heic2any from 'heic2any';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE_MB = 10;

// Konverze iPhone HEIC formátu na JPEG
const convertHeicToJpeg = async (file: File): Promise<File> => {
  const convertedBlob = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.8
  });

  const resultBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

  return new File([resultBlob], file.name.replace(/\.heic$/i, '.jpg'), {
    type: 'image/jpeg'
  });
};

const isHeicFile = (file: File): boolean =>
  file.type.toLowerCase() === 'image/heic' ||
  file.type.toLowerCase() === 'image/heif' ||
  file.name.toLowerCase().endsWith('.heic');

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      let processedFile = file;

      if (isHeicFile(file)) {
        processedFile = await convertHeicToJpeg(file);
      } else if (!VALID_TYPES.includes(file.type.toLowerCase())) {
        toast({
          title: "Neplatný formát",
          description: "Prosím nahrajte soubor typu JPG, PNG nebo HEIC.",
          variant: "destructive",
        });
        return;
      }

      // Kontrola velikosti (max 10 MB)
      if (processedFile.size > MAX_SIZE_MB * 1024 * 1024) {
        toast({
          title: "Příliš velký soubor",
          description: `Maximální velikost souboru je ${MAX_SIZE_MB} MB.`,
          variant: "destructive",
        });
        return;
      }

      onImageSelect(processedFile);
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
      // Reset inputu – umožní nahrát stejný soubor znovu
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg,.heic"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <Button
        variant="outline"
        className="cursor-pointer w-full sm:w-auto"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? "Nahrávání..." : "Nahrát fotografii"}
      </Button>
    </div>
  );
};

export default ImageUpload;

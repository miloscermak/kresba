
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.heic"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <Button variant="outline" className="cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          Nahrát fotografii
        </Button>
      </label>
    </div>
  );
};

export default ImageUpload;

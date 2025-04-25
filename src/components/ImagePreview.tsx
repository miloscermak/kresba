
import React from 'react';
import { cn } from '@/lib/utils';

interface ImagePreviewProps {
  image: string | null;
  className?: string;
  alt?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, className, alt = "Náhled obrázku" }) => {
  if (!image) return null;

  return (
    <div className={cn("rounded-lg overflow-hidden max-w-md w-full", className)}>
      <img
        src={image}
        alt={alt}
        className="w-full h-auto object-contain"
      />
    </div>
  );
};

export default ImagePreview;

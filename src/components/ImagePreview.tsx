
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImagePreviewProps {
  image: string | null;
  className?: string;
  alt?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, className, alt = "Náhled obrázku" }) => {
  const [hasError, setHasError] = useState(false);

  if (!image) return null;
  if (hasError) return (
    <div className={cn("rounded-lg overflow-hidden max-w-md w-full bg-gray-100 flex items-center justify-center p-8", className)}>
      <p className="text-gray-500">Nelze zobrazit obrázek</p>
    </div>
  );

  return (
    <div className={cn("rounded-lg overflow-hidden max-w-md w-full", className)}>
      <img
        src={image}
        alt={alt}
        className="w-full h-auto object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export default ImagePreview;

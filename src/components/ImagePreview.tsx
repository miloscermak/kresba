
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';

interface ImagePreviewProps {
  image: string | null;
  className?: string;
  alt?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, className, alt = "Náhled obrázku" }) => {
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    if (image && imgRef.current) {
      const updateAspectRatio = () => {
        if (imgRef.current) {
          const ratio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
          console.log(`Nastavuji poměr stran: ${ratio} (${imgRef.current.naturalWidth}x${imgRef.current.naturalHeight})`);
          setAspectRatio(ratio);
        }
      };

      if (imgRef.current.complete) {
        updateAspectRatio();
      } else {
        imgRef.current.onload = updateAspectRatio;
      }
    }
  }, [image]);

  if (!image) {
    return (
      <div className={cn("rounded-lg overflow-hidden max-w-md w-full bg-gray-100 flex items-center justify-center p-8", className)}>
        <p className="text-gray-500">Žádný obrázek</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={cn("rounded-lg overflow-hidden max-w-md w-full bg-gray-100 flex items-center justify-center p-8", className)}>
        <div className="flex flex-col items-center gap-2">
          <ImageOff className="w-8 h-8 text-gray-400" />
          <p className="text-gray-500">Nelze zobrazit obrázek</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg overflow-hidden max-w-md w-full bg-gray-50", className)}>
      <div 
        className="w-full" 
        style={aspectRatio ? { aspectRatio: String(aspectRatio) } : undefined}
      >
        <img
          ref={imgRef}
          src={image}
          alt={alt}
          className="w-full h-full object-contain"
          onError={() => {
            console.error("Image failed to load:", image);
            setHasError(true);
          }}
        />
      </div>
    </div>
  );
};

export default ImagePreview;

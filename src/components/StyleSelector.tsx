
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type DrawingStyle = 'komiks' | 'jedna-cara';

interface StyleSelectorProps {
  selectedStyle: DrawingStyle;
  onStyleChange: (style: DrawingStyle) => void;
}

const StyleSelector = ({ selectedStyle, onStyleChange }: StyleSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-700">Styl kresby:</h3>
      <RadioGroup 
        value={selectedStyle} 
        onValueChange={(value) => onStyleChange(value as DrawingStyle)}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="komiks" id="komiks" />
          <Label htmlFor="komiks" className="cursor-pointer">
            Komiks
            <p className="text-xs text-gray-500">Černobílá kresba s obrysy a šrafováním</p>
          </Label>
        </div>
        
        <div className="flex items-center gap-2">
          <RadioGroupItem value="jedna-cara" id="jedna-cara" />
          <Label htmlFor="jedna-cara" className="cursor-pointer">
            Jedna čára
            <p className="text-xs text-gray-500">Minimalistická jednočárová ilustrace</p>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default StyleSelector;

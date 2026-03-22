import type { DrawingStyle } from '@/components/StyleSelector';

// Prompty pro jednotlivé styly kresby
const getPromptForStyle = (style: DrawingStyle): string => {
  const prompts: Record<DrawingStyle, string> = {
    "komiks": "Transform the provided photograph into this artistic style: Black and white minimalist drawing with bold black outlines and subtle gray hatching to define shadows and volume. Occasional color accents in light blue or orange. Simplified shapes and features, no fine details. Modern and elegant feel.",
    "jedna-cara": "Transform the provided photograph into this artistic style: Elegant continuous-line drawing of a human figure, created from a single uninterrupted black line. Minimalist modern style inspired by Picasso and Matisse. Soft, flowing curves, no shading, no facial details, only outlines. Calm and gentle expression through body language. Clean composition on a white background. Simple, abstract, poetic, sophisticated."
  };

  return prompts[style] ?? prompts["komiks"];
};

// Parsování base64 data URL na MIME typ a data
const parseDataUrl = (dataUrl: string) => {
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Neplatný formát obrázku");
  }
  return { mimeType: matches[1], base64Data: matches[2] };
};

export const generateDrawing = async (
  imageBase64: string,
  apiKey: string,
  style: DrawingStyle = "komiks"
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API klíč není nastaven");
  }

  const { mimeType, base64Data } = parseDataUrl(imageBase64);
  const prompt = getPromptForStyle(style);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: mimeType, data: base64Data } },
            { text: prompt }
          ]
        }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"]
        }
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error?.message || `${response.status} ${response.statusText}`;
    throw new Error(`Gemini API: ${errorMessage}`);
  }

  const parts = data.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error("Neplatná odpověď z Gemini API");
  }

  // Hledáme obrázek v odpovědi
  const imagePart = parts.find((part: { inlineData?: { mimeType: string; data: string } }) => part.inlineData);
  if (imagePart?.inlineData) {
    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
  }

  throw new Error("Odpověď neobsahuje vygenerovaný obrázek");
};

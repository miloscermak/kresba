import type { DrawingStyle } from '@/components/StyleSelector';

const getPromptForStyle = (style: DrawingStyle): string => {
  if (style === "komiks") {
    return "Transform the provided photograph into this artistic style: Black and white minimalist drawing with bold black outlines and subtle gray hatching to define shadows and volume. Occasional color accents in light blue or orange. Simplified shapes and features, no fine details. Modern and elegant feel.";
  } else if (style === "jedna-cara") {
    return "Transform the provided photograph into this artistic style: Elegant continuous-line drawing of a human figure, created from a single uninterrupted black line. Minimalist modern style inspired by Picasso and Matisse. Soft, flowing curves, no shading, no facial details, only outlines. Calm and gentle expression through body language. Clean composition on a white background. Simple, abstract, poetic, sophisticated.";
  }

  // Default to comics style
  return "Transform the provided photograph into this artistic style: Black and white minimalist drawing with bold black outlines and subtle gray hatching to define shadows and volume. Occasional color accents in light blue or orange. Simplified shapes and features, no fine details. Modern and elegant feel.";
};

export const generateDrawing = async (
  imageBase64: string,
  apiKey: string,
  style: DrawingStyle = "komiks"
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API klíč není nastaven");
  }

  // Extract base64 data and mime type from data URL
  const matches = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Neplatný formát obrázku");
  }

  const mimeType = matches[1];
  const base64Data = matches[2];

  const prompt = getPromptForStyle(style);

  try {
    console.log("Sending request to Gemini API");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Data
                  }
                },
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"]
          }
        })
      }
    );

    const data = await response.json();
    console.log("Gemini API response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("Gemini API error:", data);
      const errorMessage = data?.error?.message || `${response.status} ${response.statusText}`;
      throw new Error(`Gemini API error: ${errorMessage}`);
    }

    if (!data.candidates || !data.candidates[0]?.content?.parts) {
      console.error("Neplatná struktura odpovědi:", data);
      throw new Error("Neplatná odpověď z Gemini API");
    }

    // Find the image part in the response
    const parts = data.candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData) {
        console.log("Image data found in response");
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    // If no image found, check for text response (might be an error message)
    for (const part of parts) {
      if (part.text) {
        console.log("Text response:", part.text);
      }
    }

    throw new Error("Odpověď neobsahuje vygenerovaný obrázek");
  } catch (error) {
    console.error("Chyba při generování kresby:", error);
    throw error;
  }
};

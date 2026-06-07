import type { DrawingStyle } from '@/components/StyleSelector';

// Prompty pro jednotlivé styly kresby
const getPromptForStyle = (style: DrawingStyle): string => {
  const prompts: Record<DrawingStyle, string> = {
    "komiks": "Create an elegant editorial portrait illustration from the input photo in the style of a sophisticated magazine drawing. Use refined black ink linework, delicate cross-hatching, and subtle pastel washes in soft beige and pale gray tones. Preserve the subject's key facial features while adding a slight artistic stylization that feels intelligent, warm, and timeless. Keep the composition clean and minimal, with a lightly textured watercolor-paper background and no text or logos. Avoid strong contrast, heavy shadows, or exaggerated caricature. The overall effect should be cultured, airy, understated, and reminiscent of a classic New Yorker-style editorial illustration.",
    "jedna-cara": "One-line continuous drawing portrétu, dynamický a hravý, minimum detailů, výrazná silueta, vhodné pro event poster. Bez vyplňování ploch, důraz na gesto linky."
  };

  return prompts[style] ?? prompts["komiks"];
};

export const generateDrawing = async (
  imageBase64: string,
  apiKey: string,
  style: DrawingStyle = "komiks"
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API klíč není nastaven");
  }

  const prompt = getPromptForStyle(style);

  // xAI /v1/images/edits – image-to-image. Aspect ratio se u single-image
  // editu automaticky zachová podle vstupního obrázku.
  const response = await fetch(
    'https://api.x.ai/v1/images/edits',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-imagine-image-quality',
        prompt,
        image: { url: imageBase64 },
        response_format: 'b64_json',
        n: 1,
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error?.message || data?.error || `${response.status} ${response.statusText}`;
    throw new Error(`xAI API: ${typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)}`);
  }

  const item = data?.data?.[0];
  if (!item?.b64_json) {
    throw new Error("Odpověď neobsahuje vygenerovaný obrázek");
  }

  const mime = item.mime_type || 'image/png';
  return `data:${mime};base64,${item.b64_json}`;
};

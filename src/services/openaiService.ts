
import { useToast } from "@/hooks/use-toast";

export const generateDrawing = async (imageBase64: string, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API klíč není nastaven");
  }

  // Odstranit hlavičku base64 (např. 'data:image/jpeg;base64,')
  const base64Data = imageBase64.split(',')[1];
  
  // Převést base64 na Blob
  const byteCharacters = atob(base64Data);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    const slice = byteCharacters.slice(offset, offset + 1024);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  const blob = new Blob(byteArrays, { type: 'image/jpeg' });
  
  // Vytvořit FormData pro upload
  const formData = new FormData();
  formData.append('image', blob);
  formData.append('prompt', "Styl kresby: Černobílá minimalistická kresba s tučnými černými obrysy a jemným šrafováním šedou barvou pro definování stínů a objemu. Občasné barevné akcenty světle modrou nebo oranžovou. Zjednodušené tvary a rysy, bez drobných detailů. Působí moderně a elegantně.");
  formData.append('model', 'gpt-image-1');
  formData.append('n', '1');
  formData.append('size', '1024x1024');
  formData.append('quality', 'high');

  try {
    console.log("Sending request to OpenAI API");
    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("OpenAI API response:", data);
    
    if (data.data && data.data.length > 0 && data.data[0].url) {
      return data.data[0].url;
    } else {
      throw new Error("Neplatná odpověď z OpenAI API");
    }
  } catch (error) {
    console.error("Chyba při generování kresby:", error);
    throw error;
  }
};

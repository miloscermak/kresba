
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
  
  // Získáme rozměry vstupního obrázku
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageBase64;
  });
  
  console.log(`Původní rozměry obrázku: ${img.width}x${img.height}, poměr stran: ${img.width/img.height}`);
  
  // Určíme nejbližší podporovanou velikost (OpenAI podporuje pouze AKTUÁLNÍ podporované velikosti)
  // Podle chyby: Supported values are: '1024x1024', '1024x1536', '1536x1024', and 'auto'.
  const aspectRatio = img.width / img.height;
  let size = '1024x1024'; // výchozí velikost
  
  if (aspectRatio > 1.3) {
    size = '1536x1024'; // široký obrázek
  } else if (aspectRatio < 0.7) {
    size = '1024x1536'; // vysoký obrázek
  }
  
  console.log(`Zvolená velikost pro API: ${size}`);
  
  // Vytvořit FormData pro upload
  const formData = new FormData();
  formData.append('image', blob);
  formData.append('prompt', "Styl kresby: Černobílá minimalistická kresba s tučnými černými obrysy a jemným šrafováním šedou barvou pro definování stínů a objemu. Občasné barevné akcenty světle modrou nebo oranžovou. Zjednodušené tvary a rysy, bez drobných detailů. Působí moderně a elegantně.");
  formData.append('model', 'gpt-image-1');
  formData.append('n', '1');
  formData.append('size', size);
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
    
    // Podrobnější kontrola dat a jejich struktury
    if (!data) {
      throw new Error("API vrátila prázdnou odpověď");
    }
    
    console.log("Data struktura:", JSON.stringify(data, null, 2));
    
    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      // Kontrola, zda máme URL nebo b64_json
      const imageData = data.data[0];
      
      if (imageData.url) {
        console.log("Image URL získáno úspěšně");
        return imageData.url;
      } else if (imageData.b64_json) {
        console.log("Image Base64 získáno úspěšně");
        return `data:image/png;base64,${imageData.b64_json}`;
      } else {
        console.error("Neplatný formát odpovědi - chybí URL i b64_json:", imageData);
        throw new Error("Neplatný formát odpovědi - chybí URL i b64_json");
      }
    } else {
      console.error("Neplatná struktura dat z API:", data);
      throw new Error("Neplatná odpověď z OpenAI API");
    }
  } catch (error) {
    console.error("Chyba při generování kresby:", error);
    throw error;
  }
};

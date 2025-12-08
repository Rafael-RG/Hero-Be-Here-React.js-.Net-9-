import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getServiceRecommendations = async (userQuery: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `User Query: "${userQuery}"`,
      config: {
        systemInstruction: `
          Eres un asistente conciso y útil para una app de servicios llamada "Hero Be Here".
          Tu objetivo es identificar qué tipo de servicio necesita el usuario basándote en su problema.
          
          Responde en formato JSON puro (sin bloques de código markdown) con esta estructura:
          {
            "category": "home" | "tech" | "beauty" | "pet" | "educ" | "other",
            "suggestedSearchTerm": "string corto",
            "advice": "Un consejo muy breve (max 20 palabras) sobre qué buscar."
          }
          
          Si la consulta no tiene sentido o es peligrosa, responde con category "other" y un consejo amable.
        `,
        responseMimeType: "application/json"
      }
    });

    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const chatWithConcierge = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
    // Basic chat interface for general questions
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
            config: {
                systemInstruction: "Eres el asistente inteligente de 'Hero Be Here'. Ayudas a los usuarios a encontrar profesionales (héroes) para sus tareas. Sé breve, amable y utiliza emojis. Tu objetivo final es que contraten un servicio."
            }
        });
        
        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (e) {
        console.error(e);
        return "Lo siento, tuve un problema de conexión. ¿Podrías intentar de nuevo?";
    }
}
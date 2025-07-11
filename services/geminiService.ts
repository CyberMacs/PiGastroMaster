import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GEMINI_PROMPT } from '../constants';
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.ARRAY,
      description: "An array of all analyzed dishes from the menu.",
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            enum: ['top', 'recommended', 'interesting', 'caution', 'avoid'],
            description: "The classification category for the dish."
          },
          dishName: {
            type: Type.STRING,
            description: "The name of the dish from the menu."
          },
          reasoning: {
            type: Type.STRING,
            description: "A detailed explanation for the ranking, based on Pi's preferences."
          },
          suggestion: {
            type: Type.STRING,
            description: "An optional suggestion for modifying the dish to better suit Pi's tastes. Only for 'caution' category."
          }
        },
        required: ["category", "dishName", "reasoning"]
      }
    }
  },
  required: ['analysis'],
};


export const analyzeMenu = async (base64ImageData: string): Promise<AnalysisResult> => {
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64ImageData,
    },
  };

  const textPart = {
    text: GEMINI_PROMPT,
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text.trim();
    // Although we expect JSON, it's safer to parse it inside a try-catch
    try {
      const parsedResult: AnalysisResult = JSON.parse(jsonText);
      return parsedResult;
    } catch (e) {
      console.error("Failed to parse JSON response:", jsonText);
      throw new Error("A válasz formátuma nem megfelelő. Próbáld újra.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Hiba történt az étlap elemzése közben. Kérlek, próbáld újra később.");
  }
};
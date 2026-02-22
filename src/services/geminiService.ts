import { GoogleGenAI } from "@google/genai";
import { apiService } from "./apiService";

let cachedSystemInstruction: string | null = null;

const buildSystemInstruction = async () => {
  if (cachedSystemInstruction) {
    return cachedSystemInstruction;
  }

  try {
    const data = await apiService.getPortfolioData();
    const skillNames = data.skills.map((s) => s.name).join(", ");
    const experiences = data.experiences
      .map((e) => `${e.role} at ${e.company}`)
      .join(", ");

    cachedSystemInstruction = `
You are the AI assistant for Alex, a world-class Full Stack Developer. 
Alex's Skills: ${skillNames}.
Alex's Experiences: ${experiences}.
Alex's Projects: ${data.projects.map((p) => p.title).join(", ")}.
`.trim();

    return cachedSystemInstruction;
  } catch (error) {
    console.error("Failed to build system instruction:", error);
    return "You are an AI assistant for a Full Stack Developer. Help answer questions about their experience and skills.";
  }
};

export const getGeminiResponse = async (userMessage: string) => {
  try {
    const systemInstruction = await buildSystemInstruction();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    });

    return (
      response.text || "I'm sorry, I couldn't process that request right now."
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The AI assistant is currently taking a coffee break. Please try again in a moment!";
  }
};

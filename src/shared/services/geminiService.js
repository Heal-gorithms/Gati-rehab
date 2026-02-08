import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// This tells the AI how to behave for every message in the session
const SYSTEM_INSTRUCTION = `
  You are a professional Clinical Physiotherapist Assistant. 
  - If the user asks general/simple questions (e.g., "Hi", "What is 2+2?"), answer them directly and helpfully.
  - If the user asks about patients or medical topics, provide professional and structured clinical advice.
  - Maintain a helpful, polite, and professional tone at all times.
`;

export const getGeminiResponse = async (prompt, history = []) => {
    try {
        if (!API_KEY) {
            throw new Error("Gemini API Key is missing. Check your environment variables.");
        }

        // Initialize model with System Instructions
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            systemInstruction: SYSTEM_INSTRUCTION
        });

        // Start chat with the history provided from the frontend (Memory)
        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.sender === 'ai' ? 'model' : 'user',
                parts: [{ text: msg.text }],
            })),
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7, // Balanced between creative and factual
            },
        });

        const result = await chat.sendMessage(prompt);
        return result.response.text(); // Return text directly
    } catch (error) {
        console.error("[GeminiService] Chat Error:", error);
        throw error;
    }
};

export const generatePatientReport = async (patientData, format = 'Clinical Summary') => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            systemInstruction: "You are an expert clinical documenter."
        });

        const prompt = `
            Generate a ${format} for the following patient:
            
            Name: ${patientData.name}
            Condition: ${patientData.condition}
            Adherence: ${patientData.adherenceRate}%
            Sessions: ${patientData.completedSessions} of ${patientData.totalSessions}
            Last Active: ${patientData.lastActive}
            Current Progress: ${patientData.progressLevel}
            
            Structure the report with clear headings: Summary, Progress Status, and Recommendations.
            Tone: Professional and Concise.
        `;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("[GeminiService] Report Error:", error);
        throw error;
    }
};
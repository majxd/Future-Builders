
import { GoogleGenAI, Chat } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are an expert storyteller and game master for an educational, text-based adventure game.
The theme is 'Surviving on a Deserted Island with Science'.
Your goal is to create an engaging, interactive, and informative experience where the player learns real-world survival and scientific principles.
Describe the environment, challenges, and outcomes of the player's actions in a vivid, descriptive, and concise manner (2-3 paragraphs).
When describing challenges, subtly embed scientific or practical knowledge (e.g., finding fresh water, identifying edible plants, building a shelter, principles of fire-making).
Always present the player with a situation where they need to think and respond.
End your responses by describing the scene in a way that implies a decision is needed, without explicitly saying 'What do you do next?'.
The tone should be immersive and slightly mysterious. The player has just woken up with no memory of how they got here.
`;


export function createAdventureChat(): Chat {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
        },
    });

    return chat;
}

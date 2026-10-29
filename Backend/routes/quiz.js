const { GoogleGenAI } = require('@google/genai');

// Initialize the SDK using process.env.GEMINI_API_KEY automatically
const ai = new GoogleGenAI();

async function generateRoadmapContent(promptText) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: promptText,
        });

        let text = response.text;
        // Clean potential markdown blocks safely
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error('Gemini API Error details:', error);
        throw error;
    }
}

module.exports = generateRoadmapContent;
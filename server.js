import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config"
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.use(cors());
app.use(express.json());

app.get("/",(req, res) => {
    res.send("Translation API Working");
})

app.post("/translate", async (req, res) => {
    const { text, targetLanguage } = req.body;
    
    if (!text || !targetLanguage || targetLanguage == "null") {
        return res.json({ translatedText: null });
    }

    try {
        const prompt = `Translate this to ${targetLanguage} and return only the translated text without explanations: \"${text}\"`;
        const result = await model.generateContent(prompt);
        const translatedText = result.response.text();
        
        res.json({ translatedText });
    } catch (error) {
        console.error("Translation Error:", error);
        res.status(500).json({ error: "Failed to translate text" });
    }
});

app.post("/chat", async (req, res) => {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: "Missing input text" });
    }

    try {
        const result = await model.generateContent(text);
        const reply = result.response.text();
        
        res.json({ reply });
    } catch (error) {
        console.error("Translation Error:", error);
        res.status(500).json({ error: "Failed to translate text" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

import axios from "axios";
import { PersonalData } from "../models/personalDataSchema.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export const askChatbot = async (req, res) => {
    try {
      const userMessage = req.body.message;
      if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
      }
  
      // Handle empty messages
      if (!userMessage.trim()) {
        return res.status(400).json({ error: "Message cannot be empty." });
      }
  
      
  
      // Fetch personal data
      const personalDataDoc = await PersonalData.findOne();
      const personalData = personalDataDoc?.content || "";
  
      // Define chatbot instructions
      const chatbotInstructions = `
      **IMPORTANT INSTRUCTIONS FOR THE CHATBOT:**
      - You are an AI assistant created by H K Charan to help visitors learn about him.
      - You can respond to greetings and small talk, but keep the conversation focused on H K Charan.
      - Only answer questions related to H K Charan's skills, projects, experiences, and social links.
      - Do not generate code, solve programming problems, or answer unrelated questions.
      - If a question is not about H K Charan, politely guide the user to ask about H K Charan.
      - Format the response in Markdown.
      - Provide clear, concise, and helpful answers.
      - If you are unsure about a question, you can say "I don't know".
      `;
  
      // Send request to Gemini API
      const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        contents: [
          {
            role: "user",
            parts: [{ text: `${chatbotInstructions}\n\n${personalData}` }],
          },
          {
            role: "user",
            parts: [{ text: `${userMessage}\n\n` }],
          },
        ],
      });
  
      // Extract the bot's reply
      const botReply =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't find an answer.";
  
      res.json({ reply: botReply });
    } catch (error) {
      console.error("Error in chatbot response:", error.message, error.stack);
      res.status(500).json({ error: "Something went wrong!" });
    }
  };

// Fetch PERSONAL_DATA
export const getPersonalData = async (req, res) => {
  try {
    const info = await PersonalData.findOne();
    res.json({ content: info?.content || "" });
  } catch (error) {
    console.error("Error fetching personal data:", error.message, error.stack);
    res.status(500).json({ error: "Failed to fetch personal data" });
  }
};

// Update PERSONAL_DATA
export const updatePersonalData = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    await PersonalData.findOneAndReplace({}, { content }, { upsert: true });
    res.json({ message: "Personal data updated successfully" });
  } catch (error) {
    console.error("Error updating personal data:", error.message, error.stack);
    res.status(500).json({ error: "Failed to update personal data" });
  }
};
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
  try {
const { message } = req.body;

    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const response = await model.generateContent(message);

    const botReply = response.response.text();

    res.json({ reply: botReply });

  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get('/', (req, res) => {
  res.send("Server is running ✅");
});

const PORT = process.env.PORT || 5009;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

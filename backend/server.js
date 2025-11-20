import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5009;
app.get('/', (req, res) => {
  res.send("Server is running ✅");
});


app.get('/check-api', (req, res) => {
  const hasApiKey = !!process.env.GOOGLE_API_KEY;
  res.json({ 
    hasApiKey,
    message: hasApiKey 
      ? 'API key found ✅' 
      : 'API key not found'
  });
});

// endpoint test
app.get('/test-models', async (req, res) => {
  if (!process.env.GOOGLE_API_KEY) {
    return res.json({ error: 'API key غير موجود' });
  }

  const testModels = [
    { name: "gemini-1.5-flash-latest", version: "v1beta" },
    { name: "gemini-1.5-pro-latest", version: "v1beta" }
  ];

  const results = [];
  
  for (const { name, version } of testModels) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/${version}/models/${name}:generateContent?key=${process.env.GOOGLE_API_KEY}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "test" }] }],
          generationConfig: { maxOutputTokens: 10 }
        }),
      });
      
      results.push({
        model: `${name} (${version})`,
        status: response.ok ? '✅ يعمل' : `❌ ${response.status}`,
        error: response.ok ? null : (await response.json().catch(() => ({}))).error?.message
      });
    } catch (err) {
      results.push({
        model: `${name} (${version})`,
        status: '❌ خطأ',
        error: err.message
      });
    }
  }
  
  res.json({ results });
});



// ============================================
// 📝 Endpoint للبوت - استقبال الطلب من Frontend
// ============================================
app.post('/chat', async (req, res) => {

  const { message, history = [] } = req.body;

  if (!process.env.GOOGLE_API_KEY) {
    console.error('GOOGLE_API_KEY is not set in environment variables');

    return res.status(500).json({ reply: "api key not found please add it to the .env file" });
  }

  if (!message) {
    return res.status(400).json({ reply: "message is empty" });
  }

  // ============================================
  //start connect to gemini 
  // ============================================
  try {

    const modelName = "gemini-2.5-flash";
    const modelVersion = "v1beta";
    const apiUrl = `https://generativelanguage.googleapis.com/${modelVersion}/models/${modelName}:generateContent?key=${process.env.GOOGLE_API_KEY}`;
    
    // ============================================
    // (Conversation Contents)
    // ============================================
    const contents = [];
  
    const recentHistory = history.slice(-10); // أخذ آخر 10 رسائل
    recentHistory.forEach(msg => {
      contents.push({
        role: msg.role || (msg.sender === 'user' ? 'user' : 'model'),
        parts: msg.parts || [{ text: msg.message || msg.text }]
      });
    });
    
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // ============================================
    // send request to gemini api
    // ============================================
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: contents, 
        generationConfig: {
          maxOutputTokens: 500, // الحد الأقصى للرد
          temperature: 0.7 // درجة الإبداع (0-1)
        }
      }),
    });

    // ============================================
    // check if the request is successful
    // ============================================
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP error: ${response.status}`;
      console.error(`API request failed:`, errorMessage);
      return res.status(500).json({ 
        reply: `خطأ في API: ${errorMessage}` 
      });
    }


    const data = await response.json();
    // data.candidates[0].content.parts[0].text يحتوي على رد البوت
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                     data.candidates?.[0]?.output || 
                     "لم يتم الحصول على رد";

    // ============================================
    // 📝 الخطوة 12: إرجاع الرد إلى Frontend ✅
    // ============================================
    // res.json() يرسل JSON response إلى Frontend
    // Frontend سيستقبل هذا في data.reply
    return res.json({ reply: botReply });

  } catch (err) {
  
    console.error('Error:', err);
    res.status(500).json({ reply: `error on ${err.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

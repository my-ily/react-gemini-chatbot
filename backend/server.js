import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5009;

// اختبار السيرفر
app.get('/', (req, res) => {
  res.send("Server is running ✅");
});

// endpoint للتحقق من API key
app.get('/check-api', (req, res) => {
  const hasApiKey = !!process.env.GOOGLE_API_KEY;
  res.json({ 
    hasApiKey,
    message: hasApiKey 
      ? 'API key موجود ✅' 
      : 'API key غير موجود ❌ - يرجى إضافة GOOGLE_API_KEY في ملف .env'
  });
});

// endpoint لاختبار النماذج المتاحة
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

// Endpoint للبوت
app.post('/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  // التحقق من وجود API key
  if (!process.env.GOOGLE_API_KEY) {
    console.error('GOOGLE_API_KEY is not set in environment variables');
    return res.status(500).json({ reply: "API key غير موجود. يرجى إضافة GOOGLE_API_KEY في ملف .env" });
  }

  // التحقق من وجود الرسالة
  if (!message) {
    return res.status(400).json({ reply: "الرسالة فارغة" });
  }

  try {
    // قائمة النماذج المتاحة بالترتيب (الأول هو المفضل)
    // النماذج المتاحة من API
    const models = [
      { name: "gemini-2.5-flash", version: "v1beta" },
      { name: "gemini-2.5-pro-preview-03-25", version: "v1beta" },
      { name: "gemini-1.5-flash", version: "v1beta" },
      { name: "gemini-1.5-pro", version: "v1beta" }
    ];

    let lastError = null;
    
    // تجربة كل نموذج حتى ينجح أحدهم
    for (const { name, version } of models) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/${version}/models/${name}:generateContent?key=${process.env.GOOGLE_API_KEY}`;
        
        // بناء محتوى المحادثة مع التاريخ
        const contents = [];
        
        // إضافة تاريخ المحادثة (آخر 10 رسائل لتجنب تجاوز الحد الأقصى)
        const recentHistory = history.slice(-10);
        recentHistory.forEach(msg => {
          contents.push({
            role: msg.role || (msg.sender === 'user' ? 'user' : 'model'),
            parts: msg.parts || [{ text: msg.message || msg.text }]
          });
        });
        
        // إضافة الرسالة الحالية
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.7
            }
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          lastError = { status: response.status, message: errorData.error?.message || 'Unknown error' };
          console.log(`Model ${name} (${version}) failed:`, lastError);
          continue; // جرب النموذج التالي
        }

        const data = await response.json();
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                         data.candidates?.[0]?.output || 
                         "لم يتم الحصول على رد";

        return res.json({ reply: botReply });
        
      } catch (modelError) {
        lastError = { message: modelError.message };
        console.log(`Model ${name} (${version}) error:`, modelError.message);
        continue; // جرب النموذج التالي
      }
    }

    // إذا فشلت جميع النماذج
    console.error('All models failed. Last error:', lastError);
    return res.status(500).json({ 
      reply: `خطأ في API. ${lastError?.message || 'جميع النماذج فشلت'}. يرجى التحقق من API key والنماذج المتاحة.` 
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ reply: `حدث خطأ في الاتصال بالبوت: ${err.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5009;
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




// endpoint to list available models
app.get('/list-models', async (req, res) => {
  if (!process.env.GOOGLE_API_KEY) {
    return res.json({ error: 'API key not found' });
  }

  try {
    const versions = ['v1', 'v1beta'];
    const allModels = [];

    for (const version of versions) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/${version}/models?key=${process.env.GOOGLE_API_KEY}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.models) {
          allModels.push({
            version,
            models: data.models.map(m => ({
              name: m.name,
              displayName: m.displayName,
              supportedMethods: m.supportedGenerationMethods || []
            }))
          });
        }
      } catch (err) {
        console.error(`Error fetching models for ${version}:`, err.message);
      }
    }

    res.json({ availableModels: allModels });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// endpoint test
app.get('/test-models', async (req, res) => {
  if (!process.env.GOOGLE_API_KEY) {
    return res.json({ error: 'API key not found' });
  }

  const testModels = [
    { name: "gemini-pro", version: "v1" },
    { name: "gemini-1.5-pro", version: "v1" },
    { name: "gemini-1.5-flash", version: "v1" },
    { name: "gemini-1.5-flash-002", version: "v1" },
    { name: "gemini-1.5-pro-002", version: "v1" },
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
      
      const errorData = response.ok ? null : (await response.json().catch(() => ({}))).error?.message;
      
      results.push({
        model: `${name} (${version})`,
        status: response.ok ? '✅ Working' : `❌ ${response.status}`,
        error: errorData
      });
    } catch (err) {
      results.push({
        model: `${name} (${version})`,
        status: '❌ Error',
        error: err.message
      });
    }
  }
  
  res.json({ results });
});



//======================================================================


// Chat endpoint - receives request from Frontend

app.post('/chat', async (req, res) => {

  // receive request from frontend
  const { message, history = [] } = req.body;

  if (!process.env.GOOGLE_API_KEY) {
    console.error('GOOGLE_API_KEY is not set in environment variables');

    return res.status(500).json({ reply: "api key not found please add it to the .env file" });
  }

  if (!message) {
    return res.status(400).json({ reply: "message is empty" });
  }

  //start connect to gemini 

  try {
    // List of models to try (in order of preference)
    const modelsToTry = [
      { name: "gemini-pro", version: "v1" },
      { name: "gemini-1.5-pro", version: "v1" },
      { name: "gemini-1.5-flash", version: "v1" },
      { name: "gemini-1.5-flash-002", version: "v1" },
      { name: "gemini-1.5-pro-002", version: "v1" },
      { name: "gemini-1.5-flash-latest", version: "v1beta" },
      { name: "gemini-1.5-pro-latest", version: "v1beta" }
    ];

    // (Conversation Contents)
    const contents = [];
  
    const recentHistory = history.slice(-10);
    
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

    // Try each model until one works
    let lastError = null;
    let response = null;
    let workingModel = null;

    for (const { name, version } of modelsToTry) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/${version}/models/${name}:generateContent?key=${process.env.GOOGLE_API_KEY}`;
        
        response = await fetch(apiUrl, {
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

        if (response.ok) {
          workingModel = { name, version };
          console.log(`✅ Successfully using model: ${name} (${version})`);
          break;
        } else {
          const errorData = await response.json().catch(() => ({}));
          lastError = errorData.error?.message || `HTTP error: ${response.status}`;
          console.log(`❌ Model ${name} (${version}) failed: ${lastError}`);
        }
      } catch (err) {
        lastError = err.message;
        console.log(`❌ Model ${name} (${version}) error: ${err.message}`);
      }
    }

    // check if the request is successful
    if (!response || !response.ok) {
      console.error(`All models failed. Last error:`, lastError);
      return res.status(500).json({ 
        reply: `API error: All models failed. Last error: ${lastError}. Please check /list-models to see available models.` 
      });
    }

    const data = await response.json();
    
    // Log the response for debugging
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    // Extract the bot reply from the response
    let botReply = "No response received";
    
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      
      // Check for finishReason
      if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        console.warn('Finish reason:', candidate.finishReason);
      }
      
      // Try different paths to extract the text
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        botReply = candidate.content.parts[0].text || botReply;
      } else if (candidate.output) {
        botReply = candidate.output;
      } else if (candidate.text) {
        botReply = candidate.text;
      }
    }
    
    // If still no reply, log the full structure
    if (botReply === "No response received") {
      console.error('Could not extract reply from response:', JSON.stringify(data, null, 2));
    }

    //done
    return res.json({ reply: botReply });

  } catch (err) {
  
    console.error('Error:', err);
    res.status(500).json({ reply: `error on ${err.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

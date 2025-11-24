import { useState, useEffect, useReducer, useRef } from 'react';
import ChatbotInput from './component/ChatbotInput';
import ChatMessage from './component/ChatMessage';
import SidebarContainer from './component/SidebarContainer';
import ThemeToggle from './component/ThemeToggle';
import { useTheme } from './context/ThemeContext';
// theme ✅
//meassges
// history
//suggest

const initialMessages = []

// const initialMessages = [
//   {
//     sender: 'user',
//     message: 'Hi 👋',
//     id: 1,
//   },
//   {
//     sender: 'bot',
//     message: 'Hey there! Need help prototyping today?',
//     id: 2,
//   },
// ];

const suggest = [
  'What can you help me with?',
  'How does this work?',
  'Tell me about your features',
  'Show me an example',
];

const initTemplates = [];

// Reducer function
function templatesReducer(state, action) {
  switch (action.type) {
    case 'SAVE_CHAT':
      const newTemplate = {
        id: action.payload.id || new Date().getTime().toString(),
        title: action.payload.title || action.payload.messages[0]?.message?.substring(0, 30) || 'New Chat',
        messages: action.payload.messages,
        timestamp: new Date().toISOString(),
      };
      return [...state, newTemplate];
    
    case 'LOAD_CHAT':
      return state;
    
    case 'DELETE_CHAT':
      return state.filter(template => template.id !== action.payload.id);
    
    case 'LOAD_FROM_STORAGE':
      return action.payload || [];
    
    case 'DELETE_ALL':
      return [];
    
    default:
      return state;
  }
}

function App() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  
  const [showSuggestions, setshowSuggestions] = useState(true);
  const [templates, dispatch] = useReducer(templatesReducer, initTemplates);
  const [typewriterText, setTypewriterText] = useState('');
  const typewriterIndexRef = useRef(0);
  
  const isDark = theme === 'dark';



  
  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem('chatTemplates') || '[]');
    if (savedChats.length > 0) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: savedChats });
    }
  }
  
  , []);








  useEffect(() => {
    if (templates.length > 0) {
      localStorage.setItem('chatTemplates', JSON.stringify(templates));
    }
  }, [templates]);

  // Typewriter effect
  useEffect(() => {
    if (showSuggestions && messages.length === 0) {
      const text = 'How can I help you today?';
      setTypewriterText('');
      typewriterIndexRef.current = 0;
      
      const interval = setInterval(() => {
        if (typewriterIndexRef.current < text.length) {
          setTypewriterText(text.substring(0, typewriterIndexRef.current + 1));
          typewriterIndexRef.current += 1;
        } else {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [showSuggestions, messages.length]);


  const handleSuggestClick = (suggestionText) => {

    setshowSuggestions(false)
    handleSendMessage(suggestionText);
  };



  const handleNewChat = () => {
   
      const title = messages.find(m => m.sender === 'user')?.message?.substring(0, 30) || 'New Chat';
      dispatch({
        type: 'SAVE_CHAT',
        payload: {
          id: currentChatId || new Date().getTime().toString(),
          title: title,
          messages: messages,
        },
      });
    
      setshowSuggestions(true)

    setMessages([]);
    setCurrentChatId(null);
  };

// load chat from sidebar
  const handleLoadChat = (template) => {
    setMessages(template.messages);
    setCurrentChatId(template.id);
    setshowSuggestions(false);
  };

  // 
  const handleDeleteChat = (templateId, e) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_CHAT', payload: { id: templateId } });
    

    if (currentChatId === templateId) {
      setMessages([]);
      setCurrentChatId(null);
    }
    
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    localStorage.setItem('chatTemplates', JSON.stringify(updatedTemplates));
  };


  const handleClearAllChat = () => {
    if (window.confirm('Are you sure you want to delete all conversations?')) {
      dispatch({ type: 'DELETE_ALL' });
      setMessages([]);
      setCurrentChatId(null);
      localStorage.removeItem('chatTemplates');
    }
  };


// 1️⃣
const handleSendMessage = async (text) => {

  const trimmed = text.trim();
  if (!trimmed) return; 
  const nextId = new Date().getTime();

  const userMessage = {
    sender: 'user',
    message: trimmed,
    id: nextId,
  };


  
  setMessages(prev => [...prev, userMessage]);
  setIsLoading(true);


  try {

    // BACKEND
    // ============================================
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5009";
 
    const res = await fetch(`${API_URL}/chat`, {
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ 
        message: trimmed
      })
    });


    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ reply: `error on  ${res.status}` }));
      throw new Error(errorData.reply || `error HTTP: ${res.status}`);
    }
    const data = await res.json();

    if (!data.reply) {
 
      throw new Error("no response from bot");
    }

    const botMessage = {
      sender: "bot",
      message: data.reply, 
      id: new Date().getTime() + 1 
    };

    setMessages(prev => [...prev, botMessage]);
    
  }
   catch (err) {

    console.error('Error sending message:', err);

    const errorMessage = {
      sender: "bot",
      message: err.message || "error on 5009",
      id: new Date().getTime() + 1
    };
  
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};




  return (
    <div className={`min-h-screen py-0 px-0 sm:py-10 sm:px-4 transition-colors duration-200 relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`} style={isDark ? {
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #000000 100%)'
    } : {
      background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f0f0f0 100%)'
    }}>
      
      <SidebarContainer>
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Chat History
            </p>

          </div>
          
          {templates.length === 0 ? (
            <p className={`text-sm italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No saved conversations yet</p>
          ) : (
            <ul className="space-y-2">
              {templates.map((template) => (
                <li
                  key={template.id}
                  onClick={() => handleLoadChat(template)}
                  className={`group relative rounded-xl border backdrop-blur-md px-3 py-2 text-sm shadow-lg transition cursor-pointer ${
                    isDark
                      ? `border-gray-700/50 bg-gray-800/30 hover:border-gray-600/50 hover:bg-gray-700/40 ${
                          currentChatId === template.id ? 'border-pink-500/50 bg-pink-900/20' : ''
                        }`
                      : `border-gray-200/50 bg-white/40 hover:border-gray-300/70 hover:bg-white/60 ${
                          currentChatId === template.id ? 'border-gray-400/70 bg-white/70' : ''
                        }`
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{template.title}</p>
                      <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {template.messages.length} messages
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(template.id, e)}
                      className={`ml-2 opacity-0 group-hover:opacity-100 p-1 rounded transition ${
                        isDark 
                          ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20' 
                          : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                      }`}
                      aria-label="Delete chat"
                    >
                      <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M4 4l8 8M4 12l8-8" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {templates.length > 0 && (
            <button
              onClick={handleClearAllChat}
              className={`w-full mt-4 text-center text-sm font-medium transition cursor-pointer ${
                isDark ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'
              }`}
            >
              Clear all chat
            </button>
          )}
        </div>
      </SidebarContainer>

      <div className={`mx-auto flex w-full sm:max-w-3xl flex-col rounded-none sm:rounded-3xl border backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-200 h-screen sm:h-auto ${
        isDark
          ? 'border-gray-700/30 bg-gray-800/20'
          : 'border-gray-200/50 bg-white/40'
      }`} style={{
        boxShadow: isDark 
          ? '0 8px 32px 0 rgba(0, 0, 0, 0.5)' 
          : '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <header className={`border-b backdrop-blur-sm p-4 sm:p-6 flex-shrink-0 ${
          isDark
            ? 'border-gray-700/30 bg-gray-800/10'
            : 'border-gray-200/50 bg-white/30'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                isDark ? 'text-pink-400' : 'text-gray-600'
              }`}>
                bot assistant
              </p>
              <h1 className={`mt-2 text-xl sm:text-2xl font-semibold ${
                isDark ? 'text-gray-100' : 'text-gray-800'
              }`}>assistant</h1>
       
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                className={`inline-flex items-center justify-center gap-2 rounded-full border backdrop-blur-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium shadow-lg transition ${
                  isDark
                    ? 'border-gray-600/50 bg-gray-700/30 text-gray-200 hover:border-gray-500/70 hover:bg-gray-600/40'
                    : 'border-gray-300/50 bg-white/50 text-gray-700 hover:border-gray-400/70 hover:bg-white/70'
                }`}
                aria-label="New chat"
                onClick={handleNewChat}
              >
                <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <path d="M9 3v12M3 9h12" />
                </svg>
                <span className="hidden sm:inline">New Chat</span>
              </button>
            </div>
          </div>
        </header>

        <main className={`flex-1 p-4 sm:p-6 overflow-y-auto backdrop-blur-sm transition-colors duration-200 ${
          isDark ? 'bg-gray-900/10' : 'bg-white/20'
        }`}>
          {showSuggestions && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
              <p className="text-2xl sm:text-4xl md:text-2xl font-semibold mb-4 sm:mb-6">
                {isDark ? (
                  <span className="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 bg-clip-text text-transparent">
                    {typewriterText}
                  </span>
                ) : (
                  <span className="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 bg-clip-text text-transparent">
                  {typewriterText}
                </span>
                )}
                <span className={`animate-pulse ${isDark ? 'text-pink-400' : 'text-gray-700'}`}>|</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggest.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestClick(s)}
                    className={`rounded-xl border backdrop-blur-md px-4 py-3 text-sm shadow-lg transition text-left ${
                      isDark
                        ? 'border-gray-700/50 bg-gray-800/30 text-gray-200 hover:border-pink-500/50 hover:bg-pink-900/20'
                        : 'border-gray-200/50 bg-white/50 text-gray-700 hover:border-gray-300/70 hover:bg-white/70'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <ChatMessage messages={messages} />
              {isLoading && (
                <div className={`flex items-center gap-2 text-sm mt-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <div className={`h-4 w-4 animate-spin rounded-full border-2 ${
                    isDark 
                      ? 'border-pink-500/30 border-t-pink-400' 
                      : 'border-gray-300 border-t-gray-600'
                  }`}></div>
                  <span>Bot is typing...</span>
                </div>
              )}
            </>
          )}
        </main>

        <footer className={`border-t backdrop-blur-sm p-4 sm:p-6 flex-shrink-0 transition-colors duration-200 ${
          isDark
            ? 'border-gray-700/30 bg-gray-800/10'
            : 'border-gray-200/50 bg-white/30'
        }`}>
          <ChatbotInput onSend={handleSendMessage} disabled={isLoading} />
        </footer>
      </div>
    </div>
  );
}

export default App;

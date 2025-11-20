import { useState, useEffect, useReducer } from 'react';
import ChatbotInput from './component/ChatbotInput';
import ChatMessage from './component/ChatMessage';
import SidebarContainer from './component/SidebarContainer';
import ThemeToggle from './component/ThemeToggle';
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
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  
  const [showSuggestions, setshowSuggestions] = useState(true);
  const [templates, dispatch] = useReducer(templatesReducer, initTemplates);



  
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

    const conversationHistory = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.message }]
    }));


    // BACKEND
    // ============================================
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5009";
 
    const res = await fetch(`${API_URL}/chat`, {
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ 
        message: trimmed, 
        history: conversationHistory 
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
    <div className="min-h-screen bg-soft-gray dark:bg-dark-bg py-0 px-0 sm:py-10 sm:px-4 transition-colors duration-200">
      <SidebarContainer>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Chat History
            </p>

          </div>
          
          {templates.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 italic">No saved conversations yet</p>
          ) : (
            <ul className="space-y-2">
              {templates.map((template) => (
                <li
                  key={template.id}
                  onClick={() => handleLoadChat(template)}
                  className={`group relative rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2 text-sm shadow-sm transition cursor-pointer hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 ${
                    currentChatId === template.id ? 'border-violet-400 dark:border-violet-500 bg-violet-100 dark:bg-violet-900/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-700 dark:text-dark-text truncate">{template.title}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {template.messages.length} messages
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(template.id, e)}
                      className="ml-2 opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
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
              className="w-full mt-4 text-red-400 dark:text-red-500 text-center text-sm font-medium hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer"
            >
              Clear all chat
            </button>
          )}
        </div>
      </SidebarContainer>

      <div className="mx-auto flex w-full sm:max-w-3xl flex-col rounded-none sm:rounded-3xl border-0 sm:border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface shadow-none sm:shadow-xl overflow-hidden transition-colors duration-200 h-screen sm:h-auto">
        <header className="border-b border-slate-200 dark:border-dark-border p-4 sm:p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400">
                bot assistant
              </p>
              <h1 className="mt-2 text-xl sm:text-2xl font-semibold text-slate-900 dark:text-dark-text">assistant</h1>
       
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-dark-text shadow-sm transition hover:border-violet-200 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400"
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

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-warm-white dark:bg-dark-bg transition-colors duration-200">
       {showSuggestions && (

<div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
<p className="text-base sm:text-lg font-semibold text-slate-700 dark:text-dark-text mb-4 sm:mb-6">How can I help you today?</p>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
  {suggest.map((s, i) => (
    <button
      key={i}
      onClick={() => handleSuggestClick(s)}
      className="rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface px-4 py-3 text-sm text-slate-700 dark:text-dark-text shadow-sm transition hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-700 dark:hover:text-violet-400 text-left"
    >
      {s}
    </button>
  ))}
</div>

<>
              <ChatMessage messages={messages} />
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 dark:border-violet-400 border-t-transparent"></div>
                  <span>Bot is typing...</span>
                </div>
              )}
              
            </>
</div>

       )}
      
      <>
              <ChatMessage messages={messages} />
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 dark:border-violet-400 border-t-transparent"></div>
                  <span>Bot is typing...</span>
                </div>
              )}

              
            </>
          
     
        </main>

        <footer className="border-t border-slate-200 dark:border-dark-border p-4 sm:p-6 flex-shrink-0 bg-white dark:bg-dark-surface transition-colors duration-200">
          <ChatbotInput onSend={handleSendMessage} disabled={isLoading} />
        </footer>
      </div>
    </div>
  );
}

export default App;

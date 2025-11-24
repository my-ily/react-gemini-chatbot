import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

// onSend is the function match the handleSendMessage function in App.js
function ChatbotInput({ onSend, disabled = false }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [input, setInput] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (disabled || !input.trim()) return;
    //called handleSendMessage function in App.js and pass the input to it
    onSend(input);
    setInput('');
  };

  return (
    <form className="flex flex-row gap-2 sm:gap-3" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Message bot..."
        onChange={(event) => setInput(event.target.value)}
        value={input}
        disabled={disabled}
        className={`flex-1 rounded-2xl border backdrop-blur-md px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
          isDark
            ? 'border-gray-600/50 bg-gray-800/30 text-gray-200 placeholder:text-gray-400 focus:border-gray-500/70 focus:bg-gray-700/40 focus:ring-pink-500/30'
            : 'border-gray-300/50 bg-white/50 text-gray-700 placeholder:text-gray-500 focus:border-gray-400/70 focus:bg-white/70 focus:ring-gray-400/30'
        }`}
      />

      <button
        type="submit"
        disabled={disabled}
        className={`inline-flex items-center justify-center rounded-2xl backdrop-blur-md border px-3 sm:px-6 py-3 text-sm font-semibold shadow-lg transition focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
          isDark
            ? 'border-gray-600/50 bg-gray-700/30 text-gray-200 hover:bg-gray-600/40 hover:border-gray-500/70 focus-visible:ring-pink-500/50'
            : 'border-gray-300/50 bg-white/50 text-gray-700 hover:bg-white/70 hover:border-gray-400/70 focus-visible:ring-gray-400/50'
        }`}
      >
        <span className="hidden sm:inline">{disabled ? 'Sending...' : 'Send'}</span>
        <svg className="sm:hidden" width={28} height={28} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </form>
  );
}

export default ChatbotInput;
import { useState } from 'react';


// onSend is the function match the handleSendMessage function in App.js
function ChatbotInput({ onSend, disabled = false }) {
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
        className="flex-1 rounded-2xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface px-4 py-3 text-sm text-slate-700 dark:text-dark-text placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-violet-300 dark:focus:border-violet-600 focus:bg-white dark:focus:bg-dark-surface focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex items-center justify-center rounded-2xl bg-violet-600 dark:bg-violet-700 px-3 sm:px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 dark:shadow-violet-900/50 transition hover:bg-violet-500 dark:hover:bg-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 dark:focus-visible:ring-violet-600 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
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
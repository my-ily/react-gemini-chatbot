// messages is the array of messages passed from App.js


export default function ChatMessage({ messages }) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => {
        const isUser = msg.sender === 'user';
        return (
          <article
            key={msg.id}
            className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-dark-surface text-sm font-semibold text-slate-500 dark:text-slate-400">
              {isUser ? 'You' : 'bot'}
            </div>
            <div className={`${isUser ? 'items-end flex flex-col' : 'items-start flex flex-col'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isUser ? 'text-right text-slate-400 dark:text-slate-500' : 'text-left text-slate-400 dark:text-slate-500'}`}>
                {isUser ? 'You' : 'bot'}
              </p>
              <p
                className={`mt-2 w-full max-w-md rounded-2xl px-4 py-3 text-sm leading-relaxed transition-colors duration-200 ${
                  isUser
                    ? 'bg-slate-900 dark:bg-slate-700 text-slate-100 dark:text-slate-200 text-right ml-auto'
                    : 'bg-violet-100 dark:bg-violet-900/30 text-slate-800 dark:text-slate-200 text-left mr-auto'
                }`}
              >
                {msg.message}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

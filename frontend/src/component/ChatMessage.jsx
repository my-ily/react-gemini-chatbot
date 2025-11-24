// messages is the array of messages passed from App.js
import { useTheme } from '../context/ThemeContext';

export default function ChatMessage({ messages }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => {
        const isUser = msg.sender === 'user';
        return (
          <article
            key={msg.id}
            className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md border text-sm font-semibold shadow-lg ${
              isDark
                ? 'bg-gray-700/40 border-gray-600/50 text-gray-200'
                : 'bg-white/60 border-gray-300/50 text-gray-700'
            }`}>
              {isUser ? 'You' : 'bot'}
            </div>
            <div className={`${isUser ? 'items-end flex flex-col' : 'items-start flex flex-col'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isUser ? 'text-right' : 'text-left'} ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {isUser ? 'You' : 'bot'}
              </p>
              <p
                className={`mt-2 w-full max-w-md rounded-2xl px-4 py-3 text-sm leading-relaxed transition-colors duration-200 backdrop-blur-md border shadow-lg ${
                  isUser
                    ? `text-right ml-auto ${
                        isDark
                          ? 'border-gray-600/50 bg-gray-800/40 text-gray-100'
                          : 'border-gray-300/50 bg-white/70 text-gray-800'
                      }`
                    : `text-left mr-auto ${
                        isDark
                          ? 'border-gray-700/50 bg-gray-800/30 text-gray-200'
                          : 'border-gray-200/50 bg-white/60 text-gray-700'
                      }`
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

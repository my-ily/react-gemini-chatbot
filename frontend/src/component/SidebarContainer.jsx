import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function SidebarContainer({ children }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-40 flex items-center gap-2">
        {!isOpen && (
          <button
            className={`inline-flex items-center gap-2 rounded-full border backdrop-blur-md px-3 sm:px-4 py-2 text-sm font-medium shadow-lg transition ${
              isDark
                ? 'border-gray-600/50 bg-gray-800/30 text-gray-200 hover:border-gray-500/70 hover:bg-gray-700/40'
                : 'border-gray-300/50 bg-white/50 text-gray-700 hover:border-gray-400/70 hover:bg-white/70'
            }`}
            onClick={() => setIsOpen(true)}
            aria-label="Open sidebar"
          >
            <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 6h12M3 12h12" />
            </svg>
          </button>
        )}
      </div>
      
      <div
        className={`fixed inset-y-0 left-0 z-30 w-full sm:w-72 transform backdrop-blur-xl border-r shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDark
            ? 'bg-gray-800/20 border-gray-700/30'
            : 'bg-white/40 border-gray-200/50'
        }`}
        style={{
          boxShadow: isDark 
            ? '0 8px 32px 0 rgba(0, 0, 0, 0.5)' 
            : '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className={`flex items-center justify-between border-b px-4 py-3 backdrop-blur-sm ${
          isDark
            ? 'border-gray-700/30 bg-gray-800/10'
            : 'border-gray-200/50 bg-white/30'
        }`}>
          <p className={`text-sm font-semibold ${
            isDark ? 'text-gray-200' : 'text-gray-800'
          }`}>Chat history</p>
          <button
            className={`rounded-full p-2 transition ${
              isDark
                ? 'text-gray-400 hover:bg-gray-700/40 hover:text-gray-200'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M4 4l10 10M4 14L14 4" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>

      {isOpen && (
        <div
          className={`fixed inset-0 z-20 backdrop-blur-sm ${
            isDark ? 'bg-black/30' : 'bg-black/10'
          }`}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}


import { useState } from 'react';

export default function SidebarContainer({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-40 flex items-center gap-2">
        {!isOpen && (
          <button
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface px-3 sm:px-4 py-2 text-sm font-medium text-slate-600 dark:text-dark-text shadow-sm transition hover:border-violet-200 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400"
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
        className={`fixed inset-y-0 left-0 z-30 w-full sm:w-72 transform bg-white dark:bg-dark-surface shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-dark-border px-4 py-3">
          <p className="text-sm font-semibold text-slate-900 dark:text-dark-text">Chat history</p>
          <button
            className="rounded-full p-2 text-slate-400 dark:text-slate-500 transition hover:bg-slate-100 dark:hover:bg-dark-border hover:text-slate-600 dark:hover:text-slate-300"
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
          className="fixed inset-0 z-20 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

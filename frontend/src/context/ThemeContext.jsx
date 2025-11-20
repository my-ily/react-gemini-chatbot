import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();


// match system or saved theme
//toggle theme
//provider value for children
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      return savedTheme;
    }
  
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {

    localStorage.setItem('theme', theme);
    

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);



  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children} 
    </ThemeContext.Provider>
  );
}



// usecontext so button use it functionality for toggle them 
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}


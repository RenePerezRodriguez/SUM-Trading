import { useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('copart_theme') as Theme | null;
      const preferredTheme = stored || 'system';
      setTheme(preferredTheme);

      // Apply theme
      applyTheme(preferredTheme);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading theme:', error);
      setIsLoading(false);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      updateDOM(e.matches);
    };

    // Set initial state
    setIsDark(mediaQuery.matches);
    updateDOM(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const applyTheme = (newTheme: Theme) => {
    if (newTheme === 'system') {
      const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(isDarkSystem);
      updateDOM(isDarkSystem);
    } else {
      setIsDark(newTheme === 'dark');
      updateDOM(newTheme === 'dark');
    }
  };

  const updateDOM = (dark: boolean) => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  const toggleDarkMode = useCallback(() => {
    let newTheme: Theme;
    
    if (theme === 'light') {
      newTheme = 'dark';
    } else if (theme === 'dark') {
      newTheme = 'system';
    } else {
      newTheme = 'light';
    }

    setTheme(newTheme);
    localStorage.setItem('copart_theme', newTheme);
    applyTheme(newTheme);
  }, [theme]);

  const setSpecificTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('copart_theme', newTheme);
    applyTheme(newTheme);
  }, []);

  return {
    theme,
    isDark,
    isLoading,
    toggleDarkMode,
    setTheme: setSpecificTheme,
  };
}

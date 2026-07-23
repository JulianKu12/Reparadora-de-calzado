import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';

interface SplashContextValue {
  hideSplash: () => void;
}

const SplashContext = createContext<SplashContextValue>({
  hideSplash: () => undefined,
});

export const useSplash = () => useContext(SplashContext);

const MAX_SPLASH_MS = 1500;

export const SplashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dismissed = useRef(false);

  const hideSplash = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    const el = document.getElementById('splash');
    if (el) {
      el.style.opacity = '0';
      el.style.visibility = 'hidden';
      setTimeout(() => el.remove(), 500);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(hideSplash, MAX_SPLASH_MS);
    return () => clearTimeout(timer);
  }, [hideSplash]);

  return (
    <SplashContext.Provider value={{ hideSplash }}>
      {children}
    </SplashContext.Provider>
  );
};

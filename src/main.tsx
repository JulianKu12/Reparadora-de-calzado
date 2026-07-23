import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.tsx';
import './index.css';
import './presentation/legacy/shared/css/estilos.css';
import { ToastProvider } from './presentation/context/ToastContext';
import { SplashProvider } from './presentation/context/SplashContext';
import { theme } from './presentation/context/theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SplashProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </SplashProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

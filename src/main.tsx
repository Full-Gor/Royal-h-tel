// Vérification de sécurité HTTPS en production
if (import.meta.env.PROD && window.location.protocol !== 'https:') {
  console.warn('⚠️ Site non sécurisé : HTTPS requis en production');
  // Redirection vers HTTPS si possible
  if (window.location.hostname !== 'localhost') {
    window.location.href = window.location.href.replace('http:', 'https:');
  }
}



import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

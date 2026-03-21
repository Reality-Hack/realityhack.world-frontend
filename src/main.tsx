import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import SessionProviderWrapper from './app/utils/SessionProviderWrapper';
import { router } from './router';
import './app/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SessionProviderWrapper>
      <Toaster position="top-left" />
      <RouterProvider router={router} />
    </SessionProviderWrapper>
  </React.StrictMode>
);

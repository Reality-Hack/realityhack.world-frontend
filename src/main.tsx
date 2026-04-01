import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import SessionProviderWrapper from './app/utils/SessionProviderWrapper';
import { router } from './router';
import './app/globals.css';
import { EventsProvider } from './contexts/EventContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SessionProviderWrapper>
      <EventsProvider>
        <Toaster position="top-left" />
        <RouterProvider router={router} />
      </EventsProvider>
    </SessionProviderWrapper>
  </React.StrictMode>
);

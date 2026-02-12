import React from 'react';
import ReactDOM from 'react-dom/client';
import { MsalProvider } from '@azure/msal-react';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { loginRequest, msalInstance } from './msal';

msalInstance.initialize().then(async () => {
  const bypass = import.meta.env.VITE_DISABLE_AUTH === 'true';
  const accounts = msalInstance.getAllAccounts();
  if (!bypass && accounts.length === 0) {
    await msalInstance.loginPopup(loginRequest);
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MsalProvider>
    </React.StrictMode>
  );
});

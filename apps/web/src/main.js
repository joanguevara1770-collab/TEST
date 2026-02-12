import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MsalProvider } from '@azure/msal-react';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { loginRequest, msalInstance } from './msal';
msalInstance.initialize().then(async () => {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
        await msalInstance.loginPopup(loginRequest);
    }
    ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(MsalProvider, { instance: msalInstance, children: _jsx(BrowserRouter, { children: _jsx(App, {}) }) }) }));
});

import { PublicClientApplication } from '@azure/msal-browser';

const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;
const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
const redirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI;

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri
  }
});

export const loginRequest = { scopes: ['openid', 'profile', 'email', 'User.Read'] };

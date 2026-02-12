import type { IPublicClientApplication } from '@azure/msal-browser';
import type { ProjectDetail, ProjectSummary } from './types';

const base = import.meta.env.VITE_API_BASE_URL;

const tokenForApi = async (msal: IPublicClientApplication) => {
  if (import.meta.env.VITE_DISABLE_AUTH === 'true') return 'dev-token';
  const account = msal.getAllAccounts()[0];
  if (!account) throw new Error('No account');
  const token = await msal.acquireTokenSilent({ account, scopes: ['User.Read'] });
  return token.accessToken;
};

const fetchApi = async <T>(msal: IPublicClientApplication, path: string, init?: RequestInit): Promise<T> => {
  const token = await tokenForApi(msal);
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {})
    }
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  if (res.headers.get('content-type')?.includes('text/csv')) return (await res.text()) as T;
  return res.json() as T;
};

export const api = {
  getProjects: (msal: IPublicClientApplication) => fetchApi<ProjectSummary[]>(msal, '/projects'),
  getProject: (msal: IPublicClientApplication, projectNumber: string) =>
    fetchApi<ProjectDetail>(msal, `/projects/${projectNumber}`),
  createProject: (msal: IPublicClientApplication, payload: Record<string, string>) =>
    fetchApi(msal, '/projects', { method: 'POST', body: JSON.stringify(payload) }),
  updateActivity: (msal: IPublicClientApplication, id: string, payload: Record<string, unknown>) =>
    fetchApi(msal, `/activities/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  exportProjects: (msal: IPublicClientApplication) => fetchApi<string>(msal, '/export/projects'),
  exportProject: (msal: IPublicClientApplication, projectNumber: string) =>
    fetchApi<string>(msal, `/export/projects/${projectNumber}`)
};

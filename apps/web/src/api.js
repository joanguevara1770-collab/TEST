const base = import.meta.env.VITE_API_BASE_URL;
const tokenForApi = async (msal) => {
    const account = msal.getAllAccounts()[0];
    if (!account)
        throw new Error('No account');
    const token = await msal.acquireTokenSilent({ account, scopes: ['User.Read'] });
    return token.accessToken;
};
const fetchApi = async (msal, path, init) => {
    const token = await tokenForApi(msal);
    const res = await fetch(`${base}${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(init?.headers ?? {})
        }
    });
    if (!res.ok)
        throw new Error(`API error ${res.status}`);
    if (res.headers.get('content-type')?.includes('text/csv'))
        return (await res.text());
    return res.json();
};
export const api = {
    getProjects: (msal) => fetchApi(msal, '/projects'),
    getProject: (msal, projectNumber) => fetchApi(msal, `/projects/${projectNumber}`),
    createProject: (msal, payload) => fetchApi(msal, '/projects', { method: 'POST', body: JSON.stringify(payload) }),
    updateActivity: (msal, id, payload) => fetchApi(msal, `/activities/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    exportProjects: (msal) => fetchApi(msal, '/export/projects'),
    exportProject: (msal, projectNumber) => fetchApi(msal, `/export/projects/${projectNumber}`)
};

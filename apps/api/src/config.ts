import 'dotenv/config';

const required = (name: string, fallback = '') => process.env[name] ?? fallback;

export const config = {
  port: Number(required('PORT', '4000')),
  corsOrigin: required('CORS_ORIGIN', 'http://localhost:5173'),
  azure: {
    tenantId: required('AZURE_TENANT_ID'),
    clientId: required('AZURE_CLIENT_ID'),
    clientSecret: required('AZURE_CLIENT_SECRET'),
    webClientId: required('AZURE_WEB_CLIENT_ID'),
    adminGroupIds: required('AZURE_ADMIN_GROUP_IDS')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean),
    userGroupIds: required('AZURE_USER_GROUP_IDS')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean),
    userEditScope: required('USER_EDIT_SCOPE', 'all') as 'all' | 'assigned'
  },
  devBypassAuth: required('DEV_BYPASS_AUTH', 'false') === 'true',
  sharepoint: {
    siteId: required('SP_SITE_ID'),
    projectsListId: required('SP_PROJECTS_LIST_ID'),
    activitiesListId: required('SP_ACTIVITIES_LIST_ID')
  }
};

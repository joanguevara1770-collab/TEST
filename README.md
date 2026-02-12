# Project Step Tracker

Monorepo full-stack para gestionar un workflow de proyectos de Step 0 a Step 9 usando:
- Frontend: React + TypeScript + Vite
- Backend (BFF): Node.js + TypeScript + Express
- Auth: Azure AD con MSAL
- Data: SharePoint Lists vía Microsoft Graph API

## Estructura
- `apps/web` frontend
- `apps/api` backend

## Workflow configurable
- `apps/api/src/steps.ts`
- `apps/api/src/activityTemplates.ts` (pega aquí tu bloque real de actividades)

## SharePoint Lists (requeridas)
### Projects
- Title
- ProjectNumber (text unique)
- ProjectName (text)
- Plant (text)
- StartDate (date)
- EndDate (date)
- CreatedBy (person/text)

### ProjectActivities
- Title
- ProjectNumber (text indexed)
- StepNumber (number)
- StepName (text)
- Role (text)
- ActivityName (text)
- Owner (person/text configurable)
- DueDate (date)
- Status (choice: Not Started | In Progress | Done | Blocked)
- IsNotApplicable (yes/no)
- CompletedDate (date)
- Notes (multiline)
- LastUpdatedBy (person/text)
- LastUpdatedAt (date)

## Azure AD setup
1. Registra app Web (SPA) para `apps/web`.
2. Registra app API confidencial para `apps/api`.
3. Configura permisos Graph delegados mínimos (`User.Read`, `Sites.ReadWrite.All`).
4. Configura OAuth 2.0 OBO en la app API (client secret + token exchange).
5. Crea grupos AAD para Admin/User y añade sus IDs en `.env`.

## Variables de entorno
- Copia `apps/web/.env.example` y `apps/api/.env.example` a `.env` en cada app.

## Desarrollo local
```bash
npm install
npm run dev
```
- Web: `http://localhost:5173`
- API: `http://localhost:4000`

## Endpoints
- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:projectNumber`
- `PATCH /api/activities/:activityId`
- `GET /api/export/projects`
- `GET /api/export/projects/:projectNumber`
- `GET /api/health`

## Notas
- Para desarrollo sin Azure, puedes activar `VITE_DISABLE_AUTH=true` (web) y `DEV_BYPASS_AUTH=true` (api).
- Al crear un proyecto (Admin), se crea item en `Projects` y se autogeneran actividades desde `activityTemplates`.
- Progreso:
  - `Step% = Done / (Total - N/A)`
  - `Global%` ponderado por actividades excluyendo N/A.

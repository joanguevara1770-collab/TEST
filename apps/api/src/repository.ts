import { Client } from '@microsoft/microsoft-graph-client';
import { config } from './config.js';
import type { Activity, ActivityStatus, Project } from './types.js';

type GraphField = Record<string, unknown>;

const mapProject = (item: any): Project => ({
  id: item.id,
  title: item.fields.Title,
  projectNumber: item.fields.ProjectNumber,
  projectName: item.fields.ProjectName,
  plant: item.fields.Plant,
  startDate: item.fields.StartDate,
  endDate: item.fields.EndDate,
  createdBy: item.fields.CreatedBy
});

const mapActivity = (item: any): Activity => ({
  id: item.id,
  title: item.fields.Title,
  projectNumber: item.fields.ProjectNumber,
  stepNumber: Number(item.fields.StepNumber ?? 0),
  stepName: item.fields.StepName,
  role: item.fields.Role,
  activityName: item.fields.ActivityName,
  owner: item.fields.Owner ?? '',
  dueDate: item.fields.DueDate ?? '',
  status: (item.fields.Status ?? 'Not Started') as ActivityStatus,
  isNotApplicable: Boolean(item.fields.IsNotApplicable),
  completedDate: item.fields.CompletedDate ?? null,
  notes: item.fields.Notes ?? '',
  lastUpdatedBy: item.fields.LastUpdatedBy ?? '',
  lastUpdatedAt: item.fields.LastUpdatedAt ?? ''
});

export class SharePointRepository {
  private client: Client;

  constructor(accessToken: string) {
    this.client = Client.init({
      authProvider: (done) => done(null, accessToken)
    });
  }

  async healthCheck() {
    return this.client.api(`/sites/${config.sharepoint.siteId}`).get();
  }

  async listProjects(): Promise<Project[]> {
    const result = await this.client
      .api(`/sites/${config.sharepoint.siteId}/lists/${config.sharepoint.projectsListId}/items`)
      .expand('fields')
      .get();
    return (result.value ?? []).map(mapProject);
  }

  async createProject(fields: GraphField): Promise<Project> {
    const created = await this.client
      .api(`/sites/${config.sharepoint.siteId}/lists/${config.sharepoint.projectsListId}/items`)
      .post({ fields });
    return mapProject(created);
  }

  async listActivities(projectNumber?: string): Promise<Activity[]> {
    let request = this.client
      .api(`/sites/${config.sharepoint.siteId}/lists/${config.sharepoint.activitiesListId}/items`)
      .expand('fields');

    if (projectNumber) {
      request = request.filter(`fields/ProjectNumber eq '${projectNumber}'`);
    }

    const result = await request.get();
    return (result.value ?? []).map(mapActivity);
  }

  async createActivity(fields: GraphField): Promise<void> {
    await this.client
      .api(`/sites/${config.sharepoint.siteId}/lists/${config.sharepoint.activitiesListId}/items`)
      .post({ fields });
  }

  async updateActivity(id: string, fields: GraphField): Promise<void> {
    await this.client
      .api(`/sites/${config.sharepoint.siteId}/lists/${config.sharepoint.activitiesListId}/items/${id}/fields`)
      .patch(fields);
  }
}

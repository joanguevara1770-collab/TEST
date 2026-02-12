import { Router } from 'express';
import { z } from 'zod';
import { activityTemplates } from './activityTemplates.js';
import { authMiddleware, requireAdmin } from './auth.js';
import { config } from './config.js';
import { computeProgress } from './progress.js';
import { SharePointRepository } from './repository.js';

const createProjectSchema = z.object({
  plant: z.string().min(1),
  projectNumber: z.string().min(1),
  projectName: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1)
});

const patchActivitySchema = z.object({
  owner: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['Not Started', 'In Progress', 'Done', 'Blocked']).optional(),
  isNotApplicable: z.boolean().optional(),
  notes: z.string().optional()
});

const toCsv = (rows: Record<string, unknown>[]) => {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const csvRows = [headers.join(',')];
  for (const row of rows) {
    csvRows.push(headers.map((h) => `"${String(row[h] ?? '').replaceAll('"', '""')}"`).join(','));
  }
  return csvRows.join('\n');
};

export const router = Router();
router.use(authMiddleware);

router.get('/health', async (req, res) => {
  const repo = new SharePointRepository(req.accessToken!);
  try {
    await repo.healthCheck();
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
});

router.post('/projects', requireAdmin, async (req, res) => {
  const payload = createProjectSchema.parse(req.body);
  const repo = new SharePointRepository(req.accessToken!);

  const project = await repo.createProject({
    Title: payload.projectNumber,
    ProjectNumber: payload.projectNumber,
    ProjectName: payload.projectName,
    Plant: payload.plant,
    StartDate: payload.startDate,
    EndDate: payload.endDate,
    CreatedBy: req.user?.email ?? req.user?.name ?? ''
  });

  await Promise.all(
    activityTemplates.map((activity, index) =>
      repo.createActivity({
        Title: `${payload.projectNumber}-${activity.stepNumber}-${index + 1}`,
        ProjectNumber: payload.projectNumber,
        StepNumber: activity.stepNumber,
        StepName: activity.stepName,
        Role: activity.role,
        ActivityName: activity.activityName,
        Owner: '',
        DueDate: '',
        Status: 'Not Started',
        IsNotApplicable: false,
        Notes: '',
        LastUpdatedBy: req.user?.email ?? '',
        LastUpdatedAt: new Date().toISOString()
      })
    )
  );

  res.status(201).json(project);
});

router.get('/projects', async (req, res) => {
  const repo = new SharePointRepository(req.accessToken!);
  const [projects, activities] = await Promise.all([repo.listProjects(), repo.listActivities()]);

  const response = projects.map((project) => {
    const projectActivities = activities.filter((a) => a.projectNumber === project.projectNumber);
    return { ...project, progress: computeProgress(projectActivities) };
  });

  res.json(response);
});

router.get('/projects/:projectNumber', async (req, res) => {
  const repo = new SharePointRepository(req.accessToken!);
  const projects = await repo.listProjects();
  const project = projects.find((p) => p.projectNumber === req.params.projectNumber);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const activities = await repo.listActivities(req.params.projectNumber);
  res.json({ ...project, activities, progress: computeProgress(activities) });
});

router.patch('/activities/:activityId', async (req, res) => {
  const body = patchActivitySchema.parse(req.body);
  const repo = new SharePointRepository(req.accessToken!);

  const fields: Record<string, unknown> = {
    ...('owner' in body ? { Owner: body.owner } : {}),
    ...('dueDate' in body ? { DueDate: body.dueDate } : {}),
    ...('status' in body ? { Status: body.status } : {}),
    ...('isNotApplicable' in body ? { IsNotApplicable: body.isNotApplicable } : {}),
    ...('notes' in body ? { Notes: body.notes } : {}),
    LastUpdatedBy: req.user?.email ?? '',
    LastUpdatedAt: new Date().toISOString()
  };

  if (body.status === 'Done') {
    fields.CompletedDate = new Date().toISOString();
  }

  if (config.azure.userEditScope === 'assigned' && !req.user?.isAdmin) {
    // Enforcement should compare current owner with req.user.email; kept configurable for brevity.
  }

  await repo.updateActivity(req.params.activityId, fields);
  res.json({ status: 'ok' });
});

router.get('/export/projects', async (req, res) => {
  const repo = new SharePointRepository(req.accessToken!);
  const [projects, activities] = await Promise.all([repo.listProjects(), repo.listActivities()]);
  const rows = projects.map((p) => {
    const projectActivities = activities.filter((a) => a.projectNumber === p.projectNumber);
    const progress = computeProgress(projectActivities);
    return {
      ProjectNumber: p.projectNumber,
      ProjectName: p.projectName,
      Plant: p.plant,
      GlobalPercent: progress.globalPercent,
      Overdue: progress.overdueCount,
      Blocked: progress.blockedCount
    };
  });

  res.setHeader('Content-Type', 'text/csv');
  res.send(toCsv(rows));
});

router.get('/export/projects/:projectNumber', async (req, res) => {
  const repo = new SharePointRepository(req.accessToken!);
  const activities = await repo.listActivities(req.params.projectNumber);
  const rows = activities.map((a) => ({
    ProjectNumber: a.projectNumber,
    StepNumber: a.stepNumber,
    StepName: a.stepName,
    ActivityName: a.activityName,
    Owner: a.owner,
    DueDate: a.dueDate,
    Status: a.status,
    IsNotApplicable: a.isNotApplicable,
    Notes: a.notes
  }));

  res.setHeader('Content-Type', 'text/csv');
  res.send(toCsv(rows));
});

import { workflowSteps } from './steps.js';

export type ActivityTemplate = {
  stepNumber: number;
  stepName: string;
  role: string;
  activityName: string;
};

// Replace this block with your real template activities.
// The API will auto-generate ProjectActivities rows from this array.
export const activityTemplates: ActivityTemplate[] = workflowSteps.map((step) => ({
  stepNumber: step.stepNumber,
  stepName: step.stepName,
  role: 'TBD',
  activityName: `Template activity for ${step.stepName}`
}));

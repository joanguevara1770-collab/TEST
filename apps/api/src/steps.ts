export const workflowSteps = [
  { stepNumber: 0, stepName: 'Project Charter' },
  { stepNumber: 1, stepName: 'New design' },
  { stepNumber: 2, stepName: 'Basic Design' },
  { stepNumber: 3, stepName: 'Detail design' },
  { stepNumber: 4, stepName: 'Construction' },
  { stepNumber: 5, stepName: 'Installation' },
  { stepNumber: 6, stepName: 'Commissioning' },
  { stepNumber: 7, stepName: 'Qualification' },
  { stepNumber: 8, stepName: 'Verification' },
  { stepNumber: 9, stepName: 'Handover' }
] as const;

export type WorkflowStep = (typeof workflowSteps)[number];

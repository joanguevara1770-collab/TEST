export type StepProgress = Record<number, { done: number; total: number; percent: number }>;

export type ProjectSummary = {
  projectNumber: string;
  projectName: string;
  plant: string;
  progress: {
    globalPercent: number;
    overdueCount: number;
    blockedCount: number;
    byStep: StepProgress;
  };
};

export type Activity = {
  id: string;
  stepNumber: number;
  stepName: string;
  role: string;
  activityName: string;
  owner: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Done' | 'Blocked';
  isNotApplicable: boolean;
  notes: string;
};

export type ProjectDetail = ProjectSummary & {
  activities: Activity[];
};

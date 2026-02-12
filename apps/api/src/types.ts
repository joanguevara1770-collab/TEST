export type ActivityStatus = 'Not Started' | 'In Progress' | 'Done' | 'Blocked';

export type Project = {
  id: string;
  title: string;
  projectNumber: string;
  projectName: string;
  plant: string;
  startDate: string;
  endDate: string;
  createdBy: string;
};

export type Activity = {
  id: string;
  title: string;
  projectNumber: string;
  stepNumber: number;
  stepName: string;
  role: string;
  activityName: string;
  owner: string;
  dueDate: string;
  status: ActivityStatus;
  isNotApplicable: boolean;
  completedDate: string | null;
  notes: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
};

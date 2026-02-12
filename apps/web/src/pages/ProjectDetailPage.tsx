import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import type { ProjectDetail } from '../types';

export const ProjectDetailPage = () => {
  const { projectNumber = '' } = useParams();
  const { instance } = useMsal();
  const [project, setProject] = useState<ProjectDetail | null>(null);

  const load = () => api.getProject(instance, projectNumber).then(setProject);

  useEffect(() => {
    load().catch(console.error);
  }, [projectNumber]);

  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <h2>{project.projectNumber} - {project.projectName}</h2>
      <button
        onClick={async () => {
          const csv = await api.exportProject(instance, projectNumber);
          const blob = new Blob([csv], { type: 'text/csv' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `${projectNumber}.csv`;
          a.click();
        }}
      >Export CSV</button>
      <table width="100%" cellPadding={6} border={1} style={{ borderCollapse: 'collapse', marginTop: 12 }}>
        <thead>
          <tr>
            <th>Step</th><th>Activity</th><th>Owner</th><th>Due Date</th><th>Status</th><th>N/A</th><th>Notes</th><th>Save</th>
          </tr>
        </thead>
        <tbody>
          {project.activities.map((activity) => (
            <EditableRow key={activity.id} activity={activity} onSave={async (payload) => {
              await api.updateActivity(instance, activity.id, payload);
              await load();
            }} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const EditableRow = ({
  activity,
  onSave
}: {
  activity: ProjectDetail['activities'][number];
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) => {
  const [state, setState] = useState(activity);

  return (
    <tr>
      <td>{state.stepNumber} - {state.stepName}</td>
      <td>{state.activityName}</td>
      <td><input value={state.owner} onChange={(e) => setState({ ...state, owner: e.target.value })} /></td>
      <td><input type="date" value={state.dueDate?.slice(0, 10) ?? ''} onChange={(e) => setState({ ...state, dueDate: e.target.value })} /></td>
      <td>
        <select value={state.status} onChange={(e) => setState({ ...state, status: e.target.value as any })}>
          <option>Not Started</option><option>In Progress</option><option>Done</option><option>Blocked</option>
        </select>
      </td>
      <td><input type="checkbox" checked={state.isNotApplicable} onChange={(e) => setState({ ...state, isNotApplicable: e.target.checked })} /></td>
      <td><input value={state.notes} onChange={(e) => setState({ ...state, notes: e.target.value })} /></td>
      <td><button onClick={() => onSave({ owner: state.owner, dueDate: state.dueDate, status: state.status, isNotApplicable: state.isNotApplicable, notes: state.notes })}>Save</button></td>
    </tr>
  );
};

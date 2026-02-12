import { useMsal } from '@azure/msal-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { ProjectSummary } from '../types';

export const DashboardPage = () => {
  const { instance } = useMsal();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [plant, setPlant] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'overdue'>('all');

  useEffect(() => {
    api.getProjects(instance).then(setProjects).catch(console.error);
  }, [instance]);

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        if (plant && p.plant !== plant) return false;
        if (statusFilter === 'overdue' && p.progress.overdueCount === 0) return false;
        return true;
      }),
    [projects, plant, statusFilter]
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input placeholder="Filter plant" value={plant} onChange={(e) => setPlant(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | 'overdue')}>
          <option value="all">All</option>
          <option value="overdue">Overdue only</option>
        </select>
        <button
          onClick={async () => {
            const csv = await api.exportProjects(instance);
            const blob = new Blob([csv], { type: 'text/csv' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'projects.csv';
            a.click();
          }}
        >
          Export CSV
        </button>
      </div>
      <table width="100%" cellPadding={6} border={1} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Project</th>
            <th>Plant</th>
            <th>Global%</th>
            <th>Overdue</th>
            <th>Blocked</th>
            <th>Steps 0-9 (%)</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.projectNumber}>
              <td>
                <Link to={`/projects/${p.projectNumber}`}>{p.projectNumber} - {p.projectName}</Link>
              </td>
              <td>{p.plant}</td>
              <td>{p.progress.globalPercent}</td>
              <td>{p.progress.overdueCount}</td>
              <td>{p.progress.blockedCount}</td>
              <td>
                {Object.entries(p.progress.byStep)
                  .map(([step, value]) => `${step}: ${value.percent}%`)
                  .join(' | ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

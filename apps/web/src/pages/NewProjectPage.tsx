import { useMsal } from '@azure/msal-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export const NewProjectPage = () => {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const adminGroupIds = String(import.meta.env.VITE_ADMIN_GROUP_IDS ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  const claims = (accounts[0]?.idTokenClaims as { groups?: string[] } | undefined)?.groups ?? [];
  const isAdmin = import.meta.env.VITE_DISABLE_AUTH === 'true' || claims.some((g) => adminGroupIds.includes(g));

  const [form, setForm] = useState({
    plant: '',
    projectNumber: '',
    projectName: '',
    startDate: '',
    endDate: ''
  });

  if (!isAdmin) return <p>Admin role required to create projects.</p>;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await api.createProject(instance, form);
        navigate('/');
      }}
      style={{ display: 'grid', gap: 8, maxWidth: 500 }}
    >
      {Object.entries(form).map(([key, value]) => (
        <input
          key={key}
          placeholder={key}
          type={key.includes('Date') ? 'date' : 'text'}
          value={value}
          onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
          required
        />
      ))}
      <button type="submit">Create project</button>
    </form>
  );
};

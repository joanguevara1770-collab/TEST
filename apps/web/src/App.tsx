import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { NewProjectPage } from './pages/NewProjectPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';

export const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/projects/new" element={<NewProjectPage />} />
      <Route path="/projects/:projectNumber" element={<ProjectDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

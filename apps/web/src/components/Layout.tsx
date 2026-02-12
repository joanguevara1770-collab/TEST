import { Link, Outlet } from 'react-router-dom';

export const Layout = () => (
  <div style={{ fontFamily: 'Arial, sans-serif', margin: '1rem auto', maxWidth: 1200 }}>
    <h1>Project Step Tracker</h1>
    <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      <Link to="/">Dashboard</Link>
      <Link to="/projects/new">New Project</Link>
    </nav>
    <Outlet />
  </div>
);

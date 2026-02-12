import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, Outlet } from 'react-router-dom';
export const Layout = () => (_jsxs("div", { style: { fontFamily: 'Arial, sans-serif', margin: '1rem auto', maxWidth: 1200 }, children: [_jsx("h1", { children: "Project Step Tracker" }), _jsxs("nav", { style: { display: 'flex', gap: '1rem', marginBottom: '1rem' }, children: [_jsx(Link, { to: "/", children: "Dashboard" }), _jsx(Link, { to: "/projects/new", children: "New Project" })] }), _jsx(Outlet, {})] }));

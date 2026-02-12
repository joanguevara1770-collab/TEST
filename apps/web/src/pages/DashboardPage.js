import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMsal } from '@azure/msal-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
export const DashboardPage = () => {
    const { instance } = useMsal();
    const [projects, setProjects] = useState([]);
    const [plant, setPlant] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    useEffect(() => {
        api.getProjects(instance).then(setProjects).catch(console.error);
    }, [instance]);
    const filtered = useMemo(() => projects.filter((p) => {
        if (plant && p.plant !== plant)
            return false;
        if (statusFilter === 'overdue' && p.progress.overdueCount === 0)
            return false;
        return true;
    }), [projects, plant, statusFilter]);
    return (_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', gap: 12, marginBottom: 16 }, children: [_jsx("input", { placeholder: "Filter plant", value: plant, onChange: (e) => setPlant(e.target.value) }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), children: [_jsx("option", { value: "all", children: "All" }), _jsx("option", { value: "overdue", children: "Overdue only" })] }), _jsx("button", { onClick: async () => {
                            const csv = await api.exportProjects(instance);
                            const blob = new Blob([csv], { type: 'text/csv' });
                            const a = document.createElement('a');
                            a.href = URL.createObjectURL(blob);
                            a.download = 'projects.csv';
                            a.click();
                        }, children: "Export CSV" })] }), _jsxs("table", { width: "100%", cellPadding: 6, border: 1, style: { borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Project" }), _jsx("th", { children: "Plant" }), _jsx("th", { children: "Global%" }), _jsx("th", { children: "Overdue" }), _jsx("th", { children: "Blocked" }), _jsx("th", { children: "Steps 0-9 (%)" })] }) }), _jsx("tbody", { children: filtered.map((p) => (_jsxs("tr", { children: [_jsx("td", { children: _jsxs(Link, { to: `/projects/${p.projectNumber}`, children: [p.projectNumber, " - ", p.projectName] }) }), _jsx("td", { children: p.plant }), _jsx("td", { children: p.progress.globalPercent }), _jsx("td", { children: p.progress.overdueCount }), _jsx("td", { children: p.progress.blockedCount }), _jsx("td", { children: Object.entries(p.progress.byStep)
                                        .map(([step, value]) => `${step}: ${value.percent}%`)
                                        .join(' | ') })] }, p.projectNumber))) })] })] }));
};

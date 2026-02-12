import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const claims = accounts[0]?.idTokenClaims?.groups ?? [];
    const isAdmin = claims.some((g) => adminGroupIds.includes(g));
    const [form, setForm] = useState({
        plant: '',
        projectNumber: '',
        projectName: '',
        startDate: '',
        endDate: ''
    });
    if (!isAdmin)
        return _jsx("p", { children: "Admin role required to create projects." });
    return (_jsxs("form", { onSubmit: async (e) => {
            e.preventDefault();
            await api.createProject(instance, form);
            navigate('/');
        }, style: { display: 'grid', gap: 8, maxWidth: 500 }, children: [Object.entries(form).map(([key, value]) => (_jsx("input", { placeholder: key, type: key.includes('Date') ? 'date' : 'text', value: value, onChange: (e) => setForm((prev) => ({ ...prev, [key]: e.target.value })), required: true }, key))), _jsx("button", { type: "submit", children: "Create project" })] }));
};

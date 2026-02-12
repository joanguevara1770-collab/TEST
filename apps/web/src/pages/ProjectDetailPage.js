import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
export const ProjectDetailPage = () => {
    const { projectNumber = '' } = useParams();
    const { instance } = useMsal();
    const [project, setProject] = useState(null);
    const load = () => api.getProject(instance, projectNumber).then(setProject);
    useEffect(() => {
        load().catch(console.error);
    }, [projectNumber]);
    if (!project)
        return _jsx("p", { children: "Loading..." });
    return (_jsxs("div", { children: [_jsxs("h2", { children: [project.projectNumber, " - ", project.projectName] }), _jsx("button", { onClick: async () => {
                    const csv = await api.exportProject(instance, projectNumber);
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `${projectNumber}.csv`;
                    a.click();
                }, children: "Export CSV" }), _jsxs("table", { width: "100%", cellPadding: 6, border: 1, style: { borderCollapse: 'collapse', marginTop: 12 }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Step" }), _jsx("th", { children: "Activity" }), _jsx("th", { children: "Owner" }), _jsx("th", { children: "Due Date" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "N/A" }), _jsx("th", { children: "Notes" }), _jsx("th", { children: "Save" })] }) }), _jsx("tbody", { children: project.activities.map((activity) => (_jsx(EditableRow, { activity: activity, onSave: async (payload) => {
                                await api.updateActivity(instance, activity.id, payload);
                                await load();
                            } }, activity.id))) })] })] }));
};
const EditableRow = ({ activity, onSave }) => {
    const [state, setState] = useState(activity);
    return (_jsxs("tr", { children: [_jsxs("td", { children: [state.stepNumber, " - ", state.stepName] }), _jsx("td", { children: state.activityName }), _jsx("td", { children: _jsx("input", { value: state.owner, onChange: (e) => setState({ ...state, owner: e.target.value }) }) }), _jsx("td", { children: _jsx("input", { type: "date", value: state.dueDate?.slice(0, 10) ?? '', onChange: (e) => setState({ ...state, dueDate: e.target.value }) }) }), _jsx("td", { children: _jsxs("select", { value: state.status, onChange: (e) => setState({ ...state, status: e.target.value }), children: [_jsx("option", { children: "Not Started" }), _jsx("option", { children: "In Progress" }), _jsx("option", { children: "Done" }), _jsx("option", { children: "Blocked" })] }) }), _jsx("td", { children: _jsx("input", { type: "checkbox", checked: state.isNotApplicable, onChange: (e) => setState({ ...state, isNotApplicable: e.target.checked }) }) }), _jsx("td", { children: _jsx("input", { value: state.notes, onChange: (e) => setState({ ...state, notes: e.target.value }) }) }), _jsx("td", { children: _jsx("button", { onClick: () => onSave({ owner: state.owner, dueDate: state.dueDate, status: state.status, isNotApplicable: state.isNotApplicable, notes: state.notes }), children: "Save" }) })] }));
};

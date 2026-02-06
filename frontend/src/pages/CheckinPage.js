import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { apiClient } from '../services/api';
import { setRefCode, setSessionToken, setAttendeeInfo } from '../services/supabase';
export default function CheckinPage() {
    const { eventSlug } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Name is required');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.checkin({
                eventSlug: eventSlug || '',
                name,
                email: email || undefined,
                role: role || undefined,
            });
            // Store session
            setRefCode(response.refCode);
            setSessionToken(response.sessionToken);
            setAttendeeInfo({
                name: response.name,
                email: email || null,
                role: role || null,
                attendeeId: response.attendeeId
            });
            // Navigate to log conversation page
            navigate(`/e/${eventSlug}/log`);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Check-in failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { style: { padding: '2rem', maxWidth: '500px', margin: '0 auto' }, children: [_jsx("h2", { children: "Check In" }), error && _jsx("div", { style: { color: '#ef4444', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem' }, children: error }), _jsxs("form", { style: { marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }, onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { children: "Name *" }), _jsx("input", { type: "text", placeholder: "Your full name", required: true, value: name, onChange: (e) => setName(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { children: "Email (Optional)" }), _jsx("input", { type: "email", placeholder: "your@email.com", value: email, onChange: (e) => setEmail(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { children: "Role (Optional)" }), _jsxs("select", { value: role, onChange: (e) => setRole(e.target.value), children: [_jsx("option", { value: "", children: "Select..." }), _jsx("option", { value: "student", children: "Student" }), _jsx("option", { value: "speaker", children: "Speaker" }), _jsx("option", { value: "organizer", children: "Organizer" }), _jsx("option", { value: "guest", children: "Guest" })] })] }), _jsx("button", { type: "submit", style: { backgroundColor: '#6366f1', color: 'white' }, disabled: loading, children: loading ? 'Checking in...' : 'Check In' })] })] }));
}

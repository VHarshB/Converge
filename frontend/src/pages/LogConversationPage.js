import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { apiClient } from '../services/api';
import { useSession } from '../hooks/useSession';
export default function LogConversationPage() {
    const { eventSlug } = useParams();
    const navigate = useNavigate();
    const { refCode } = useSession();
    const [toRefCode, setToRefCode] = useState('');
    const [topics, setTopics] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    if (!refCode) {
        return (_jsx("div", { style: { padding: '2rem', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }, children: _jsxs("p", { children: ["Not checked in. ", _jsx("a", { href: "/", style: { color: '#6366f1' }, children: "Return to event" })] }) }));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!toRefCode.trim()) {
            setError('Partner reference code is required');
            return;
        }
        if (toRefCode.toUpperCase() === refCode.toUpperCase()) {
            setError('You cannot log a conversation with yourself');
            return;
        }
        if (!topics.trim()) {
            setError('Topics are required');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess(false);
        try {
            const topicsArray = topics.split(',').map(t => t.trim()).filter(t => t);
            await apiClient.logConversation({
                eventSlug: eventSlug || '',
                fromRefCode: refCode,
                toRefCode: toRefCode.toUpperCase(),
                topics: topicsArray,
                note: note || undefined,
            });
            setSuccess(true);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to log conversation');
        }
        finally {
            setLoading(false);
        }
    };
    const handleLogNew = () => {
        setSuccess(false);
        setToRefCode('');
        setTopics('');
        setNote('');
        setError('');
    };
    return (_jsxs("div", { style: { padding: '2rem', maxWidth: '500px', margin: '0 auto' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }, children: [_jsx("h2", { style: { margin: 0 }, children: "Log Conversation" }), _jsx("button", { style: { padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '0.375rem', cursor: 'pointer' }, onClick: () => navigate(`/e/${eventSlug}/me`), children: "My Profile" })] }), success && (_jsxs("div", { style: {
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    padding: '1.5rem',
                    borderRadius: '0.375rem',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }, children: [_jsx("p", { style: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }, children: "\u2713 Conversation Logged Successfully!" }), _jsxs("div", { style: { display: 'flex', gap: '1rem', justifyContent: 'center' }, children: [_jsx("button", { style: { padding: '0.75rem 1.5rem', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 'bold' }, onClick: handleLogNew, children: "Log New Conversation" }), _jsx("button", { style: { padding: '0.75rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 'bold' }, onClick: () => navigate(`/e/${eventSlug}/leaderboard`), children: "View Leaderboard" })] })] })), error && (_jsx("div", { style: {
                    color: '#ef4444',
                    marginBottom: '1rem',
                    padding: '0.5rem',
                    backgroundColor: '#fee2e2',
                    borderRadius: '0.375rem'
                }, children: error })), !success && (_jsxs("form", { style: { marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }, onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { children: "Your Reference Code" }), _jsx("input", { type: "text", value: refCode, disabled: true, style: { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } })] }), _jsxs("div", { children: [_jsx("label", { children: "Partner Reference Code *" }), _jsx("input", { type: "text", placeholder: "e.g., CVG-7K2P", required: true, value: toRefCode, onChange: (e) => setToRefCode(e.target.value.toUpperCase()) })] }), _jsxs("div", { children: [_jsx("label", { children: "Topics * (comma-separated)" }), _jsx("input", { type: "text", placeholder: "e.g., MVP, Funding, Technology", required: true, value: topics, onChange: (e) => setTopics(e.target.value), style: { padding: '0.75rem' } }), _jsx("small", { style: { color: '#6b7280', display: 'block', marginTop: '0.25rem' }, children: "Enter topics separated by commas" })] }), _jsxs("div", { children: [_jsx("label", { children: "Notes (Optional, max 180 characters)" }), _jsx("textarea", { placeholder: "What did you discuss?", maxLength: 180, value: note, onChange: (e) => setNote(e.target.value), style: { minHeight: '100px' } }), _jsxs("small", { style: { color: '#6b7280' }, children: [note.length, "/180"] })] }), _jsx("button", { type: "submit", style: { backgroundColor: '#6366f1', color: 'white', padding: '0.75rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' }, disabled: loading, children: loading ? 'Submitting...' : 'Log Conversation' })] }))] }));
}

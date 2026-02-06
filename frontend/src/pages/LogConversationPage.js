import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { apiClient } from '../services/api';
import { useSession } from '../hooks/useSession';
const TOPICS = ['MVP', 'Funding', 'Technology', 'Marketing', 'Team', 'Customer Acquisition', 'Product', 'Other'];
export default function LogConversationPage() {
    const { eventSlug } = useParams();
    const navigate = useNavigate();
    const { refCode } = useSession();
    const [toRefCode, setToRefCode] = useState('');
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    if (!refCode) {
        return (_jsx("div", { style: { padding: '2rem', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }, children: _jsxs("p", { children: ["Not checked in. ", _jsx("a", { href: "/", style: { color: '#6366f1' }, children: "Return to event" })] }) }));
    }
    const handleTopicChange = (topic) => {
        setSelectedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
    };
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
        setLoading(true);
        setError('');
        setSuccess(false);
        try {
            await apiClient.logConversation({
                eventSlug: eventSlug || '',
                fromRefCode: refCode,
                toRefCode: toRefCode.toUpperCase(),
                topics: selectedTopics,
                note: note || undefined,
            });
            setSuccess(true);
            setToRefCode('');
            setSelectedTopics([]);
            setNote('');
            setTimeout(() => {
                navigate(`/e/${eventSlug}/leaderboard`);
            }, 2000);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to log conversation');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { style: { padding: '2rem', maxWidth: '500px', margin: '0 auto' }, children: [_jsx("h2", { children: "Log Conversation" }), success && (_jsx("div", { style: {
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    marginBottom: '1rem'
                }, children: "\u2713 Conversation logged! Redirecting to leaderboard..." })), error && (_jsx("div", { style: {
                    color: '#ef4444',
                    marginBottom: '1rem',
                    padding: '0.5rem',
                    backgroundColor: '#fee2e2',
                    borderRadius: '0.375rem'
                }, children: error })), _jsxs("form", { style: { marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }, onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { children: "Your Reference Code" }), _jsx("input", { type: "text", value: refCode, disabled: true, style: { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } })] }), _jsxs("div", { children: [_jsx("label", { children: "Partner Reference Code *" }), _jsx("input", { type: "text", placeholder: "e.g., CVG-7K2P", required: true, value: toRefCode, onChange: (e) => setToRefCode(e.target.value.toUpperCase()) })] }), _jsxs("div", { children: [_jsx("label", { children: "Topics (Select at least one *)" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }, children: TOPICS.map(topic => (_jsxs("label", { style: { display: 'flex', gap: '0.5rem', alignItems: 'center' }, children: [_jsx("input", { type: "checkbox", checked: selectedTopics.includes(topic), onChange: () => handleTopicChange(topic) }), _jsx("span", { children: topic })] }, topic))) })] }), _jsxs("div", { children: [_jsx("label", { children: "Notes (Optional, max 180 characters)" }), _jsx("textarea", { placeholder: "What did you discuss?", maxLength: 180, value: note, onChange: (e) => setNote(e.target.value), style: { minHeight: '100px' } }), _jsxs("small", { style: { color: '#6b7280' }, children: [note.length, "/180"] })] }), _jsx("button", { type: "submit", style: { backgroundColor: '#6366f1', color: 'white' }, disabled: loading || selectedTopics.length === 0, children: loading ? 'Submitting...' : 'Submit' })] })] }));
}

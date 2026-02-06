import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, useParams } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { clearSession } from '../services/supabase';
export default function MyPassPage() {
    const { eventSlug } = useParams();
    const { refCode, attendeeInfo } = useSession();
    const navigate = useNavigate();
    if (!refCode) {
        return (_jsx("div", { style: { padding: '2rem', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }, children: _jsxs("p", { children: ["Not checked in. ", _jsx("a", { href: "/", style: { color: '#6366f1' }, children: "Return to event" })] }) }));
    }
    const handleLogout = () => {
        clearSession();
        navigate('/');
    };
    return (_jsxs("div", { style: { padding: '2rem', maxWidth: '500px', margin: '0 auto' }, children: [_jsx("h2", { children: "My Profile" }), attendeeInfo && (_jsxs("div", { style: {
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem'
                }, children: [_jsxs("div", { style: { marginBottom: '0.75rem' }, children: [_jsx("strong", { children: "Name:" }), " ", attendeeInfo.name] }), attendeeInfo.email && (_jsxs("div", { style: { marginBottom: '0.75rem' }, children: [_jsx("strong", { children: "Email:" }), " ", attendeeInfo.email] })), attendeeInfo.role && (_jsxs("div", { children: [_jsx("strong", { children: "Role:" }), " ", attendeeInfo.role] }))] })), _jsxs("div", { style: {
                    marginTop: '2rem',
                    padding: '2rem',
                    border: '2px solid #6366f1',
                    borderRadius: '0.75rem',
                    textAlign: 'center'
                }, children: [_jsx("p", { style: { color: '#6b7280' }, children: "Your Reference Code:" }), _jsx("h3", { style: { fontSize: '2.5rem', fontFamily: 'monospace', marginTop: '1rem' }, children: refCode }), _jsx("p", { style: { marginTop: '1rem', color: '#6b7280' }, children: "Share this code with others to log conversations" })] }), _jsxs("div", { style: { marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }, children: [_jsx("button", { style: { width: '100%', backgroundColor: '#6366f1', color: 'white', padding: '0.75rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }, onClick: () => navigate(`/e/${eventSlug}/log`), children: "Log Conversation" }), _jsx("button", { style: { width: '100%', backgroundColor: '#10b981', color: 'white', padding: '0.75rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }, onClick: () => navigate(`/e/${eventSlug}/leaderboard`), children: "View Leaderboard" }), _jsx("button", { style: { width: '100%', backgroundColor: '#ef4444', color: 'white', padding: '0.75rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }, onClick: handleLogout, children: "Logout" })] })] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link } from 'react-router-dom';
export default function EventLanding() {
    const { eventSlug } = useParams();
    const defaultSlug = eventSlug || 'sample-event';
    return (_jsxs("div", { style: { padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }, children: [_jsxs("div", { style: { marginBottom: '2rem' }, children: [_jsx("h1", { style: { fontSize: '2.5rem', marginBottom: '0.5rem' }, children: "Welcome to Converge" }), _jsx("p", { style: { fontSize: '1.1rem', color: '#6b7280' }, children: "Networking made easy" })] }), _jsxs("div", { style: {
                    backgroundColor: '#f3f4f6',
                    padding: '2rem',
                    borderRadius: '0.75rem',
                    marginBottom: '2rem'
                }, children: [_jsx("p", { style: { color: '#6b7280', marginBottom: '1rem' }, children: "This is your event check-in and networking platform" }), _jsxs("p", { style: { fontSize: '0.9rem', color: '#9ca3af' }, children: ["Event: ", _jsx("strong", { children: defaultSlug })] })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: [_jsx(Link, { to: `/e/${defaultSlug}/checkin`, style: {
                            padding: '1rem 2rem',
                            backgroundColor: '#6366f1',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: '500',
                            transition: 'opacity 0.2s',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-block'
                        }, children: "Check In" }), _jsx(Link, { to: `/e/${defaultSlug}/log`, style: {
                            padding: '1rem 2rem',
                            backgroundColor: '#ec4899',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: '500',
                            transition: 'opacity 0.2s',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-block'
                        }, children: "Log Conversation" }), _jsx(Link, { to: `/e/${defaultSlug}/leaderboard`, style: {
                            padding: '1rem 2rem',
                            backgroundColor: '#8b5cf6',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: '500',
                            transition: 'opacity 0.2s',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-block'
                        }, children: "View Leaderboard" })] })] }));
}

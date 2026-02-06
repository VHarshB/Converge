import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link } from 'react-router-dom';
import { useLeaderboard } from '../hooks/useLeaderboard';
export default function LeaderboardPage() {
    const { eventSlug } = useParams();
    const { leaderboard, isLocked, loading, error } = useLeaderboard(eventSlug);
    if (loading) {
        return (_jsx("div", { style: { padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }, children: _jsx("p", { children: "Loading leaderboard..." }) }));
    }
    if (error) {
        return (_jsxs("div", { style: { padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }, children: [_jsxs("p", { style: { color: '#ef4444' }, children: ["Error: ", error] }), _jsx(Link, { to: `/e/${eventSlug}`, style: { color: '#6366f1' }, children: "Back to event" })] }));
    }
    return (_jsxs("div", { style: { padding: '2rem', maxWidth: '600px', margin: '0 auto' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }, children: [_jsx("h2", { children: "Leaderboard" }), isLocked && _jsx("span", { style: { backgroundColor: '#fed7aa', padding: '0.5rem 1rem', borderRadius: '0.375rem' }, children: "\uD83D\uDD12 Locked" })] }), leaderboard.length === 0 ? (_jsx("p", { style: { textAlign: 'center', color: '#6b7280' }, children: "No one on the leaderboard yet" })) : (_jsxs("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { borderBottom: '2px solid #e5e7eb' }, children: [_jsx("th", { style: { padding: '0.75rem', textAlign: 'left' }, children: "Rank" }), _jsx("th", { style: { padding: '0.75rem', textAlign: 'left' }, children: "Name" }), _jsx("th", { style: { padding: '0.75rem', textAlign: 'right' }, children: "Partners" }), _jsx("th", { style: { padding: '0.75rem', textAlign: 'right' }, children: "Score" })] }) }), _jsx("tbody", { children: leaderboard.map(entry => (_jsxs("tr", { style: { borderBottom: '1px solid #e5e7eb' }, children: [_jsx("td", { style: { padding: '0.75rem', fontWeight: 'bold' }, children: entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank }), _jsx("td", { style: { padding: '0.75rem' }, children: entry.displayName }), _jsx("td", { style: { padding: '0.75rem', textAlign: 'right' }, children: entry.uniquePartners }), _jsx("td", { style: { padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#6366f1' }, children: entry.score })] }, entry.rank))) })] })), _jsx(Link, { to: `/e/${eventSlug}`, style: {
                    display: 'inline-block',
                    marginTop: '2rem',
                    color: '#6366f1',
                    textDecoration: 'none'
                }, children: "\u2190 Back to event" })] }));
}

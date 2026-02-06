import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useSession } from '../hooks/useSession';
export default function LeaderboardPage() {
    const { eventSlug } = useParams();
    const navigate = useNavigate();
    const { hasSession } = useSession();
    const [selectedCategory, setSelectedCategory] = useState('overall');
    const { leaderboard, isLocked, loading, error } = useLeaderboard(eventSlug, selectedCategory);
    const categories = [
        { id: 'overall', name: '🏆 Overall', desc: 'Most Connections' },
        { id: 'quality', name: '⭐ Best Quality', desc: 'Highest AI Scores' },
        { id: 'relevance', name: '🎯 Most Relevant', desc: 'On-Topic Conversations' },
        { id: 'weird', name: '🤪 Most Weird', desc: 'Creative & Unique' },
        { id: 'offtrack', name: '🌀 Most Off-Track', desc: 'Wandered the Most' },
    ];
    if (loading) {
        return (_jsx("div", { style: { padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }, children: _jsx("p", { children: "Loading leaderboard..." }) }));
    }
    if (error) {
        return (_jsxs("div", { style: { padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }, children: [_jsxs("p", { style: { color: '#ef4444' }, children: ["Error: ", error] }), _jsx(Link, { to: `/e/${eventSlug}`, style: { color: '#6366f1' }, children: "Back to event" })] }));
    }
    return (_jsxs("div", { style: { padding: '2rem', maxWidth: '800px', margin: '0 auto' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }, children: [_jsx("h2", { children: "Leaderboard" }), isLocked && _jsx("span", { style: { backgroundColor: '#fed7aa', padding: '0.5rem 1rem', borderRadius: '0.375rem' }, children: "\uD83D\uDD12 Locked" })] }), _jsxs("div", { style: { marginBottom: '2rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }, children: [categories.map(cat => (_jsxs("button", { style: {
                            padding: '0.75rem 1rem',
                            backgroundColor: selectedCategory === cat.id ? '#6366f1' : '#f3f4f6',
                            color: selectedCategory === cat.id ? 'white' : '#374151',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: selectedCategory === cat.id ? 'bold' : 'normal',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }, onClick: () => setSelectedCategory(cat.id), children: [_jsx("div", { children: cat.name }), _jsx("div", { style: { fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }, children: cat.desc })] }, cat.id))), selectedCategory !== 'overall' && (_jsx("div", { style: {
                            padding: '0.75rem 1rem',
                            backgroundColor: '#fef3c7',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            marginLeft: '0.5rem',
                            display: 'flex',
                            alignItems: 'center'
                        }, children: "\u2728 AI-Powered Scoring" }))] }), leaderboard.length === 0 ? (_jsx("p", { style: { textAlign: 'center', color: '#6b7280' }, children: "No one on the leaderboard yet" })) : (_jsxs("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { borderBottom: '2px solid #e5e7eb' }, children: [_jsx("th", { style: { padding: '0.75rem', textAlign: 'left' }, children: "Rank" }), _jsx("th", { style: { padding: '0.75rem', textAlign: 'left' }, children: "Name" }), selectedCategory === 'overall' && (_jsx("th", { style: { padding: '0.75rem', textAlign: 'right' }, children: "Partners" })), _jsx("th", { style: { padding: '0.75rem', textAlign: 'right' }, children: "Score" })] }) }), _jsx("tbody", { children: leaderboard.map(entry => (_jsxs("tr", { style: { borderBottom: '1px solid #e5e7eb' }, children: [_jsx("td", { style: { padding: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem' }, children: entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank }), _jsx("td", { style: { padding: '0.75rem' }, children: entry.displayName }), selectedCategory === 'overall' && (_jsx("td", { style: { padding: '0.75rem', textAlign: 'right' }, children: entry.uniquePartners })), _jsx("td", { style: { padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#6366f1', fontSize: '1.125rem' }, children: entry.score })] }, entry.rank))) })] })), _jsx(Link, { to: `/e/${eventSlug}`, style: {
                    display: 'inline-block',
                    marginTop: '2rem',
                    color: '#6366f1',
                    textDecoration: 'none'
                }, children: "\u2190 Back to event" }), hasSession && (_jsxs("div", { style: { marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }, children: [_jsx("button", { style: { padding: '0.75rem 1.5rem', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }, onClick: () => navigate(`/e/${eventSlug}/log`), children: "Log Conversation" }), _jsx("button", { style: { padding: '0.75rem 1.5rem', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '0.375rem', cursor: 'pointer' }, onClick: () => navigate(`/e/${eventSlug}/me`), children: "My Profile" })] }))] }));
}

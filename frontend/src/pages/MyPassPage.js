import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { clearSession } from '../services/supabase';
export default function MyPassPage() {
    const { refCode } = useSession();
    const navigate = useNavigate();
    if (!refCode) {
        return (_jsx("div", { style: { padding: '2rem', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }, children: _jsxs("p", { children: ["Not checked in. ", _jsx("a", { href: "/", style: { color: '#6366f1' }, children: "Return to event" })] }) }));
    }
    const handleLogout = () => {
        clearSession();
        navigate('/');
    };
    return (_jsxs("div", { style: { padding: '2rem', maxWidth: '500px', margin: '0 auto' }, children: [_jsx("h2", { children: "My Pass" }), _jsxs("div", { style: {
                    marginTop: '2rem',
                    padding: '2rem',
                    border: '2px solid #6366f1',
                    borderRadius: '0.75rem',
                    textAlign: 'center'
                }, children: [_jsx("p", { style: { color: '#6b7280' }, children: "Your Reference Code:" }), _jsx("h3", { style: { fontSize: '2.5rem', fontFamily: 'monospace', marginTop: '1rem' }, children: refCode }), _jsx("p", { style: { marginTop: '1rem', color: '#6b7280' }, children: "Share this code with others to log conversations" })] }), _jsx("button", { style: { width: '100%', marginTop: '2rem', backgroundColor: '#6366f1', color: 'white' }, onClick: handleLogout, children: "Logout" })] }));
}

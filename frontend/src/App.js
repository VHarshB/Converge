import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import EventLanding from './pages/EventLanding';
import CheckinPage from './pages/CheckinPage';
import MyPassPage from './pages/MyPassPage';
import LogConversationPage from './pages/LogConversationPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(EventLanding, {}) }), _jsx(Route, { path: "/e/:eventSlug", element: _jsx(EventLanding, {}) }), _jsx(Route, { path: "/e/:eventSlug/checkin", element: _jsx(CheckinPage, {}) }), _jsx(Route, { path: "/e/:eventSlug/me", element: _jsx(MyPassPage, {}) }), _jsx(Route, { path: "/e/:eventSlug/log", element: _jsx(LogConversationPage, {}) }), _jsx(Route, { path: "/e/:eventSlug/leaderboard", element: _jsx(LeaderboardPage, {}) }), _jsx(Route, { path: "/admin/login", element: _jsx(AdminLogin, {}) }), _jsx(Route, { path: "/admin/events/:eventId/*", element: _jsx(AdminDashboard, {}) })] }));
}
export default App;
